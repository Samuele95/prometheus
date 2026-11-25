// Film check: enter the film, advance through every step, screenshot each, collect console errors.
// Usage: node scripts/film-check.mjs <out-dir> [width height]
import puppeteer from 'puppeteer-core';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const docsDir = resolve(here, '../../docs');
const out = resolve(process.argv[2]);
const [w, h] = [Number(process.argv[3] ?? 1440), Number(process.argv[4] ?? 900)];
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  let p = resolve(docsDir, '.' + url.slice('/prometheus'.length)); if (p.endsWith('/')) p += 'index.html';
  try { res.writeHead(200, { 'content-type': types[extname(p)] ?? 'application/octet-stream' }); res.end(await readFile(p)); } catch { res.writeHead(404); res.end(); }
}).listen(0);
await mkdir(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const tab = await browser.newPage();
const errs = [];
tab.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(`${m.type()}: ${m.text()}`); });
tab.on('pageerror', (e) => errs.push(String(e)));
await tab.setViewport({ width: w, height: h });
await tab.goto(`http://localhost:${server.address().port}/prometheus/index.html`, { waitUntil: 'networkidle0', timeout: 60000 });
await new Promise((r) => setTimeout(r, 3200));
await tab.screenshot({ path: `${out}/gate.png` });
await new Promise((r) => setTimeout(r, 3200));
await tab.click('[data-door="silent"]');
await new Promise((r) => setTimeout(r, 3500));
let i = 0;
for (;;) {
  await tab.screenshot({ path: `${out}/step-${String(i).padStart(2, '0')}.png` });
  const last = await tab.evaluate(() => document.querySelector('[data-film]')?.classList.contains('is-last'));
  if (last || i > 40) break;
  await tab.keyboard.press('ArrowDown');
  await new Promise((r) => setTimeout(r, 3400));
  i++;
}
console.log(`SUMMARY: ${i + 1} steps captured; ${errs.length} console errors/warnings`);
errs.slice(0, 15).forEach((e) => console.log('  ' + e));
await browser.close(); server.close();
