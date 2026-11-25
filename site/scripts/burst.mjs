// Burst capture: step to a scene and capture frames across its whole animation. Usage: node scripts/burst.mjs <out> <step,step,...> [w h]
import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';
const [out, list, W = 1440, H = 900] = [process.argv[2], process.argv[3].split(',').map(Number), +(process.argv[4] ?? 1440), +(process.argv[5] ?? 900)];
await mkdir(out, { recursive: true });
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const t = await b.newPage(); const errs = [];
t.on('pageerror', (e) => errs.push(String(e))); t.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
await t.setViewport({ width: W, height: H });
await t.goto('http://localhost:4173/prometheus/index.html', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 3400)); await t.click('[data-door="silent"]'); await new Promise((r) => setTimeout(r, 3500));
let cur = 0;
for (const target of list) {
  while (cur < target - 1) { await t.keyboard.press('ArrowDown'); cur++; await new Promise((r) => setTimeout(r, 1400)); }
  await new Promise((r) => setTimeout(r, 1500));
  await t.keyboard.press('ArrowDown'); cur++;
  const N = +(process.env.BURST_N ?? 8), GAP = +(process.env.BURST_GAP ?? 650);
  for (let k = 0; k < N; k++) { await new Promise((r) => setTimeout(r, GAP)); await t.screenshot({ path: `${out}/s${String(target).padStart(2, '0')}-${k}.jpg`, type: 'jpeg', quality: 80 }); }
}
console.log('errors:', errs.length, errs.slice(0, 3).join(' | '));
await b.close();
