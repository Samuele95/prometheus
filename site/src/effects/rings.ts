// thesis-rings: engraved concentric rings in a fixed layer, counter-rotating with scroll behind thesis..rite.
// Radii follow the logo's ring ratio (19.5/24) so the page's rings and the mark's are one family.
import { tokens } from '../tokens';

const NS = 'http://www.w3.org/2000/svg';
const RATIO = 19.5 / 24;
const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
}

export function buildRings(host: HTMLElement, mobile: boolean): SVGGElement[] {
  const count = mobile ? tokens.effects.rings['count-mobile'] : tokens.effects.rings['count-desktop'];
  const svg = el('svg', { viewBox: '-100 -100 200 200', class: 'rings' });
  const groups: SVGGElement[] = [];
  let r = 96;
  const tickCounts = [120, 96, 72, 60, 48];
  for (let k = 0; k < count; k++) {
    const g = el('g', { class: `ring ring--${k}` });
    g.append(el('circle', { cx: 0, cy: 0, r, class: k === 0 ? 'ring__line ring__line--major' : 'ring__line' }));
    const n = tickCounts[k];
    let d = '';
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const len = i % 5 === 0 ? 4.2 : 1.8;
      const c = Math.cos(a), s = Math.sin(a);
      d += `M${(c * r).toFixed(2)} ${(s * r).toFixed(2)}L${(c * (r - len)).toFixed(2)} ${(s * (r - len)).toFixed(2)}`;
    }
    g.append(el('path', { d, class: i_major(k) }));
    if (!mobile && (k === 1 || k === 3)) {
      NUMERALS.forEach((num, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const t = el('text', { x: (Math.cos(a) * (r - 9)).toFixed(2), y: (Math.sin(a) * (r - 9)).toFixed(2), class: 'ring__num',
          transform: `rotate(${(i / 12) * 360} ${(Math.cos(a) * (r - 9)).toFixed(2)} ${(Math.sin(a) * (r - 9)).toFixed(2)})` });
        t.textContent = num;
        g.append(t);
      });
    }
    if (!mobile && k === 2) { // seven small bodies: the seven shapes, in orbit
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2 + 0.3;
        g.append(el('circle', { cx: (Math.cos(a) * r).toFixed(2), cy: (Math.sin(a) * r).toFixed(2), r: i === 0 ? 1.6 : 1.1, class: i === 0 ? 'ring__body ring__body--ember' : 'ring__body' }));
      }
    }
    svg.append(g);
    groups.push(g);
    r *= RATIO;
  }
  host.append(svg);
  return groups;
}
const i_major = (k: number) => (k === 0 ? 'ring__ticks ring__ticks--major' : 'ring__ticks');
