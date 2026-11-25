// Milestone check: load pages from the published docs/ folder at 390/900/1440 and under reduced motion,
// collect console errors, save screenshots. Usage: node scripts/check.mjs <out-dir> [page...]
import puppeteer from 'puppeteer-core';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const docsDir = resolve(here, '../../docs');
const out = resolve(process.argv[2] ?? resolve(here, '../../site-design/checks/latest'));
const pages = process.argv.slice(3).length ? process.argv.slice(3) : ['index.html', 'docs.html'];
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.md': 'text/plain', '.txt': 'text/plain' };

// serve docs/ under /prometheus/ exactly as GitHub Pages does
const server = createServer(async (req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  if (!url.startsWith('/prometheus/')) { res.writeHead(404); return res.end(); }
  let p = resolve(docsDir, '.' + url.slice('/prometheus'.length));
  if (p.endsWith('/')) p += 'index.html';
  try { const body = await readFile(p); res.writeHead(200, { 'content-type': types[extname(p)] ?? 'application/octet-stream' }); res.end(body); }
  catch { res.writeHead(404); res.end(); }
}).listen(0);
const port = server.address().port;
await mkdir(out, { recursive: true });

const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
let errors = 0, failures = 0;
for (const page of pages) {
  for (const [w, h, motion] of [[390, 844, 'no-preference'], [900, 1000, 'no-preference'], [1440, 900, 'no-preference'], [1440, 900, 'reduce']]) {
    const tab = await browser.newPage();
    const errs = [];
    tab.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    tab.on('pageerror', (e) => errs.push(String(e)));
    tab.on('requestfailed', (r) => errs.push(`requestfailed ${r.url()}`));
    tab.on('response', (r) => { if (r.status() >= 400) errs.push(`HTTP ${r.status()} ${r.url()}`); });
    await tab.setViewport({ width: w, height: h });
    await tab.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: motion }]);
    await tab.evaluateOnNewDocument(() => { try { sessionStorage.setItem('prometheus:intro', 'seen'); } catch {} });
    await tab.goto(`http://localhost:${port}/prometheus/${page}`, { waitUntil: 'networkidle0', timeout: 45000 });
    await new Promise((r) => setTimeout(r, 1200));
    const tag = `${page.replace('.html', '')}-${w}${motion === 'reduce' ? '-reduce' : ''}`;
    const height = await tab.evaluate(() => document.documentElement.scrollHeight);
    const live = page === 'index.html' && motion !== 'reduce';
    if (!live && height < 14000) await tab.screenshot({ path: `${out}/${tag}.png`, fullPage: true });
    else {
      const stops = live ? Array.from({ length: 15 }, (_, i) => i / 14) : [0, 0.12, 0.35, 0.7];
      for (const y of stops) {
        // scroll in small steps so scrubbed and once-only triggers fire as they would for a reader
        await tab.evaluate(async (target) => {
          const step = window.innerHeight / 3;
          while (Math.abs(window.scrollY - target) > step) { window.scrollBy(0, Math.sign(target - window.scrollY) * step); await new Promise((r) => requestAnimationFrame(() => r(null))); }
          window.scrollTo(0, target);
        }, Math.round((height - h) * y));
        await new Promise((r) => setTimeout(r, live ? 1400 : 300));
        await tab.screenshot({ path: `${out}/${tag}-at${String(Math.round(y * 100)).padStart(3, '0')}.png` });
      }
    }
    if (errs.length) { errors += errs.length; failures++; console.log(`ERROR: ${tag} — ${errs.length} console errors`); errs.slice(0, 5).forEach((e) => console.log('  ' + e)); }
    else console.log(`OK: ${tag}`);
    await tab.close();
  }
}
await browser.close(); server.close();
console.log(`SUMMARY: ${pages.length * 4 - failures} clean, ${failures} with errors (${errors} errors); screenshots in ${out}`);
process.exit(failures ? 1 : 0);
