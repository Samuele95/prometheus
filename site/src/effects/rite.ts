// rite-procession: six stations on an arc of the rings; a brass marker travels it with scroll and lights each in turn.
// Station six carries the holo segment (holo place 3). Mobile: a vertical rule with the marker.
import { tokens } from '../tokens';

const NS = 'http://www.w3.org/2000/svg';
export function buildRite(host: HTMLElement, mobile: boolean) {
  const stations = Array.from(host.closest('.rite')!.querySelectorAll<HTMLElement>('.station'));
  host.closest('.rite')!.classList.add('is-live');
  if (mobile) {
    const rail = document.createElement('div');
    rail.className = 'rite__rail';
    rail.innerHTML = '<span class="rite__rail-fill"></span><span class="rite__marker"></span>';
    host.append(rail);
    const fill = rail.firstElementChild as HTMLElement, marker = rail.lastElementChild as HTMLElement;
    return (p: number) => {
      fill.style.transform = `scaleY(${p})`;
      marker.style.top = `${p * 100}%`;
      stations.forEach((s, i) => s.classList.toggle('is-lit', p >= i / 5 - 0.001));
    };
  }
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 1000 170');
  svg.setAttribute('class', 'rite__arc');
  const [h1, h2, h3] = tokens.color.holo.stops;
  svg.innerHTML = `<defs><linearGradient id="riteHolo" x1="0" x2="1"><stop offset="0" stop-color="${h1}"/><stop offset=".5" stop-color="${h2}"/><stop offset="1" stop-color="${h3}"/></linearGradient></defs>
    <path class="rite__base" d="M30 150 Q500 -40 970 150"/>
    <path class="rite__progress" d="M30 150 Q500 -40 970 150"/>
    <path class="rite__holo" d=""/>
    <g class="rite__stops"></g>
    <circle class="rite__marker-dot" r="6"/>`;
  host.append(svg);
  const base = svg.querySelector<SVGPathElement>('.rite__base')!;
  const prog = svg.querySelector<SVGPathElement>('.rite__progress')!;
  const marker = svg.querySelector<SVGCircleElement>('.rite__marker-dot')!;
  const len = base.getTotalLength();
  prog.style.strokeDasharray = `${len}`;
  const stops = svg.querySelector('.rite__stops')!;
  const dots = stations.map((_, i) => {
    const pt = base.getPointAtLength((i / 5) * len);
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', pt.x.toFixed(1)); c.setAttribute('cy', pt.y.toFixed(1)); c.setAttribute('r', '7');
    c.setAttribute('class', 'rite__stop');
    stops.append(c);
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', pt.x.toFixed(1)); t.setAttribute('y', (pt.y - 18).toFixed(1)); t.setAttribute('class', 'rite__stop-num');
    t.textContent = `0${i + 1}`;
    stops.append(t);
    return c;
  });
  // holo segment: station five to six
  let d = '';
  for (let k = 0; k <= 24; k++) { const p = base.getPointAtLength((0.8 + (0.2 * k) / 24) * len); d += `${k ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`; }
  svg.querySelector('.rite__holo')!.setAttribute('d', d);
  return (p: number) => {
    prog.style.strokeDashoffset = `${len * (1 - p)}`;
    const pt = base.getPointAtLength(p * len);
    marker.setAttribute('cx', pt.x.toFixed(1)); marker.setAttribute('cy', pt.y.toFixed(1));
    stations.forEach((s, i) => { const on = p >= i / 5 - 0.001; s.classList.toggle('is-lit', on); dots[i].classList.toggle('is-lit', on); });
    svg.classList.toggle('is-verified', p >= 0.999);
  };
}
