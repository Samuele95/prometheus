// Main page entry: the film when possible, the page otherwise. Reduced motion always gets the page, still.
import './styles/tokens.css';
import './styles/base.css';
import './styles/site.css';
import './styles/effects.css';
import './styles/film.css';
import { reduceMotion } from './effects/state';
import { mountFilm, filmPreferred, offerFilm } from './film';

document.querySelectorAll<HTMLElement>('[data-holo-word]').forEach((el) => {
  const word = el.dataset.holoWord!;
  const text = el.textContent ?? '';
  const i = text.indexOf(word);
  if (i < 0) return;
  const span = document.createElement('span');
  span.className = 'holo-word';
  span.textContent = word;
  el.replaceChildren(text.slice(0, i), span, text.slice(i + word.length));
});

document.querySelectorAll<HTMLButtonElement>('.terminal__copy').forEach((btn) => {
  const label = btn.textContent;
  btn.addEventListener('click', async () => {
    const el = btn.parentElement?.querySelector<HTMLElement>('code');
    const code = el?.dataset.command ?? el?.textContent ?? '';
    try { await navigator.clipboard.writeText(code); btn.textContent = btn.dataset.copied ?? label; }
    catch { /* clipboard blocked: the command stays selectable */ }
    setTimeout(() => (btn.textContent = label), 1600);
  });
});

// a feature check, not a context: creating a throwaway WebGL context costs a frame or more; a failed world falls back to the page anyway
const webgl = 'WebGLRenderingContext' in window;
// the scroll-page effects load only when the page is what the visitor sees
const page = () => { void import('./effects').then(({ mountEffects }) => mountEffects()); if (webgl && !reduceMotion()) offerFilm(); };

if (!reduceMotion() && webgl && filmPreferred()) void mountFilm(page);
else page();
