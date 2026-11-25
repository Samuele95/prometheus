import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const t = await b.newPage(); await t.setViewport({ width: 1440, height: 900 });
await t.evaluateOnNewDocument(() => { window.__lt = []; new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push(Math.round(e.duration)))).observe({ type: 'longtask', buffered: true }); });
await t.goto('http://localhost:4173/prometheus/index.html', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 3400));
const t0 = Date.now();
await t.click('[data-door="silent"]'); // a click includes the first pointer move: the build starts here, the worst case
await t.waitForFunction(() => document.querySelector('[data-film]').classList.contains('is-playing'), { timeout: 30000 });
console.log(`door click -> film playing: ${Date.now() - t0} ms (software GL); long tasks during build: ${JSON.stringify(await t.evaluate(() => window.__lt))}`);
await b.close();
