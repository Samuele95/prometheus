// Card faces for the orbiting arcana, drawn on canvas from the page's own text and glyph SVGs.
import { CanvasTexture, SRGBColorSpace } from 'three';
import { tokens } from '../tokens';

const C = tokens.color;
const W = 640, H = 1040;
const SERIF = '"Bodoni Moda Variable", serif';
const MONO = '"Geist Mono Variable", monospace';

function frame(x: CanvasRenderingContext2D, ground: string) {
  x.fillStyle = ground; x.fillRect(0, 0, W, H);
  const g = x.createRadialGradient(W / 2, H * 0.35, 10, W / 2, H * 0.35, H * 0.7);
  g.addColorStop(0, C['ink-2']); g.addColorStop(1, ground);
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.strokeStyle = C.brass; x.lineWidth = 3; x.strokeRect(10, 10, W - 20, H - 20);
  x.strokeStyle = C['brass-dim']; x.lineWidth = 1.5; x.strokeRect(30, 30, W - 60, H - 60);
  for (const [cx, cy] of [[30, 30], [W - 30, 30], [30, H - 30], [W - 30, H - 30]]) { // corner stars
    x.fillStyle = C.brass; x.beginPath(); x.arc(cx, cy, 5, 0, Math.PI * 2); x.fill();
  }
}

function wrap(x: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(' '), lines: string[] = [];
  let line = '';
  for (const w of words) { const t = line ? `${line} ${w}` : w; if (x.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line);
  return lines;
}

function drawGlyph(x: CanvasRenderingContext2D, svg: SVGSVGElement, cx: number, cy: number, size: number) {
  const k = size / 64;
  x.save(); x.translate(cx - size / 2, cy - size / 2); x.scale(k, k);
  x.lineWidth = 1.6; x.lineCap = 'round'; x.lineJoin = 'round';
  svg.querySelectorAll('path, circle').forEach((el) => {
    const isDot = el.classList.contains('dot'), faint = el.classList.contains('faint');
    let path: Path2D;
    if (el.tagName === 'path') path = new Path2D(el.getAttribute('d')!);
    else { path = new Path2D(); const r = +el.getAttribute('r')!; path.arc(+el.getAttribute('cx')!, +el.getAttribute('cy')!, r, 0, Math.PI * 2); }
    if (isDot) { x.fillStyle = C.ember; x.fill(path); } else { x.strokeStyle = faint ? C['brass-dim'] : C.brass; x.stroke(path); }
  });
  x.restore();
}

export async function cardTextures(): Promise<Array<[CanvasTexture, CanvasTexture]>> {
  try { await Promise.all([document.fonts.load(`400 40px ${SERIF}`), document.fonts.load(`italic 400 40px ${SERIF}`), document.fonts.load(`500 20px ${MONO}`)]); } catch { /* fallback fonts */ }
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.arcana__deck .card'));
  const out: Array<[CanvasTexture, CanvasTexture]> = [];
  for (const card of cards) {
    await new Promise<void>((r) => setTimeout(r, 0));
    out.push((() => {
    const text = (sel: string) => card.querySelector(sel)?.textContent?.trim() ?? '';
    const make = () => { const c = document.createElement('canvas'); c.width = W * 2; c.height = H * 2; return c; }; // 2x for crisp type

    const fc = make(), f = fc.getContext('2d')!; f.scale(2, 2);
    frame(f, C.ink);
    f.textAlign = 'center'; f.textBaseline = 'alphabetic';
    f.fillStyle = C.brass; f.font = `400 92px ${SERIF}`; f.fillText(text('.card__numeral'), W / 2, 170);
    drawGlyph(f, card.querySelector<SVGSVGElement>('.card__glyph')!, W / 2, 440, 300);
    f.fillStyle = C.bone; f.font = `400 76px ${SERIF}`;
    wrap(f, text('.card__name'), W - 140).forEach((l, i, a) => f.fillText(l, W / 2, 790 - (a.length - 1 - i) * 82));
    f.fillStyle = C.muted; f.font = `500 22px ${MONO}`;
    f.fillText(text('.card__shape').toUpperCase().split('').join(String.fromCharCode(8202)), W / 2, 870);

    const bc = make(), b = bc.getContext('2d')!; b.scale(2, 2);
    frame(b, C['ink-2']);
    b.textAlign = 'center';
    b.fillStyle = C.ember; b.fillRect(W / 2 - 40, 300, 80, 3);
    b.fillStyle = C.brass; b.font = `400 54px ${SERIF}`; b.fillText(text('.card__numeral'), W / 2, 250);
    b.fillStyle = C.bone; b.font = `italic 400 50px ${SERIF}`;
    const lines = wrap(b, text('.card__back p'), W - 150);
    lines.forEach((l, i) => b.fillText(l, W / 2, 420 + i * 66));
    b.fillStyle = C.muted; b.font = `500 22px ${MONO}`; b.fillText(text('.card__name').toUpperCase(), W / 2, H - 120);

    return [fc, bc].map((c) => { const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 16; return t; }) as [CanvasTexture, CanvasTexture];
    })());
  }
  return out;
}
