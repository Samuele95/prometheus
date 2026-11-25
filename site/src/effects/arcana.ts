// arcana-cards: pointer tilt, flip to reveal the meaning; keyboard parity (focus = hover, Enter flips, Escape restores).
import { tokens } from '../tokens';

export function mountArcana(deck: HTMLElement, mobile: boolean): void {
  deck.classList.add('is-live');
  const tilt = tokens.effects.arcana['tilt-deg'];
  deck.querySelectorAll<HTMLElement>('.card__inner').forEach((card) => {
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', 'false');
    const name = card.querySelector('.card__name')?.textContent ?? '';
    card.setAttribute('aria-label', `${name}: turn the card`);
    const flip = (on?: boolean) => {
      const next = on ?? !card.classList.contains('is-flipped');
      card.classList.toggle('is-flipped', next);
      card.setAttribute('aria-pressed', String(next));
    };
    card.addEventListener('click', () => flip());
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
      if (e.key === 'Escape') flip(false);
    });
    if (mobile) return;
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--rx', `${(-y * tilt).toFixed(2)}deg`);
      card.style.setProperty('--ry', `${(x * tilt).toFixed(2)}deg`);
      card.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
      card.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
    });
    card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
  });
}
