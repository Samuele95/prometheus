// Render the README images from site-design/readme-art/art.html with the site's own fonts and tokens.
// Usage: node scripts/readme-art.mjs [out-dir]   (default: ../assets)
import puppeteer from 'puppeteer-core';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(process.argv[2] ?? resolve(here, '../../assets'));
const page = 'file://' + resolve(here, '../../site-design/readme-art/art.html');
const shots = { banner: 'banner.png', social: 'social-preview.png', 'card-01': 'card-01.png', 'card-02': 'card-02.png', 'card-03': 'card-03.png',
  operators: 'readme-operators.png', layers: 'readme-layers.png', modes: 'readme-modes.png', pipeline: 'readme-pipeline.png' };
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const t = await b.newPage(); await t.setViewport({ width: 1400, height: 1000, deviceScaleFactor: 2 });
await t.goto(page, { waitUntil: 'networkidle0' }); await t.evaluate(() => document.fonts.ready);
for (const [id, file] of Object.entries(shots)) { const el = await t.$('#' + id); await el.screenshot({ path: `${out}/${file}` }); console.log('WROTE:', file); }
await b.close();
