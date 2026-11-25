// intro-ignition: the animated logo as a short preloader. First visit only, skippable, never over 2.5 s.
import { tokens } from '../tokens';

const KEY = 'prometheus:intro';
export function mountIntro(host: HTMLElement, onDone: () => void): void {
  let seen = false;
  try { seen = sessionStorage.getItem(KEY) === 'seen'; sessionStorage.setItem(KEY, 'seen'); } catch { seen = true; }
  if (seen) { onDone(); return; }
  const img = new Image();
  img.src = './brand/intro.svg'; // relative to the page; the SVG animates itself
  img.alt = '';
  img.className = 'intro__art';
  host.prepend(img);
  host.classList.add('is-on');
  let done = false;
  const finish = () => {
    if (done) return; done = true;
    host.classList.add('is-leaving');
    window.removeEventListener('keydown', finish); host.removeEventListener('click', finish);
    setTimeout(() => { host.classList.remove('is-on', 'is-leaving'); img.remove(); }, tokens.motion.duration.medium);
    onDone();
  };
  window.addEventListener('keydown', finish);
  host.addEventListener('click', finish);
  setTimeout(finish, tokens.motion.duration.intro);
}
