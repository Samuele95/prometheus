// Effect orchestrator. Every effect has a static end state in CSS; under reduced motion none of this runs
// except the static helpers, and the page stays complete.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { tokens } from '../tokens';
import { state, reduceMotion, isMobile } from './state';
import { mountIntro } from './intro';
import { buildRings } from './rings';
import { mountArcana } from './arcana';
import { buildRite } from './rite';

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string) => Array.from(document.querySelectorAll<T>(s));
const ease = { out: 'expo.out', inout: 'power3.inOut' };
const D = tokens.motion.duration;
const sec = (ms: number) => ms / 1000;

function webglAvailable(): boolean {
  return 'WebGLRenderingContext' in window;
}

function navState() {
  const nav = $('.nav')!, hero = $('#hero')!;
  new IntersectionObserver(([e]) => nav.classList.toggle('is-solid', !e.isIntersecting), { rootMargin: `-${nav.offsetHeight}px 0px 0px 0px` }).observe(hero);
}

export function mountEffects(): void {
  navState();
  const mobile = isMobile();
  const ringsHost = $('[data-fx="rings"]')!;
  const rings = buildRings(ringsHost, mobile);
  if (reduceMotion()) {
    document.documentElement.classList.add('is-static');
    return; // rings stand still at rest, every section is already complete in CSS
  }
  document.documentElement.classList.add('is-live');
  gsap.registerPlugin(ScrollTrigger);

  // ---------- hero: entrance, collapse choreography, point cloud ----------
  const hero = $('#hero')!;
  const cloudHost = $('[data-fx="point-cloud"]')!;
  const mark = $('.hero__mark')!;
  const hint = $<HTMLButtonElement>('[data-fx="measure-hint"]')!;
  const live = webglAvailable();
  const entrance = () => gsap.from('.hero__copy > *, .hero__copy .line', { y: 28, opacity: 0, duration: sec(D.long), ease: ease.out, stagger: 0.08 });
  gsap.set('.hero__copy > *', { opacity: 0 });
  mountIntro($('[data-fx="intro"]')!, () => { gsap.set('.hero__copy > *', { opacity: 1 }); entrance(); });

  const apply = () => {
    state.measure = Math.max(state.scroll, state.click);
    hint.style.opacity = String(Math.max(0, 1 - state.measure * 3));
  };
  if (live) {
    ScrollTrigger.create({
      trigger: hero, start: 'top top', end: `+=${tokens.motion.scroll['hero-pin-vh']}%`, pin: true, scrub: true,
      onUpdate: (self) => { state.scroll = self.progress; apply(); },
    });
    const collapse = () => gsap.to(state, { click: 1, duration: sec(D.collapse), ease: ease.inout, onUpdate: apply });
    hint.addEventListener('click', collapse);
    hero.addEventListener('click', (e) => { if (!(e.target as Element).closest('a, button')) collapse(); });
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      state.pointer = [((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1];
    });
    const load = () => import('./point-cloud').then(({ mountPointCloud }) => mountPointCloud(cloudHost, mark)).catch(() => { /* static mark stays */ });
    if ('requestIdleCallback' in window) (window as Window).requestIdleCallback(() => load(), { timeout: 600 }); else setTimeout(load, 200);
  } else {
    hint.hidden = true;
  }

  // ---------- rings: counter-rotation with scroll, visible from thesis to rite ----------
  const turn = tokens.motion.scroll['ring-turn-per-page'] * 360;
  const ringOpacity = mobile ? tokens.effects.rings.opacity * 0.6 : tokens.effects.rings.opacity;
  const speeds = [1, -1.35, 0.8, -1.7, 1.2];
  ScrollTrigger.create({
    trigger: '#thesis', endTrigger: '#rite', start: 'top 85%', end: 'bottom 15%', scrub: true,
    onUpdate: (self) => {
      const vhScrolled = (self.progress * (self.end - self.start)) / window.innerHeight;
      rings.forEach((g, i) => { g.style.transform = `rotate(${(vhScrolled * turn * speeds[i]).toFixed(2)}deg)`; });
      const p = self.progress, fade = Math.min(1, p / 0.08, (1 - p) / 0.08);
      ringsHost.style.opacity = String(Math.max(0, fade) * ringOpacity);
    },
  });
  ringsHost.style.opacity = '0';

  // ---------- section reveals ----------
  // Class-based and position-checked: anything whose top is above 85% of the viewport is revealed, however the
  // visitor got there (scroll, anchor jump, leaving the film), so content can never stay hidden behind a missed trigger.
  const groups: Element[][] = [];
  for (const s of $$('.section:not(.hero)')) groups.push(Array.from(s.querySelectorAll(':scope > .label, :scope > .display .line, :scope > .lead')));
  groups.push($$('.thesis__lines li'), [$('.thesis__coda')!], $$('.arcana__deck .card'), [$('.verify')!], $$('.mode'),
    [...$$('.ignite__steps li'), $('.runtimes')!, $('.ignite__ctas')!]);
  const pending = new Set<Element>();
  groups.forEach((g) => g.forEach((el, i) => { el.classList.add('rv'); (el as HTMLElement).style.setProperty('--rv-i', String(i)); pending.add(el); }));
  const sweep = () => {
    const line = window.innerHeight * 0.85;
    for (const el of pending) if (el.getBoundingClientRect().top < line) {
      el.classList.add('is-in'); pending.delete(el);
      el.querySelector('.holo-word')?.classList.add('is-lit');
    }
  };
  let queued = false;
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; sweep(); }); } }, { passive: true });
  window.addEventListener('resize', sweep);
  requestAnimationFrame(sweep);

  // ---------- arcana ----------
  mountArcana($('[data-fx="arcana-cards"]')!, mobile);

  // ---------- rite procession ----------
  const setRite = buildRite($('[data-fx="rite-procession"]')!, mobile);
  setRite(0);
  ScrollTrigger.create({ trigger: '.rite__stage', start: 'top 70%', end: 'bottom 45%', scrub: 0.4, onUpdate: (self) => setRite(self.progress) });

  // ---------- modes triptych (desktop: pinned, the centred mode widens) ----------
  if (!mobile) {
    const modes = $$('.mode');
    const tri = $('.modes__triptych')!;
    tri.classList.add('is-live');
    const setActive = (i: number) => modes.forEach((m, k) => m.classList.toggle('is-active', k === i));
    setActive(0);
    ScrollTrigger.create({ trigger: '#modes', start: 'top top', end: '+=120%', pin: true, scrub: true,
      onUpdate: (self) => setActive(Math.min(2, Math.floor(self.progress * 3))) });
  }

  // ---------- ignite: the command types itself once ----------
  const code = $('.terminal code')!;
  const full = code.textContent ?? '';
  code.dataset.command = full;
  const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = full;
  const typed = document.createElement('span'); typed.setAttribute('aria-hidden', 'true');
  const caret = document.createElement('span'); caret.className = 'caret'; caret.setAttribute('aria-hidden', 'true');
  code.replaceChildren(sr, typed, caret);
  ScrollTrigger.create({ trigger: '.terminal', start: 'top 80%', once: true, onEnter: () => {
    const counter = { n: 0 };
    gsap.to(counter, { n: full.length, duration: full.length / 70, ease: 'none', onUpdate: () => { typed.textContent = full.slice(0, Math.round(counter.n)); } });
  } });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
