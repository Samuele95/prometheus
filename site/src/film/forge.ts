// The bench and the forge: the scenes where the film enacts its ideas instead of captioning them.
// Chapter "The principle": a river of particles (intent) flows through five operator plates into the flame.
// Chapter "The rite": the same plates are chosen, questioned, stacked, audited, scored and delivered.
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, Color, Group, Mesh, MeshBasicMaterial, PlaneGeometry,
  Points, Scene, ShaderMaterial, Sprite, SpriteMaterial, SRGBColorSpace, TorusGeometry, Vector3, DoubleSide,
} from 'three';
import geometry from '../flame-geometry.json';
import { tokens } from '../tokens';
import type { params as Params } from './world';

const C = tokens.color;
type P = typeof Params;
export const PLATE_X = [-17, -14.5, -12, -9.5, -7];
const STREAM_START = -25, STREAM_END = -4.6;
const TOWER_Y = 5.0;
const rng = (seed: number) => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const rgba = (hex: string, a: number) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

const holoUniforms = () => ({ uH1: { value: new Color(C.holo.stops[0]) }, uH2: { value: new Color(C.holo.stops[1]) }, uH3: { value: new Color(C.holo.stops[2]) } });
const HOLO_GLSL = `vec3 holo(float g) { g = fract(g) * 2.; return g < 1. ? mix(uH1, uH2, g) : mix(uH2, uH3, g - 1.); }`;

// ---------------------------------------------------------------- the river of intent
const streamVertex = /* glsl */ `
  attribute vec4 aSeed; attribute vec3 aTarget;
  uniform float uTime, uStream, uDpr, uFocus, uAlt, uSize;
  uniform float uPX[5];
  uniform vec3 uMuted, uBrass, uEmber, uBone;
  varying vec3 vColor; varying float vAlpha;
  float hash(float n) { return fract(sin(n) * 43758.5453); }
  void main() {
    float s = fract(uTime * .055 + aSeed.x);
    float x = mix(${STREAM_START.toFixed(1)}, ${STREAM_END.toFixed(1)}, s / .86);
    float spread = 2.3, alive = 1., gain = .55, passed = 0., flash = 0.;
    for (int i = 0; i < 5; i++) {
      float px = uPX[i];
      if (x > px) {
        passed += 1.; spread *= .7; gain *= 1.28;
        float keep = hash(aSeed.w * 91.7 + float(i) * 13.1) < .8 ? 1. : 0.;
        alive *= mix(1., keep, smoothstep(px, px + .9, x));      // suppressed readings burn out after the plate
        flash += (1. - keep) * exp(-(x - px) * 5.) * 2.5;          // and flare as they die
      }
      flash += exp(-abs(x - px) * 6.) * (abs(float(i) - uFocus) < .5 ? 1.6 : .35);
    }
    vec3 lane = vec3(x, .7 + aSeed.y * spread + sin(x * 1.3 + aSeed.x * 40.) * .09 * spread, aSeed.z * spread);
    vec3 target = mix(aTarget, vec3(-aTarget.x * .9, -aTarget.y + 1.5, aTarget.z), uAlt);
    float u = smoothstep(.8, 1., s);
    vec3 p = mix(lane, target, u * u);
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = min(16. * uDpr, uSize * uDpr * (20. / max(.2, -mv.z)) * (1. + flash * .5));
    vec3 col = mix(uMuted, uEmber, clamp(passed / 4., 0., 1.));
    col = mix(col, uBone, clamp(flash * .35, 0., 1.));
    col = mix(col, uBrass * 1.1, uAlt * u);
    vColor = col * gain;
    vAlpha = uStream * alive * (1. - smoothstep(.93, 1., s)) * smoothstep(0., .04, s) * .8;
  }`;
const pointFragment = /* glsl */ `
  varying vec3 vColor; varying float vAlpha;
  void main() { float d = length(gl_PointCoord - .5); if (d > .5) discard; float a = smoothstep(.5, 0., d) * vAlpha; gl_FragColor = vec4(vColor * a, a); }`;

function streamGeometry(n: number) {
  const r = rng(19), seed = new Float32Array(n * 4), target = new Float32Array(n * 3);
  const samples = geometry.samples as Array<[number, number]>;
  const [rcx, rcy] = geometry.ringCenter;
  for (let i = 0; i < n; i++) {
    const g1 = Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r());
    const g2 = Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r());
    seed.set([r(), g1 * 0.5, g2 * 0.5, r()], i * 4);
    const s = samples[Math.floor(r() * samples.length)];
    target.set([(s[0] - rcx) / 8, -(s[1] - rcy) / 8, (r() - 0.5) * 0.4], i * 3);
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(target.slice(), 3));
  g.setAttribute('aSeed', new BufferAttribute(seed, 4));
  g.setAttribute('aTarget', new BufferAttribute(target, 3));
  return g;
}

// ---------------------------------------------------------------- textures from the page
function plateTexture(numeral: string, label: string, kicker: string): CanvasTexture {
  const W = 512, H = 680, c = document.createElement('canvas'); c.width = W * 2; c.height = H * 2; // 2x for crisp engraving
  const x = c.getContext('2d')!; x.scale(2, 2);
  const g = x.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, rgba(C['ink-2'], 0.55)); g.addColorStop(1, rgba(C.ink, 0.25));
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.strokeStyle = C.brass; x.lineWidth = 4; x.strokeRect(8, 8, W - 16, H - 16);
  x.strokeStyle = C['brass-dim']; x.lineWidth = 2; x.strokeRect(26, 26, W - 52, H - 52);
  for (let i = 0; i < 40; i++) { const y = 60 + i * 14; x.strokeStyle = C['brass-dim']; x.lineWidth = i % 5 ? 1 : 2; x.beginPath(); x.moveTo(40, y); x.lineTo(i % 5 ? 52 : 62, y); x.stroke(); }
  x.textAlign = 'center';
  x.fillStyle = C.brass; x.font = '400 64px "Bodoni Moda Variable", serif'; x.fillText(numeral, W / 2, 150);
  x.fillStyle = C.ember; x.fillRect(W / 2 - 36, 190, 72, 3);
  x.fillStyle = C.bone; x.font = `400 ${label.length > 10 ? 70 : 84}px "Bodoni Moda Variable", serif`; x.fillText(label, W / 2, 380);
  x.fillStyle = C.muted; x.font = '500 24px "Geist Mono Variable", monospace'; x.fillText(kicker.toUpperCase().split('').join(' '), W / 2, 560);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 16; return t;
}

function glyphTexture(svg: SVGSVGElement): CanvasTexture {
  const S = 512, c = document.createElement('canvas'); c.width = c.height = S;
  const x = c.getContext('2d')!; const k = S / 64;
  x.scale(k, k); x.lineWidth = 1.8; x.lineCap = 'round'; x.lineJoin = 'round';
  svg.querySelectorAll('path, circle').forEach((el) => {
    let p: Path2D;
    if (el.tagName === 'path') p = new Path2D(el.getAttribute('d')!);
    else { p = new Path2D(); p.arc(+el.getAttribute('cx')!, +el.getAttribute('cy')!, +el.getAttribute('r')!, 0, Math.PI * 2); }
    if (el.classList.contains('dot')) { x.fillStyle = C.ember; x.fill(p); } else { x.strokeStyle = el.classList.contains('faint') ? C['brass-dim'] : C.brass; x.stroke(p); }
  });
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t;
}

function softDot(): CanvasTexture {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d')!, g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, C.bone); g.addColorStop(0.25, C.ember); g.addColorStop(1, 'transparent');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t;
}

// a torus that fills along its sweep (gauges) or glows holographic (verifier, shockwave)
function arcMaterial(kind: 'gauge' | 'holo') {
  return new ShaderMaterial({
    transparent: true, depthWrite: false, blending: AdditiveBlending, side: DoubleSide,
    uniforms: { uFill: { value: 0 }, uO: { value: 0 }, uT: { value: 0 }, uColor: { value: new Color(C.brass) }, ...holoUniforms() },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
    fragmentShader: `uniform float uFill, uO, uT; uniform vec3 uColor, uH1, uH2, uH3; varying vec2 vUv; ${HOLO_GLSL}
      void main(){
        ${kind === 'gauge'
          ? 'float on = step(vUv.x, uFill); vec3 c = mix(uColor * .25, uColor * 1.6, on); gl_FragColor = vec4(c * uO, uO * mix(.35, 1., on));'
          : 'vec3 c = holo(vUv.x + uT * .15) * 1.5; gl_FragColor = vec4(c * uO, uO);'}
      }`,
  });
}

export interface Forge { update(time: number, P: P, dt: number): void }

export function buildForge(scene: Scene, mobile: boolean, dpr: number, stationPos: (k: number) => Vector3): Forge {
  const texts = Array.from(document.querySelectorAll('.film__plates li')).map((li) => li.textContent?.trim() ?? '');
  const kicker = texts[5] ?? '';
  const NUMS = ['I', 'II', 'III', 'IV', 'V'];

  // river
  const streamMat = new ShaderMaterial({
    vertexShader: streamVertex, fragmentShader: pointFragment, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 }, uStream: { value: 0 }, uDpr: { value: dpr }, uFocus: { value: -1 }, uAlt: { value: 0 }, uSize: { value: 1.7 },
      uPX: { value: PLATE_X.slice() }, uMuted: { value: new Color(C.muted) }, uBrass: { value: new Color(C.brass) }, uEmber: { value: new Color(C.ember) }, uBone: { value: new Color(C.bone) },
    },
  });
  const stream = new Points(streamGeometry(mobile ? 7000 : 16000), streamMat);
  stream.frustumCulled = false; scene.add(stream);

  // plates
  const plates = texts.slice(0, 5).map((label, i) => {
    const mat = new MeshBasicMaterial({ map: plateTexture(NUMS[i], label, kicker), transparent: true, opacity: 0, depthWrite: false, side: DoubleSide });
    const mesh = new Mesh(new PlaneGeometry(2.4, 3.19), mat);
    const g = new Group(); g.add(mesh); scene.add(g);
    return { g, mat, flash: 0 };
  });

  // measurement shockwave
  const shockMat = arcMaterial('holo');
  const shock = new Mesh(new TorusGeometry(1, 0.025, 8, 160), shockMat); shock.position.set(0, 0.6, 0); scene.add(shock);
  const shock2 = new Mesh(new TorusGeometry(1, 0.012, 8, 160), shockMat); shock2.position.set(0, 0.6, 0); scene.add(shock2);

  // rite: glyphs, pulses, scanner, gauges, verifier rings
  const glyphSvgs = Array.from(document.querySelectorAll<SVGSVGElement>('.arcana__deck .card__glyph'));
  const glyphs = glyphSvgs.map((svg) => { const s = new Sprite(new SpriteMaterial({ map: glyphTexture(svg), transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending })); scene.add(s); return s; });
  const dot = softDot();
  const pulses = Array.from({ length: 12 }, () => { const s = new Sprite(new SpriteMaterial({ map: dot, transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending })); s.scale.setScalar(0.45); scene.add(s); return s; });
  const scanMat = new MeshBasicMaterial({ color: new Color(C.ember).multiplyScalar(2.2), transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending });
  const scanner = new Mesh(new TorusGeometry(2.2, 0.025, 8, 160), scanMat); scanner.rotation.x = Math.PI / 2; scene.add(scanner);
  const gauges = [2.5, 2.85, 3.2].map((r, i) => {
    const m = arcMaterial('gauge'); const mesh = new Mesh(new TorusGeometry(r, 0.035, 8, 200), m);
    mesh.position.set(0.3, TOWER_Y + 0.9, -2.6); scene.add(mesh); return { mesh, m, target: [0.78, 0.86, 0.93][i] };
  });
  const verifiers = [1.45, 1.85, 2.25].map((r, i) => {
    const m = arcMaterial('holo'); const mesh = new Mesh(new TorusGeometry(r, 0.03, 8, 200), m); scene.add(mesh); return { mesh, m, tilt: [0.4, -0.7, 1.2][i], speed: [0.5, -0.35, 0.25][i] };
  });

  const tmp = new Vector3();
  return {
    update(time, P, dt) {
      // river
      streamMat.uniforms.uTime.value = time; streamMat.uniforms.uStream.value = P.stream;
      streamMat.uniforms.uFocus.value = P.plateFocus; streamMat.uniforms.uAlt.value = P.alt;
      stream.visible = P.stream > 0.001;

      // plate positions: the bench (with the swap of Task and Format), the tower, the delivered tablet
      const sw = ease(clamp01(P.plateSwap));
      const benchX = PLATE_X.slice();
      benchX[2] = PLATE_X[2] + (PLATE_X[4] - PLATE_X[2]) * sw; benchX[4] = PLATE_X[4] + (PLATE_X[2] - PLATE_X[4]) * sw;
      const ux = streamMat.uniforms.uPX.value as number[];
      for (let i = 0; i < 5; i++) ux[i] = benchX[i];
      plates.forEach((pl, i) => {
        const lift = i === 2 ? Math.sin(sw * Math.PI) * 2.4 : i === 4 ? -Math.sin(sw * Math.PI) * 1.6 : 0;
        const bench = new Vector3(benchX[i], 0.7 + lift, (i === 2 || i === 4) ? Math.sin(sw * Math.PI) * (i === 2 ? 1.5 : -1.5) : 0);
        const w = ease(clamp01(P.stack * 1.7 - i * 0.17));
        // the draft: an upright staircase of glass tablets in operator order, strongest first; delivery merges it into one
        const dv = ease(clamp01(P.deliver));
        const step = new Vector3(-1.3 + i * 0.65, TOWER_Y - 0.6 + i * 0.5, -i * 0.55);
        const merged = new Vector3(0.3, TOWER_Y + 1.6, -1.1);
        const tower = step.lerp(merged, dv);
        pl.g.position.lerpVectors(bench, tower, w);
        pl.g.rotation.set(0, (1 - w) * 1.05 + w * (-0.32 + Math.sin(time * 0.4 + i) * 0.04), 0);
        pl.g.scale.setScalar(1 - 0.36 * w + 0.12 * dv * w);
        const focus = Math.abs(i - P.plateFocus) < 0.5 ? 1 : 0;
        const fault = i === 3 ? P.fault : 0;
        pl.flash = Math.max(0, pl.flash - dt * 1.5);
        if (i === 3 && P.fault > 0.95) pl.flash = 1;
        const bright = 1 + focus * 1.2 + pl.flash * 0.6 * (1 - P.fault) + ease(clamp01(P.deliver)) * 0.5;
        pl.mat.color.setRGB(bright, bright, bright).lerp(new Color(C.ember).multiplyScalar(1.6 + Math.sin(time * 30) * 0.4), fault);
        const deliverFade = i === 4 ? 1 : 1 - 0.75 * ease(clamp01(P.deliver));
        pl.mat.opacity = P.plates * deliverFade * (0.92 - 0.25 * (1 - focus) * (P.plateFocus >= 0 ? 1 : 0));
      });

      // shockwave of measurement
      const st = P.shockwave;
      shockMat.uniforms.uO.value = st > 0 && st < 1 ? Math.pow(1 - st, 1.4) : 0; shockMat.uniforms.uT.value = time;
      shock.scale.setScalar(0.4 + st * 11); shock2.scale.setScalar(0.3 + Math.max(0, st - 0.12) * 13);
      shock.lookAt(tmp.set(P.cam.x, P.cam.y, P.cam.z)); shock2.lookAt(tmp);

      // rite: glyphs whirl, one is chosen
      const pick = ease(clamp01(P.pick));
      // a zodiac wheel of the seven shapes, always facing the viewer, spinning until one is chosen
      const hub = new Vector3(0.3, TOWER_Y + 0.9, -0.8);
      const toCam = new Vector3(P.cam.x, P.cam.y, P.cam.z).sub(hub).normalize();
      const right = new Vector3(0, 1, 0).cross(toCam).normalize(), upv = toCam.clone().cross(right).normalize();
      glyphs.forEach((s, i) => {
        const a = (i / glyphs.length) * Math.PI * 2 + time * (1.4 - pick * 1.1);
        const orbit = hub.clone().addScaledVector(right, Math.cos(a) * 3.1).addScaledVector(upv, Math.sin(a) * 3.1);
        const chosen = i === 0;
        const crest = new Vector3(0.3, TOWER_Y + 2.1 + (P.stack > 0.5 ? 1.3 + ease(clamp01(P.deliver)) * 0.6 : 0), -0.8);
        s.position.copy(chosen ? orbit.clone().lerp(crest, pick) : orbit);
        s.scale.setScalar(chosen ? 1.1 + pick * 0.9 : 1.1);
        s.material.opacity = P.glyphs * (chosen ? 1 : 1 - pick);
      });

      // interview: light travels between the second station and the chosen shape, question and answer
      const from = stationPos(1).clone().setY(0.2), to = new Vector3(0, TOWER_Y + 1.2, 0);
      pulses.forEach((s, i) => {
        const ph = (time * 0.42 + i / pulses.length) % 1, back = i % 2 === 1;
        const u = back ? 1 - ph : ph;
        const mid = from.clone().lerp(to, 0.5).add(new Vector3(0, 3.2, 0));
        const a = from.clone().lerp(mid, u), b = mid.clone().lerp(to, u);
        s.position.copy(a.lerp(b, u));
        s.material.opacity = P.pulses * Math.sin(ph * Math.PI);
        s.material.color.set(back ? C.brass : C.bone);
      });

      // audit: a ring of light sweeps the tower
      scanner.position.set(0.3, TOWER_Y - 1.9 + P.scan * 4.6, -1.1);
      scanMat.opacity = Math.sin(clamp01(P.scan) * Math.PI) * P.plates;

      // score: three gauges fill
      gauges.forEach((g) => { g.m.uniforms.uFill.value = P.gauges * g.target; g.m.uniforms.uO.value = 0.75 * Math.min(1, P.gauges * 4) * (1 - ease(clamp01(P.deliver))); g.mesh.rotation.z = Math.PI / 2; });

      // deliver: three verifier rings (static, single-run, cross-run) close around the tablet
      verifiers.forEach((v, i) => {
        v.mesh.position.set(0.3, TOWER_Y + 1.6, -1.1);
        const close = ease(clamp01(P.verifyRings * 1.4 - i * 0.2));
        v.mesh.scale.setScalar(2.2 - 1.2 * close);
        v.mesh.rotation.set(Math.PI / 2 + v.tilt * (1 - close * 0.4), time * v.speed, v.tilt);
        v.m.uniforms.uO.value = close * 0.6; v.m.uniforms.uT.value = time + i;
      });
    },
  };
}
