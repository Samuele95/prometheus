// Film entry: gate, world, director, sound, cursor, and the exit to the page.
import { tokens } from '../tokens';
import { FilmAudio } from './audio';

const MODE_KEY = 'prometheus:mode';
export const filmPreferred = () => { try { return localStorage.getItem(MODE_KEY) !== 'page'; } catch { return true; } };
const setMode = (m: 'film' | 'page') => { try { localStorage.setItem(MODE_KEY, m); } catch { /* private mode */ } };

export async function mountFilm(onExit: () => void): Promise<void> {
  const root = document.querySelector<HTMLElement>('[data-film]')!;
  const stage = root.querySelector<HTMLElement>('[data-film-stage]')!;
  const gate = root.querySelector<HTMLElement>('[data-film-gate]')!;
  const mobile = window.matchMedia('(max-width: 899px)').matches;
  document.documentElement.classList.add('is-film');
  root.hidden = false;

  const audio = new FilmAudio();
  const sound = root.querySelector<HTMLButtonElement>('[data-sound]')!;
  const paintSound = () => { sound.textContent = audio.enabled ? sound.dataset.on! : sound.dataset.off!; sound.setAttribute('aria-pressed', String(audio.enabled)); };
  sound.addEventListener('click', () => { audio.setEnabled(!audio.enabled); paintSound(); });

  // the world loads while the gate's ignition plays
  // the world is built when the browser is idle (the gate's ignition plays meanwhile), or at once if the visitor enters first
  let build: (() => void) | null = null;
  const worldReady = new Promise<void>((r) => { build = r; }).then(() => Promise.all([import('./world'), import('./director')])).then(async ([w, d]) => {
    const world = await w.createWorld(stage, mobile);
    return { world, director: new d.Director(root, world, audio) };
  });
  const idle = (fn: () => void) => ('requestIdleCallback' in window ? window.requestIdleCallback(fn, { timeout: 2500 }) : setTimeout(fn, 1200));
  const kickBuild = () => { build?.(); build = null; };
  // built on intent: the first pointer move, touch or key at the gate starts the build; the gate's fade covers the rest
  for (const ev of ['pointermove', 'pointerdown', 'touchstart', 'keydown'] as const) window.addEventListener(ev, () => idle(kickBuild), { once: true, passive: true });

  let exit = () => {};
  root.querySelectorAll('[data-read-page]').forEach((b) => b.addEventListener('click', () => { setMode('page'); exit(); }));

  // cursor
  const cursor = root.querySelector<HTMLElement>('.film__cursor')!;
  if (window.matchMedia('(pointer: fine)').matches) {
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf = 0;
    const k = tokens.effects.film['cursor-lerp'];
    const loop = () => { cx += (x - cx) * k; cy += (y - cy) * k; cursor.style.transform = `translate(${cx}px, ${cy}px)`; raf = requestAnimationFrame(loop); };
    window.addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; cursor.classList.toggle('is-hot', !!(e.target as Element).closest('a, button')); });
    raf = requestAnimationFrame(loop);
    root.classList.add('has-cursor');
    const prevExit = exit; exit = () => { cancelAnimationFrame(raf); prevExit(); };
  }

  const enter = async (withSound: boolean) => {
    audio.setEnabled(withSound); paintSound();
    gate.classList.add('is-leaving');
    kickBuild();
    const { world, director } = await worldReady;
    world.play();
    root.classList.add('is-playing');
    director.start();
    setTimeout(() => { gate.hidden = true; }, 900);
    root.querySelector<HTMLElement>('[data-film-captions]')?.focus?.();
    const prevExit = exit;
    exit = () => { prevExit(); director.dispose(); world.dispose(); audio.dispose(); finish(); };
  };
  const finish = () => {
    try { sessionStorage.setItem('prometheus:intro', 'seen'); } catch { /* the film already opened with the ignition */ }
    document.documentElement.classList.remove('is-film');
    root.hidden = true;
    history.replaceState(null, '', location.pathname);
    onExit();
  };
  exit = finish;
  gate.querySelector('[data-door="sound"]')!.addEventListener('click', () => void enter(true));
  gate.querySelector('[data-door="silent"]')!.addEventListener('click', () => void enter(false));
  gate.querySelector<HTMLButtonElement>(FilmAudio.preferred() ? '[data-door="sound"]' : '[data-door="silent"]')?.focus({ preventScroll: true });
  worldReady.catch(() => { setMode('page'); finish(); }); // WebGL failed: the page is the film's fallback
}

export function offerFilm(): void {
  const btn = document.querySelector<HTMLButtonElement>('[data-watch-film]');
  if (!btn) return;
  btn.hidden = false;
  btn.addEventListener('click', () => { setMode('film'); location.reload(); });
}
