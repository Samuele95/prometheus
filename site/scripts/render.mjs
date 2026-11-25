// Deterministic film render for a video: a page-side time machine drives rAF, timers, GSAP and every CSS/Web Animation
// by exactly 1/FPS per frame; each frame is then captured. Recording-only: nothing here ships in the site.
// Usage: node scripts/render.mjs <out-dir> <width> <height> [maxSeconds]
import puppeteer from 'puppeteer-core';
import { mkdir, writeFile } from 'node:fs/promises';
const [out, W, H, maxS] = [process.argv[2], +process.argv[3], +process.argv[4], +(process.argv[5] ?? 1e9)];
const FPS = 30, DT = 1000 / FPS;
await mkdir(`${out}/frames`, { recursive: true });

const plan = [{ at: 3.6, act: 'enter' }];
let tt = 3.6 + 4.6;
// longer holds where a scene performs an event (the measurement, the choice, the audit, the delivery)
const hold = (id) => (id >= 11 && id <= 17 ? 3.8 : [2, 9, 10, 18, 24, 30].includes(id) ? 5.2 : 4.6);
for (let id = 1; id < 31; id++) { plan.push({ at: tt, act: 'next', step: id }); tt += hold(id); }
const END = Math.min(tt + 4, maxS);

const timeMachine = () => {
  const base = Date.now(); const tm = (window.__tm = { now: 0, timers: [], raf: [], id: 1 });
  performance.now = () => tm.now; Date.now = () => base + tm.now;
  window.requestAnimationFrame = (cb) => { const id = tm.id++; tm.raf.push([id, cb]); return id; };
  window.cancelAnimationFrame = (id) => { tm.raf = tm.raf.filter(([i]) => i !== id); };
  window.setTimeout = (cb, ms = 0, ...args) => { const id = tm.id++; tm.timers.push({ id, at: tm.now + Math.max(0, ms), cb: () => cb(...args) }); return id; };
  window.clearTimeout = (id) => { tm.timers = tm.timers.filter((t) => t.id !== id); };
  window.setInterval = (cb, ms) => { const id = tm.id++; const rep = () => { cb(); tm.timers.push({ id, at: tm.now + ms, cb: rep }); }; tm.timers.push({ id, at: tm.now + ms, cb: rep }); return id; };
  window.clearInterval = window.clearTimeout;
  window.requestIdleCallback = (cb) => window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 20 }), 1);
  tm.step = (dt) => {
    tm.now += dt;
    for (let guard = 0; guard < 50; guard++) {
      const due = tm.timers.filter((t) => t.at <= tm.now).sort((a, b) => a.at - b.at);
      if (!due.length) break;
      tm.timers = tm.timers.filter((t) => !due.includes(t));
      due.forEach((t) => { try { t.cb(); } catch (e) { console.error(e); } });
    }
    const q = tm.raf; tm.raf = [];
    q.forEach(([, cb]) => { try { cb(tm.now); } catch (e) { console.error(e); } });
    for (const a of document.getAnimations({ subtree: true })) {
      if (!a.__tm) { a.__tm = true; a.pause(); a.currentTime = 0; } else a.currentTime = (a.currentTime ?? 0) + dt;
    }
  };
  // the gate's ignition lives in an <img>; inline it so its animation runs on the same clock
  document.addEventListener('DOMContentLoaded', async () => {
    const img = document.querySelector('.film__gate-art'); if (!img) return;
    const svg = await (await fetch(img.src)).text();
    const holder = document.createElement('div'); holder.className = 'film__gate-art'; holder.innerHTML = svg; img.replaceWith(holder);
    holder.querySelector('svg').style.width = '100%'; holder.querySelector('svg').style.height = 'auto';
  });
};

const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 120000,
  args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'] });
const t = await b.newPage(); await t.setViewport({ width: W, height: H });
t.on('pageerror', (e) => console.log('PAGE ERROR', String(e)));
// warm the cache so the recorded visit never waits on the network
await t.goto('http://localhost:4173/prometheus/index.html', { waitUntil: 'networkidle0' });
await t.mouse.move(W / 2, H / 2); await new Promise((r) => setTimeout(r, 8000));
await t.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
await t.evaluateOnNewDocument(timeMachine);
await t.goto('http://localhost:4173/prometheus/index.html', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 800));

const cues = []; let next = 0; const n = Math.round(END * FPS); const started = Date.now();
for (let f = 0; f < n; f++) {
  const time = f / FPS, a = time * 0.35;
  await t.mouse.move(W / 2 + Math.cos(a) * W * 0.16, H / 2 + Math.sin(a * 0.7) * H * 0.13);
  while (next < plan.length && plan[next].at <= time) {
    const p = plan[next++];
    if (p.act === 'enter') {
      const [x, y] = await t.evaluate(() => { const r = document.querySelector('[data-door="sound"]').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
      await t.mouse.move(x, y); await t.mouse.down(); await t.mouse.up(); cues.push({ t: time, kind: 'enter' });
    }
    if (p.act === 'next') {
      await t.keyboard.press('ArrowDown'); cues.push({ t: time, kind: 'cut', step: p.step });
      if (p.step === 1 || p.step === 25) cues.push({ t: time + 0.88, kind: 'ignite' });
      if (p.step === 5) cues.push({ t: time + 0.88 + 1.3, kind: 'ignite' });
    }
  }
  await t.evaluate((dt) => window.__tm.step(dt), DT);
  await t.screenshot({ path: `${out}/frames/${String(f).padStart(6, '0')}.jpg`, type: 'jpeg', quality: 90 });
  if (f % 150 === 0) console.log(`frame ${f}/${n} (${time.toFixed(1)} s), ${((Date.now() - started) / 1000).toFixed(0)} s elapsed`);
}
await writeFile(`${out}/cues.json`, JSON.stringify({ fps: FPS, frames: n, duration: n / FPS, cues }));
console.log(`DONE: ${n} frames, ${(n / FPS).toFixed(1)} s of film in ${((Date.now() - started) / 1000).toFixed(0)} s`);
await b.close();
