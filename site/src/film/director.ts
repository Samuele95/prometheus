// film-director: the step list, the camera rail, captions, input and HUD.
// Captions are cloned from the page's own markup, so the film and the page say exactly the same words.
import { gsap } from 'gsap';
import { CatmullRomCurve3, Vector3 } from 'three';
import { tokens } from '../tokens';
import { params, type World } from './world';
import type { FilmAudio } from './audio';

type Cam = { x: number; y: number; z: number; tx: number; ty: number; tz: number; fov?: number };
type Scene = Partial<Omit<typeof params, 'cam' | 'pointer'>>;
// sr: kept for screen readers but not shown; the picture or the chapter card already says it
type Item = string | { h: 'h1' | 'h2' | 'h3'; lines: string[] } | { sr: string };
interface Step {
  chapter: number; id: string; cam: Cam; scene?: Scene; items: Item[];
  layout?: 'left' | 'center' | 'card' | 'station' | 'final' | 'low';
  arrive?: (ctx: { world: World; audio: FilmAudio }) => void;
}

const FILM = tokens.effects.film;
const R = FILM['orbit-radius'];

const card = (k: number): Step => ({
  chapter: 2, id: `card-${k + 1}`, layout: 'card',
  cam: { x: 1.5, y: 0.35, z: R + 4.6, tx: 0, ty: 0.1, tz: R },
  scene: { cardFocus: k, cards: 1 },
  items: [`.arcana__deck .card:nth-child(${k + 1}) .card__numeral`, { h: 'h3', lines: [`.arcana__deck .card:nth-child(${k + 1}) .card__name`] },
    `.arcana__deck .card:nth-child(${k + 1}) .card__shape`, { sr: `.arcana__deck .card:nth-child(${k + 1}) .card__back p` }],
  arrive: ({ world }) => { world.flipCard(-1, false); gsap.delayedCall(0.9, () => world.flipCard(k, true)); },
});
const rite = (k: number, at: { x: number; y: number; z: number }, scene: Scene, arrive?: Step['arrive'], extra: Item[] = []): Step => ({
  chapter: 3, id: `station-${k + 1}`, layout: 'station',
  cam: { ...at, tx: 0.3, ty: 5.9, tz: -0.9, fov: 46 },
  scene,
  items: [`.station:nth-child(${k + 1}) .station__num`, { h: 'h3', lines: [`.station:nth-child(${k + 1}) .station__name`] }, `.station:nth-child(${k + 1}) p`, ...extra],
  arrive,
});

export const STEPS: Step[] = [
  { chapter: 0, id: 'hero', layout: 'center', cam: { x: 0, y: 0.2, z: 7.2, tx: 0, ty: 0.5, tz: 0, fov: 58 },
    scene: { measure: 0, armillary: 0, dial: 0, cards: 0, stations: 0, bloom: 1.2, dive: 0, glow: 1, space: 0, readings: 0, arrow: 0, warpOp: 0, comm: 0, interf: 0, collapse: 0, stream: 0, plates: 0 },
    items: ['#hero .label', { h: 'h1', lines: ['#hero h1 .line:nth-child(1)'] }, '[data-film-advance]'] },
  { chapter: 0, id: 'measured', layout: 'left', cam: { x: 0, y: 0.4, z: 10.5, tx: 0, ty: 0.8, tz: 0, fov: 40 },
    scene: { measure: 1, bloom: 1 },
    items: [{ h: 'h2', lines: ['#hero h1 .line:nth-child(2)'] }, '#hero .hero__body'],
    arrive: ({ audio }) => audio.ignite() },
  // The principle, in prompt space: the framework's formalism (references/quantum-principles.md, P1-P5) enacted in 3D.
  { chapter: 1, id: 'thesis', layout: 'low', cam: { x: 7.5, y: 3.4, z: 13, tx: 0, ty: 0.6, tz: 0, fov: 48 },
    scene: { space: 1, readings: 0.35, arrow: 0, warpOp: 0, comm: 0, interf: 0, collapse: 0, stream: 0, plates: 0, plateFocus: -1, plateSwap: 0, alt: 0, ghost: 0, armillary: 0.12, dial: 0, glow: 0.55, flame: 0.75 },
    items: [{ sr: '#thesis .label' }, { h: 'h2', lines: ['#thesis h2 .line:nth-child(1)', '#thesis h2 .line:nth-child(2)'] }, '.film__lexicon [data-k="request-label"]', '.film__lexicon [data-k="request"]'] },
  { chapter: 1, id: 'superposition', layout: 'low', cam: { x: 3.8, y: 2.3, z: 8, tx: 0, ty: 0.7, tz: 0, fov: 52 },
    scene: { readings: 1, arrow: 1, flame: 0.5 }, items: ['.film__lexicon [data-k="f-1"]', '.film__lexicon [data-k="alg-1"]'] },
  { chapter: 1, id: 'operator', layout: 'low', cam: { x: -4.9, y: 1.7, z: 3.9, tx: -9.9, ty: 0.75, tz: -0.4, fov: 48 },
    scene: { space: 0.25, readings: 0.3, arrow: 0, stream: 1, plates: 1, plateFocus: 3, flame: 1 }, items: ['.film__lexicon [data-k="f-2"]', '.thesis__lines li:nth-child(1)'] },
  { chapter: 1, id: 'matrix', layout: 'low', cam: { x: -3.6, y: 4.2, z: 10.5, tx: 0, ty: 0.5, tz: 0, fov: 48 },
    scene: { space: 1, readings: 1, arrow: 1, stream: 0.2, plates: 0.2, plateFocus: -1, warpOp: 1, flame: 0.45 }, items: ['.film__lexicon [data-k="f-3"]', '.film__lexicon [data-k="alg-2"]'],
    arrive: () => { gsap.fromTo(params, { warpOp: 0 }, { warpOp: 1, duration: 2.8, ease: 'power2.inOut', delay: 0.3 }); } },
  { chapter: 1, id: 'commute', layout: 'low', cam: { x: -6.5, y: 3.4, z: 13.5, tx: -6.5, ty: 1.1, tz: 0, fov: 46 },
    scene: { warpOp: 0, space: 0.2, readings: 0.25, arrow: 0, stream: 1, plates: 1, plateSwap: 1, alt: 1, flame: 1 }, items: ['.film__lexicon [data-k="f-4"]', '.thesis__lines li:nth-child(2)'],
    arrive: ({ audio }) => { gsap.delayedCall(0.4, () => audio.swell()); } },
  { chapter: 1, id: 'commutator', layout: 'low', cam: { x: 7.5, y: 5.5, z: 11.5, tx: 1.2, ty: 2.2, tz: 0.6, fov: 46 },
    scene: { plateSwap: 0, alt: 0, stream: 0, plates: 0, space: 1, readings: 0.4, arrow: 0, comm: 0, flame: 0.4 }, items: ['.film__lexicon [data-k="f-5"]', '.film__lexicon [data-k="alg-3"]'],
    arrive: () => { gsap.fromTo(params, { comm: 0 }, { comm: 1, duration: 3.6, ease: 'power1.inOut', delay: 0.2 }); } },
  { chapter: 1, id: 'interference', layout: 'low', cam: { x: 0.4, y: 5.2, z: 11.5, tx: 0, ty: -3, tz: -1.5, fov: 54 },
    scene: { comm: 0, space: 0.2, readings: 0.15, interf: 1, flame: 0.5 }, items: ['.film__lexicon [data-k="f-6"]', '.film__lexicon [data-k="alg-4"]'] },
  { chapter: 1, id: 'measure', layout: 'low', cam: { x: 0.5, y: 1.8, z: 16, tx: 0, ty: 1.1, tz: 0, fov: 46 },
    scene: { interf: 0, space: 1, readings: 1, arrow: 1, collapse: 0, glow: 1, flame: 0.55 }, items: ['.film__lexicon [data-k="f-7"]', '.thesis__lines li:nth-child(3)', { sr: '.thesis__coda' }],
    arrive: ({ audio }) => {
      // the readings project onto one (P5), then the flame's ghosts collapse with the shockwave
      gsap.timeline()
        .to(params, { collapse: 1, duration: 1.6, ease: 'power3.inOut' })
        .to(params, { ghost: 1, duration: 0.9, ease: 'power2.out' }, '-=0.4')
        .to(params, { shockwave: 1, duration: 1.3, ease: 'power2.out', onStart: () => audio.ignite() }, '+=0.9')
        .to(params, { ghost: 0, duration: 0.45, ease: 'power3.in' }, '<')
        .to(params, { space: 0.3, readings: 0.4, flame: 1, duration: 1.2 }, '<')
        .fromTo(params, { bloom: 2 }, { bloom: 1, duration: 1.2, ease: 'power2.out' }, '<')
        .set(params, { shockwave: 0 });
    } },
  { chapter: 2, id: 'arcana', layout: 'left', cam: { x: 0, y: 8, z: 20, tx: 0, ty: -0.5, tz: 0 },
    scene: { cards: 1, cardFocus: 0, armillary: 0.45, dial: 0.5, stream: 0, plates: 0, ghost: 0, shockwave: 0, glow: 1, flame: 1, space: 0, readings: 0, arrow: 0, collapse: 0, interf: 0, comm: 0, warpOp: 0 },
    items: [{ sr: '#arcana .label' }, { h: 'h2', lines: ['#arcana h2 .line:nth-child(1)', '#arcana h2 .line:nth-child(2)'] }, '#arcana .arcana__intro'],
    arrive: ({ world }) => world.flipCard(-1, false) },
  ...Array.from({ length: 7 }, (_, k) => card(k)),
  // The rite: the forge. Each phase visibly builds the artifact above the fire.
  { chapter: 3, id: 'rite', layout: 'left', cam: { x: 3, y: 14, z: 13, tx: 0, ty: 2, tz: 0 },
    scene: { cards: 0, stations: 1, stationLit: 0, holoArc: 0, armillary: 0.25, dial: 0.7, glyphs: 0, pick: 0, pulses: 0, stack: 0, plates: 0, scan: 0, fault: 0, gauges: 0, deliver: 0, verifyRings: 0 },
    items: [{ sr: '#rite .label' }, { h: 'h2', lines: ['#rite h2 .line:nth-child(1)', '#rite h2 .line:nth-child(2)'] }],
    arrive: ({ world }) => world.flipCard(-1, false) },
  rite(0, { x: 6.5, y: 7.2, z: 10.5 }, { stationLit: 1, glyphs: 1, pick: 0 },
    () => { gsap.fromTo(params, { pick: 0 }, { pick: 1, duration: 1.4, ease: 'power3.inOut', delay: 1.8 }); }),
  rite(1, { x: 7.5, y: 5.4, z: 9 }, { stationLit: 2, pulses: 1, pick: 1 }),
  rite(2, { x: 4.2, y: 6.8, z: 9.6 }, { stationLit: 3, pulses: 0, plates: 1, stack: 1 }),
  rite(3, { x: 2.6, y: 6.2, z: 9.2 }, { stationLit: 4 },
    () => { gsap.timeline().fromTo(params, { scan: 0 }, { scan: 1, duration: 2.4, ease: 'none' }).to(params, { fault: 1, duration: 0.15 }, 0.8).to(params, { fault: 0, duration: 0.5 }, 1.9); }),
  rite(4, { x: 3.4, y: 7.0, z: 10.8 }, { stationLit: 5, gauges: 1 }),
  rite(5, { x: 4.0, y: 6.6, z: 11.5 }, { stationLit: 6, holoArc: 1, deliver: 1, verifyRings: 1 },
    ({ audio }) => { audio.ignite(); gsap.fromTo(params, { bloom: 1.8 }, { bloom: 1, duration: 1.6, ease: 'power2.out' }); },
    [{ sr: '.verify .label' }, { sr: '.verify__layers' }]),
  { chapter: 4, id: 'modes', layout: 'left', cam: { x: 0, y: 1.2, z: 17, tx: 0, ty: 0.4, tz: 0 },
    scene: { stations: 0, holoArc: 0, stationLit: 0, armillary: 1, dial: 0.6, ringTilt: 0, ringSpin: 0.35, scatter: 0, glyphs: 0, pick: 0, pulses: 0, plates: 0, stack: 0, gauges: 0, deliver: 0, verifyRings: 0 },
    items: [{ sr: '#modes .label' }, { h: 'h2', lines: ['#modes h2 .line:nth-child(1)', '#modes h2 .line:nth-child(2)'] }] },
  { chapter: 4, id: 'from-scratch', layout: 'left', cam: { x: -3, y: 1.6, z: 14, tx: 0, ty: 0.5, tz: 0 },
    items: ['.mode:nth-child(1) .mode__numeral', { h: 'h3', lines: ['.mode:nth-child(1) .mode__name'] }, '.mode:nth-child(1) p:last-child'],
    arrive: () => { gsap.fromTo(params, { scatter: 1 }, { scatter: 0, duration: 2.6, ease: 'expo.out' }); } },
  { chapter: 4, id: 'refactor', layout: 'left', cam: { x: 0, y: 0.5, z: 13, tx: 0, ty: 0.5, tz: 0 },
    scene: { ringTilt: 1, ringSpin: 0 },
    items: ['.mode:nth-child(2) .mode__numeral', { h: 'h3', lines: ['.mode:nth-child(2) .mode__name'] }, '.mode:nth-child(2) p:last-child'] },
  { chapter: 4, id: 'manage', layout: 'left', cam: { x: 3.2, y: 2.2, z: 14, tx: 0, ty: 0.5, tz: 0 },
    scene: { ringTilt: 0.3, ringSpin: 2.4 },
    items: ['.mode:nth-child(3) .mode__numeral', { h: 'h3', lines: ['.mode:nth-child(3) .mode__name'] }, '.mode:nth-child(3) p:last-child'] },
  { chapter: 5, id: 'ignite', layout: 'center', cam: { x: 0, y: 0.8, z: 2.4, tx: 0, ty: 0.8, tz: 0, fov: 72 },
    scene: { dive: 1, bloom: 1.6, armillary: 0.15, dial: 0, ringSpin: 0.6 },
    items: [{ sr: '#ignite .label' }, { h: 'h2', lines: ['#ignite h2 .line:nth-child(1)', '#ignite h2 .line:nth-child(2)'] }, { sr: '.ignite__steps' }],
    arrive: ({ audio }) => audio.ignite() },
  { chapter: 5, id: 'install', layout: 'final', cam: { x: 0, y: 0.4, z: 12, tx: 0, ty: 0.6, tz: 0, fov: 40 },
    scene: { dive: 0, bloom: 0.9, ringTilt: 1, ringSpin: 0.15, armillary: 0.85, dial: 0.35 },
    items: ['.terminal', '.runtimes', '.ignite__ctas', { sr: '.colophon__line' }] },
];

// every step's full state: the cumulative merge of everything before it, so any jump lands consistently
const STATES = STEPS.reduce<Array<Scene>>((acc, s, i) => { acc.push({ ...(i ? acc[i - 1] : {}), ...(s.scene ?? {}) }); return acc; }, []);
const CHAPTER_START = [0, 1, 2, 3, 4, 5].map((c) => STEPS.findIndex((s) => s.chapter === c));
const CHAPTER_IDS = ['hero', 'thesis', 'arcana', 'rite', 'modes', 'ignite'];

export class Director {
  index = -1;
  private lockUntil = 0;
  private lastWheel = 0;
  private wheelSum = 0;
  private touchY: number | null = null;
  private captions: HTMLElement;
  private mobile: boolean;
  private off: Array<() => void> = [];

  constructor(private root: HTMLElement, private world: World, private audio: FilmAudio) {
    this.captions = root.querySelector('[data-film-captions]')!;
    this.mobile = window.matchMedia('(max-width: 899px)').matches;
    if (new URLSearchParams(location.search).has('debug')) (window as unknown as Record<string, unknown>).__dir = { self: this, gsap, params };
  }

  start(): void {
    const hash = location.hash.slice(1);
    const chapter = CHAPTER_IDS.indexOf(hash);
    this.go(chapter > 0 ? CHAPTER_START[chapter] : 0, true);
    this.bindInput();
  }

  next(): void { if (this.index < STEPS.length - 1) this.go(this.index + 1); }
  prev(): void { if (this.index > 0) this.go(this.index - 1); }

  go(i: number, instant = false): void {
    if (i === this.index) return;
    const step = STEPS[i], state = STATES[i];
    const prevChapter = this.index >= 0 ? STEPS[this.index].chapter : -1;
    const journey = !instant && step.chapter !== prevChapter;            // a chapter change is a journey, not a cut
    const dur = instant ? 0 : (journey ? FILM['chapter-ms'] : FILM['transition-ms']) / 1000;
    this.index = i;
    this.lockUntil = performance.now() + (instant ? 300 : journey ? FILM['chapter-ms'] + 200 : FILM['step-lock-ms']);
    gsap.killTweensOf(params); gsap.killTweensOf(params.cam); this.flight?.kill();
    this.fly(this.framed(step), dur, journey);
    gsap.to(params, { ...state, duration: dur, ease: 'power3.inOut' });
    if (!instant) {
      gsap.fromTo(params, { shock: journey ? 1.6 : 1 }, { shock: 0, duration: journey ? 1.6 : 0.9, ease: 'power2.out' });
      this.audio.swell();
    }
    if (!journey) gsap.to(params, { warp: 0, drift: 1, duration: 0.8, ease: 'power2.out' }); // a cut always clears a journey it interrupts
    if (journey) {
      gsap.timeline().to(params, { warp: 1, drift: 0, duration: dur * 0.45, ease: 'power2.in' }).to(params, { warp: 0, drift: 1, duration: dur * 0.55, ease: 'power2.out' });
      this.chapterCard(step.chapter, dur);
    }
    gsap.delayedCall(instant ? 0 : dur * 0.55, () => step.arrive?.({ world: this.world, audio: this.audio }));
    this.caption(step, instant, journey ? dur * 0.62 : 0);
    this.hud(step);
    history.replaceState(null, '', `#${CHAPTER_IDS[step.chapter]}`);
  }

  private flight: gsap.core.Tween | null = null;

  /** Camera flights follow curves: an arc within a chapter; a pull-back through the warp between chapters. */
  private fly(to: Cam & { fov: number }, dur: number, journey: boolean): void {
    const c = params.cam;
    if (dur === 0) { Object.assign(c, to); return; }
    const p0 = new Vector3(c.x, c.y, c.z), p2 = new Vector3(to.x, to.y, to.z);
    const t0 = new Vector3(c.tx, c.ty, c.tz), t2 = new Vector3(to.tx, to.ty, to.tz);
    const span = p0.distanceTo(p2);
    const mid = p0.clone().lerp(p2, 0.5);
    if (journey) {
      // back and up, away from both subjects, so the world sweeps past before the new scene opens
      const away = mid.clone().sub(t0.clone().lerp(t2, 0.5)).normalize();
      mid.addScaledVector(away, 9 + span * 0.35).add(new Vector3(0, 4.5, 0));
    } else {
      mid.add(new Vector3(0, Math.min(3, span * 0.22), 0));
    }
    const path = new CatmullRomCurve3([p0, mid, p2]);
    const look = new CatmullRomCurve3([t0, t0.clone().lerp(t2, 0.5).add(new Vector3(0, journey ? 1.5 : 0, 0)), t2]);
    const f0 = c.fov, f1 = to.fov, kick = journey ? 14 : 4;
    const prog = { u: 0 }, p = new Vector3(), t = new Vector3();
    this.flight = gsap.to(prog, { u: 1, duration: dur, ease: 'power3.inOut', onUpdate: () => {
      path.getPoint(prog.u, p); look.getPoint(prog.u, t);
      c.x = p.x; c.y = p.y; c.z = p.z; c.tx = t.x; c.ty = t.y; c.tz = t.z;
      c.fov = f0 + (f1 - f0) * prog.u + Math.sin(prog.u * Math.PI) * kick;
    } });
  }

  private chapterCard(chapter: number, dur: number): void {
    const card = this.root.querySelector<HTMLElement>('[data-film-card]')!;
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'][chapter];
    const kicker = document.querySelector('.film__lexicon [data-k="chapter-card"]')?.textContent ?? '';
    card.querySelector('.film__card-kicker')!.textContent = `${kicker} ${roman}`;
    card.querySelector('.film__card-num')!.textContent = roman;
    card.querySelector('.film__card-name')!.textContent = this.root.querySelector(`[data-chapter="${chapter}"] span`)?.textContent ?? '';
    card.classList.remove('is-on'); void card.offsetWidth; card.classList.add('is-on');
    this.root.classList.add('is-journey');
    gsap.delayedCall(dur * 0.78, () => { card.classList.remove('is-on'); this.root.classList.remove('is-journey'); });
  }

  /** Pan the shot so the flame sits beside the caption (desktop) or above it (mobile). */
  private framed(step: Step): Cam & { fov: number } {
    const c = { ...step.cam, fov: step.cam.fov ?? (tokens.effects.film['fov-deg'] as number) };
    const dx = c.x - c.tx, dy = c.y - c.ty, dz = c.z - c.tz, dist = Math.hypot(dx, dy, dz);
    const aspect = window.innerWidth / window.innerHeight;
    if (aspect < 1) {
      // portrait: the horizontal field is narrow, so dolly back until the shot fits the width, then lift the subject above the caption
      const back = Math.min(2.2, 0.82 / aspect);
      const bx = c.tx + dx * back, by = c.ty + dy * back, bz = c.tz + dz * back;
      const s = 0.24 * dist * back * Math.tan(((c.fov ?? 40) * Math.PI) / 360);
      return { ...c, x: bx, y: by - s, z: bz, ty: c.ty - s };
    }
    if (step.layout === 'center' || step.layout === 'low') return c;
    const side = 0.36 * dist * Math.tan(((c.fov ?? 40) * Math.PI) / 360) * (window.innerWidth / window.innerHeight);
    // pan along the camera's right vector (horizontal component only)
    const rx = dz / Math.hypot(dx, dz), rz = -dx / Math.hypot(dx, dz);
    return { ...c, x: c.x - rx * side, z: c.z - rz * side, tx: c.tx - rx * side, tz: c.tz - rz * side };
  }

  private caption(step: Step, instant: boolean, delay = 0): void {
    const old = Array.from(this.captions.children) as HTMLElement[];
    old.forEach((el) => { el.classList.add('is-leaving'); setTimeout(() => el.remove(), 500); });
    const cap = document.createElement('section');
    cap.className = `cap cap--${step.layout ?? 'left'}`;
    let n = 0;
    for (const item of step.items) {
      if (typeof item === 'string') {
        const src = document.querySelector<HTMLElement>(item);
        if (!src) continue;
        const el = src.cloneNode(true) as HTMLElement;
        el.removeAttribute('id'); el.querySelectorAll('[id]').forEach((x) => x.removeAttribute('id'));
        el.removeAttribute('hidden'); el.classList.add('cap__part');
        // formulas carry subscripts as _x in the copy deck; typeset them as real subscripts
        if (el.dataset.k?.startsWith('f-')) el.innerHTML = (el.textContent ?? '').replace(/[&<>]/g, (ch) => `&#${ch.charCodeAt(0)};`).replace(/_(\w)/g, '<sub>$1</sub>');
        el.style.setProperty('--i', String(n++));
        cap.append(el);
      } else if ('sr' in item) {
        const src = document.querySelector<HTMLElement>(item.sr);
        if (!src) continue;
        const el = src.cloneNode(true) as HTMLElement;
        el.removeAttribute('id'); el.querySelectorAll('[id]').forEach((x) => x.removeAttribute('id'));
        el.removeAttribute('hidden'); el.classList.add('sr-only');
        el.querySelectorAll('a, button').forEach((x) => x.setAttribute('tabindex', '-1'));
        cap.append(el);
      } else {
        const h = document.createElement(item.h);
        h.className = `cap__title cap__part cap__title--${item.h}`;
        h.style.setProperty('--i', String(n++));
        for (const sel of item.lines) {
          const src = document.querySelector(sel);
          if (src) { const l = src.cloneNode(true) as HTMLElement; l.removeAttribute('id'); h.append(l); }
        }
        cap.append(h);
      }
    }
    cap.querySelectorAll('.terminal__copy').forEach((b) => b.addEventListener('click', async () => {
      const code = cap.querySelector('code')?.textContent ?? '';
      try { await navigator.clipboard.writeText(code); b.textContent = (b as HTMLElement).dataset.copied ?? b.textContent; } catch { /* selectable */ }
    }));
    if (instant) cap.classList.add('is-instant');
    setTimeout(() => this.captions.append(cap), instant ? 0 : 380 + delay * 1000);
  }

  private hud(step: Step): void {
    const r = this.root;
    const total = 6, ch = step.chapter;
    r.querySelector('[data-film-counter]')!.textContent = `${String(ch + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    const name = r.querySelector(`[data-chapter="${ch}"] span`)?.textContent ?? '';
    r.querySelector('[data-film-chapter]')!.textContent = name;
    const start = CHAPTER_START[ch], end = ch < 5 ? CHAPTER_START[ch + 1] : STEPS.length;
    r.querySelectorAll<HTMLButtonElement>('[data-chapter]').forEach((b) => {
      const c = +b.dataset.chapter!;
      b.toggleAttribute('aria-current', c === ch);
      b.style.setProperty('--fill', c < ch ? '1' : c > ch ? '0' : String((this.index - start + 1) / (end - start)));
    });
    r.classList.toggle('is-first', this.index === 0);
    r.classList.toggle('is-last', this.index === STEPS.length - 1);
  }

  private bindInput(): void {
    const on = <K extends keyof WindowEventMap>(t: K, fn: (e: WindowEventMap[K]) => void, opts?: AddEventListenerOptions) => {
      window.addEventListener(t, fn as EventListener, opts); this.off.push(() => window.removeEventListener(t, fn as EventListener));
    };
    let used = false;
    on('wheel', (e) => {
      if ((e.target as Element).closest('.cap pre')) return;
      e.preventDefault();
      // one gesture, one step: a pause of 160 ms ends a gesture, so trackpad inertia never skips a scene
      const now = performance.now(), gap = now - this.lastWheel;
      this.lastWheel = now;
      if (gap > 160) { this.wheelSum = 0; used = false; }
      if (used || now < this.lockUntil) return;
      this.wheelSum += e.deltaY;
      if (Math.abs(this.wheelSum) > 40) { this.wheelSum > 0 ? this.next() : this.prev(); used = true; }
    }, { passive: false });
    on('touchstart', (e) => { this.touchY = e.touches[0].clientY; }, { passive: true });
    on('touchend', (e) => {
      if (this.touchY === null) return;
      const dy = this.touchY - e.changedTouches[0].clientY; this.touchY = null;
      if (Math.abs(dy) > 45 && performance.now() > this.lockUntil) dy > 0 ? this.next() : this.prev();
    }, { passive: true });
    on('keydown', (e) => {
      const t = e.target as HTMLElement;
      const typing = t.closest('button, a, input, pre');
      if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key) || (e.key === ' ' && !typing)) { e.preventDefault(); if (performance.now() > this.lockUntil) this.next(); }
      if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); if (performance.now() > this.lockUntil) this.prev(); }
      if (e.key === 'Home') this.go(0);
      if (e.key === 'End') this.go(STEPS.length - 1);
    });
    on('pointermove', (e) => { params.pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1); });
    this.root.querySelectorAll<HTMLButtonElement>('[data-chapter]').forEach((b) => b.addEventListener('click', () => this.go(CHAPTER_START[+b.dataset.chapter!])));
    this.root.querySelector('[data-film-home]')?.addEventListener('click', (e) => { e.preventDefault(); this.go(0); });
    // the stage itself: a click measures (step 0) or advances
    this.root.querySelector('[data-film-stage]')?.addEventListener('click', () => { if (performance.now() > this.lockUntil) this.next(); });
  }

  dispose(): void { this.off.forEach((f) => f()); gsap.killTweensOf(params); gsap.killTweensOf(params.cam); }
}
