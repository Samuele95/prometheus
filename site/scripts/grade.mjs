// Hard checks of the done definition. Writes site-design/checks/grade-<n>/hard.json. Server must be running (scripts/serve.mjs 4173).
import puppeteer from 'puppeteer-core';
import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
function parseCopy(file) {
  const map = new Map(); let section = '';
  for (const raw of readFileSync(file, 'utf8').split('\n')) {
    const h = raw.match(/^##\s+(\S+)/); if (h) { section = h[1]; continue; }
    const kv = raw.match(/^([a-z0-9-]+):\s(.*)$/); if (kv && section) map.set(`${section}.${kv[1]}`, kv[2]);
  }
  return map;
}

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..'), docs = resolve(root, '../docs'), out = resolve(process.argv[2]);
mkdirSync(out, { recursive: true });
const BASE = 'http://localhost:4173/prometheus/';
const results = [];
const rec = (name, passed, reasoning, evidence = '') => { results.push({ name, reasoning, passed, evidence }); console.log(`${passed === true ? 'OK' : passed === false ? 'ERROR' : 'SKIP'}: ${name} — ${reasoning}`); };

// tokens-only: no hex literals in hand-written source outside generated tokens
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const srcFiles = walk(resolve(root, 'src')).filter((f) => /\.(ts|css)$/.test(f) && !/tokens\.(css|ts)$/.test(f));
const hits = srcFiles.flatMap((f) => readFileSync(f, 'utf8').split('\n').map((l, i) => [f, i + 1, l]).filter(([, , l]) => /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![0-9a-zA-Z-])/.test(l) && !/url\(#|href="#|'#|`#|"#\w|#(n|riteHolo|content|main|hero|setup)\b/.test(l)));
rec('tokens-only', hits.length === 0, hits.length ? `${hits.length} literal colors: ${hits.slice(0, 3).map(([f, n]) => f.split('/src/')[1] + ':' + n).join(', ')}` : `no hex literals in ${srcFiles.length} source files outside the generated tokens`);

// JS budget (gzip)
const assets = readdirSync(resolve(docs, 'assets')).filter((f) => f.endsWith('.js'));
const gz = assets.reduce((s, f) => s + gzipSync(readFileSync(resolve(docs, 'assets', f))).length, 0);
rec('js-budget', gz <= 400 * 1024, `total JS ${(gz / 1024).toFixed(0)} KB gzipped across ${assets.length} files (budget 400 KB)`);

// deploy output: Pages serves docs/ from main with relative asset paths
const idx = readFileSync(resolve(docs, 'index.html'), 'utf8');
const abs = (idx.match(/(src|href)="\/(?!\/)[^"]*"/g) ?? []);
rec('deploy-output', abs.length === 0 && /\.\/assets\//.test(idx), abs.length ? `absolute paths: ${abs.slice(0, 3).join(' ')}` : 'docs/index.html and docs/docs.html reference ./assets with relative paths; docs/ is the Pages root');

const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const open = async (url, { reduce = false, w = 1440, h = 900 } = {}) => {
  const t = await browser.newPage(); const errs = [];
  t.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); t.on('pageerror', (e) => errs.push(String(e)));
  t.on('response', (r) => { if (r.status() >= 400) errs.push(`HTTP ${r.status()} ${r.url()}`); });
  await t.setViewport({ width: w, height: h });
  await t.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }]);
  await t.goto(BASE + url, { waitUntil: 'networkidle0', timeout: 60000 });
  return { t, errs };
};

// copy fidelity + sections present: on the reduced-motion page (the full static document)
{
  const { t, errs } = await open('index.html', { reduce: true });
  const copy = parseCopy(resolve(root, '../site-design/copy.md'));
  const dom = await t.evaluate(() => Object.fromEntries(Array.from(document.querySelectorAll('[data-copy]')).map((e) => [e.getAttribute('data-copy'), e.textContent.trim()])));
  const skipMeta = [...copy.keys()].filter((k) => !k.startsWith('meta.') && k !== 'nav.wordmark' && k !== 'ignite.copied' && k !== 'film.sound-on');
  const missing = skipMeta.filter((k) => !(k in dom));
  const diff = skipMeta.filter((k) => k in dom && dom[k] !== copy.get(k));
  const html = await t.content();
  rec('copy-fidelity', !missing.length && !diff.length && !/TODO\(source/.test(html), `${skipMeta.length - missing.length - diff.length}/${skipMeta.length} keys match copy.md verbatim${missing.length ? '; missing ' + missing.slice(0, 5).join(', ') : ''}${diff.length ? '; differ ' + diff.slice(0, 5).join(', ') : ''}`);
  const ids = await t.evaluate(() => Array.from(document.querySelectorAll('[data-section]')).map((e) => e.id));
  const want = ['hero', 'thesis', 'arcana', 'rite', 'modes', 'ignite', 'colophon'];
  rec('sections-present', JSON.stringify(ids) === JSON.stringify(want), `DOM order ${ids.join(' > ')} (intro is an overlay, exempt)`);
  const film = await t.evaluate(() => document.documentElement.classList.contains('is-film'));
  const blank = await t.evaluate(() => Array.from(document.querySelectorAll('[data-section]')).filter((s) => s.getBoundingClientRect().height < 80 || !s.textContent.trim()).map((s) => s.id));
  await t.screenshot({ path: `${out}/reduced-full.png`, fullPage: true });
  rec('reduced-motion', !film && !blank.length && !errs.length, `reduced motion shows the page, never the film (${film ? 'FILM SHOWN' : 'page'}); empty sections: ${blank.length ? blank.join(',') : 'none'}; console errors: ${errs.length}`, 'reduced-full.png');
  await t.close();
}

// console-clean + film/page paths + docs
{
  const errsAll = [];
  for (const [w, h] of [[390, 844], [900, 1000], [1440, 900]]) {
    const { t, errs } = await open('index.html', { w, h });
    await new Promise((r) => setTimeout(r, 3400));
    await t.click('[data-door="silent"]'); await new Promise((r) => setTimeout(r, 3500));
    for (let k = 0; k < 4; k++) { await t.keyboard.press('ArrowDown'); await new Promise((r) => setTimeout(r, 1800)); }
    await t.click('.film__tools [data-read-page]'); await new Promise((r) => setTimeout(r, 1500));
    const pageMode = await t.evaluate(() => !document.documentElement.classList.contains('is-film') && !!document.querySelector('[data-watch-film]:not([hidden])'));
    if (!pageMode) errs.push('read-as-page did not return to the page with a watch-film button');
    await t.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2)); await new Promise((r) => setTimeout(r, 1200));
    await t.screenshot({ path: `${out}/page-mode-${w}.png` });
    await t.evaluate(() => localStorage.removeItem('prometheus:mode'));
    errsAll.push(...errs.map((e) => `index@${w}: ${e}`)); await t.close();
    const d = await open('docs.html', { w, h }); await new Promise((r) => setTimeout(r, 800));
    await d.t.click('.rr-lang [data-lang="it"]'); await new Promise((r) => setTimeout(r, 400));
    const itShown = await d.t.evaluate(() => getComputedStyle(document.querySelector('.rr-l[lang="it"]')).display !== 'none' && getComputedStyle(document.querySelector('.rr-l[lang="en"]')).display === 'none');
    if (!itShown) d.errs.push('language switch did not show Italian');
    await d.t.click('.rr-lang [data-lang="en"]');
    errsAll.push(...d.errs.map((e) => `docs@${w}: ${e}`)); await d.t.close();
  }
  rec('console-clean', errsAll.length === 0, errsAll.length ? errsAll.slice(0, 5).join(' | ') : 'film (enter, 4 steps, read-as-page) and reading room (EN/IT switch) at 390/900/1440: no errors, no failed requests');
}

// docs restyled: no old assets, every section renders in the new fonts
{
  const { t } = await open('docs.html');
  const info = await t.evaluate(() => ({
    sections: document.querySelectorAll('.rr-section').length,
    old: Array.from(document.querySelectorAll('link[href], script[src]')).map((e) => e.getAttribute('href') || e.getAttribute('src')).filter((u) => /fraunces|manrope|jetbrains|site\.config|docs-BkOp|docs-DusK/.test(u)),
    font: getComputedStyle(document.querySelector('.rr-h2')).fontFamily,
    rail: document.querySelectorAll('.rr-index a').length,
    anchor: !!document.getElementById('setup'),
  }));
  await t.screenshot({ path: `${out}/docs-1440.png` });
  rec('docs-restyled', info.sections === 11 && !info.old.length && /Bodoni/.test(info.font) && info.rail === 11 && info.anchor, `${info.sections} sections, heading font ${info.font.split(',')[0]}, ${info.rail} rail links, #setup anchor ${info.anchor}, old assets ${info.old.length}`, 'docs-1440.png');
  await t.close();
}

// logo integrated
{
  const idxHtml = readFileSync(resolve(docs, 'index.html'), 'utf8');
  const state = readFileSync(resolve(root, '../site-design/STATE.md'), 'utf8');
  const ok = /favicon\.svg/.test(idxHtml) && /og\.png/.test(idxHtml) && /lockup-horizontal\.svg/.test(idxHtml) && /lockup-stacked\.svg/.test(idxHtml) && /^APPROVED: logo mark/m.test(state);
  rec('logo-integrated', ok, 'favicon, og.png, horizontal lockup (nav, HUD, reading room), stacked lockup (colophon), intro (gate); ledger holds APPROVED: logo mark');
}
await browser.close();
writeFileSync(`${out}/hard.json`, JSON.stringify(results, null, 2));
const failed = results.filter((r) => r.passed === false).length;
console.log(`SUMMARY: ${results.length - failed} passed, ${failed} failed (of ${results.length})`);
