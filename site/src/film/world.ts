// film-world: one persistent WebGL scene. The director tweens `params`; the world only reads them.
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, Color, DoubleSide, Group, InstancedMesh, Mesh,
  MeshBasicMaterial, Object3D, PerspectiveCamera, PlaneGeometry, Points, RingGeometry, Scene, ShaderMaterial,
  SphereGeometry, Sprite, SpriteMaterial, SRGBColorSpace, TorusGeometry, Vector2, Vector3, WebGLRenderer, BoxGeometry, FogExp2,
  WebGLRenderTarget, HalfFloatType, LineSegments,
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { gsap } from 'gsap';
import geometry from '../flame-geometry.json';
import { tokens } from '../tokens';
import { cardTextures } from './cards';
import { buildSpace } from './space';
import { buildForge } from './forge';

const C = tokens.color;
const FX = tokens.effects;
const FILM = FX.film;

export const params = {
  cam: { x: 0, y: 0.3, z: 9.5, tx: 0, ty: 0.6, tz: 0, fov: FILM['fov-deg'] as number },
  measure: 0, band: 0, bandY: 0.5, dive: 0,
  armillary: 0, ringTilt: 0, ringSpin: 0.25, swap: 0, scatter: 0, dial: 0,
  cards: 0, cardFocus: 0, stations: 0, stationLit: 0, holoArc: 0,
  bloom: 1, shock: 0, glow: 1, // bloom is a multiplier on the token strength
  // the bench (The principle) and the forge (The rite)
  stream: 0, plates: 0, plateFocus: -1, plateSwap: 0, alt: 0, ghost: 0, shockwave: 0,
  glyphs: 0, pick: 0, pulses: 0, stack: 0, scan: 0, fault: 0, gauges: 0, deliver: 0, verifyRings: 0,
  // prompt space (The principle) and the film grammar
  space: 0, readings: 0, arrow: 0, warpOp: 0, comm: 0, interf: 0, collapse: 0, warp: 0, drift: 1, flame: 1,
  pointer: new Vector2(),
};

// ---------------------------------------------------------------- flame points
const pointVertex = /* glsl */ `
  attribute vec3 aA; attribute vec3 aB; attribute vec4 aData;
  uniform float uMeasure, uTime, uSize, uDpr, uBand, uBandY, uDive, uGhost, uAlt, uFocus, uFlameO;
  uniform vec3 uEmber, uEmberDeep, uBrass, uBone, uMuted, uH1, uH2, uH3;
  varying vec3 vColor; varying float vAlpha;
  float ease(float t) { return t < .5 ? 4. * t * t * t : 1. - pow(-2. * t + 2., 3.) / 2.; }
  void main() {
    float seed = aData.x;
    float t = ease(clamp(uMeasure * 1.35 - seed * .35, 0., 1.));
    vec3 a = aA + vec3(sin(uTime * .3 + seed * 40.), cos(uTime * .27 + seed * 31.), sin(uTime * .22 + seed * 17.)) * .35;
    vec3 b = aB;
    if (aData.y < .5) {
      b.y += sin(uTime * 3.1 + seed * 60. + aB.y * 3.5) * .02 * 6.75 * aData.w * t;
      b.x += sin(uTime * 2.3 + seed * 23.) * .006 * 6.75 * aData.w * t;
    }
    // another order, another prompt: the same points land as an inverted, colder flame
    b = mix(b, vec3(-b.x * .9, -b.y + 1.5, b.z), uAlt * step(aData.y, 1.5));
    vec3 p = mix(a, b, t);
    // superposition: the flame splits into five ghost readings until it is measured
    float k = floor(fract(seed * 17.31) * 5.) - 2.;
    p += vec3(k * 3.6, sin(uTime * 1.7 + k * 1.3) * .3 - abs(k) * .25, -abs(k) * .7) * uGhost;
    p *= 1. + uDive * (1.5 + 7. * seed);
    p.z += uDive * 6. * (seed - .3);
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    gl_Position = projectionMatrix * mv;
    // depth of field: points away from the focal plane open into soft discs and dim, like a lens
    float coc = min(4., abs(-mv.z - uFocus) * .16);
    gl_PointSize = min(22. * uDpr, uSize * uDpr * (20. / max(.2, -mv.z)) * mix(1.25, 1., t) * (1. + uDive * 1.6) * (1. + coc));

    vec3 before = mix(mix(uMuted, uBrass, fract(seed * 7.13)), uBone, step(.93, fract(seed * 13.7))) * 1.15;
    vec3 after = aData.y < .5 ? mix(uEmberDeep, uEmber, .35 + .65 * aData.w) : aData.y < 1.5 ? uBrass : uBone;
    vec3 col = mix(before, after, t);
    float bandMask = aData.y < .5 ? mix(1., abs(aData.w - uBandY) < .12 ? 1.9 : .18, uBand) : 1.;
    col *= bandMask;
    if (aData.z > .5) {
      float win = smoothstep(.04, .2, uMeasure) * (1. - smoothstep(.8, .96, uMeasure));
      float g = fract(seed * 3. + uTime * .3) * 2.;
      vec3 holo = g < 1. ? mix(uH1, uH2, g) : mix(uH2, uH3, g - 1.);
      col = mix(col, holo * 1.4, win);
    }
    col = mix(col, uBrass * .55, uAlt * step(aData.y, .5));
    float gh = fract(seed * 3. + uTime * .25 + k * .2) * 2.;
    col = mix(col, (gh < 1. ? mix(uH1, uH2, gh) : mix(uH2, uH3, gh - 1.)) * .75, uGhost * .6 * step(.5, abs(k)));
    vColor = col;
    vAlpha = mix(.55, .5, t) * (1. - uDive * .2) / (1. + coc * coc * .9) * mix(1., uFlameO, step(aData.y, 1.5));
  }`;
const pointFragment = /* glsl */ `
  varying vec3 vColor; varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - .5);
    if (d > .5) discard;
    float a = smoothstep(.5, 0., d) * vAlpha;
    gl_FragColor = vec4(vColor * a, a);
  }`;

type Pt = [number, number];
function distToPolyline(p: Pt, line: Pt[]): number {
  let best = Infinity;
  for (let i = 0; i < line.length - 1; i++) {
    const [ax, ay] = line[i], [bx, by] = line[i + 1];
    const dx = bx - ax, dy = by - ay;
    const t = Math.max(0, Math.min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / (dx * dx + dy * dy || 1)));
    best = Math.min(best, Math.hypot(p[0] - ax - t * dx, p[1] - ay - t * dy));
  }
  return best;
}
const rng = (seed: number) => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const gauss = (r: () => number) => Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r());
const MARK_SCALE = 1 / 8; // 64-unit mark -> 8 world units

function flameGeometry(count: number) {
  const r = rng(7);
  const wave = geometry.wave.replace(/^M/, '').split(' L').map((s) => s.trim().split(' ').map(Number) as Pt);
  const [dx, dy] = geometry.dot;
  const samples = (geometry.samples as Pt[]).filter((p) => distToPolyline(p, wave) > 1.0 && Math.hypot(p[0] - dx, p[1] - dy) > 2.35);
  const [rcx, rcy] = geometry.ringCenter;
  const A = new Float32Array(count * 3), B = new Float32Array(count * 3), D = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    A[i * 3] = gauss(r) * 5.5; A[i * 3 + 1] = gauss(r) * 3.6; A[i * 3 + 2] = gauss(r) * 5 + 2.5;
    const roll = r();
    let kind = 0, u: number, v: number, z: number;
    if (roll < 0.17) {
      kind = 1;
      const big = r() < 0.6, R = big ? geometry.rings[0] : geometry.rings[1], a = r() * Math.PI * 2, j = (r() - 0.5) * (big ? 1.1 : 0.45);
      u = rcx + Math.cos(a) * (R + j); v = rcy + Math.sin(a) * (R + j); z = (r() - 0.5) * 0.5;
    } else {
      kind = roll > 0.968 ? 2 : 0;
      const s = samples[Math.floor(r() * samples.length)];
      u = s[0] + gauss(r) * 0.2; v = s[1] + gauss(r) * 0.2; z = gauss(r) * 2.0;
    }
    B[i * 3] = (u - rcx) * MARK_SCALE; B[i * 3 + 1] = -(v - rcy) * MARK_SCALE; B[i * 3 + 2] = z * MARK_SCALE;
    D[i * 4] = r(); D[i * 4 + 1] = kind; D[i * 4 + 2] = r() < FX['point-cloud']['holo-share'] ? 1 : 0;
    D[i * 4 + 3] = kind === 0 ? Math.min(1, Math.max(0, (57 - v) / 54)) : 0;
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(B.slice(), 3));
  g.setAttribute('aA', new BufferAttribute(A, 3));
  g.setAttribute('aB', new BufferAttribute(B, 3));
  g.setAttribute('aData', new BufferAttribute(D, 4));
  return g;
}

// ---------------------------------------------------------------- textures
function radialTexture(inner: string, outer = 'transparent'): CanvasTexture {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, inner); g.addColorStop(1, outer);
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t;
}
const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
function dialTexture(inner: number, outer: number): CanvasTexture {
  const S = 2048, c = document.createElement('canvas'); c.width = c.height = S;
  const x = c.getContext('2d')!, k = S / 2 / outer, cx = S / 2;
  x.strokeStyle = C.brass; x.fillStyle = C.brass;
  const ring = (r: number, w: number) => { x.lineWidth = w; x.beginPath(); x.arc(cx, cx, r * k, 0, Math.PI * 2); x.stroke(); };
  ring(outer * 0.995, 3); ring(inner * 1.01, 2); ring(inner + (outer - inner) * 0.62, 1.2);
  for (let i = 0; i < 360; i++) {
    const a = (i / 360) * Math.PI * 2, long = i % 30 === 0 ? 0.55 : i % 5 === 0 ? 0.32 : 0.16;
    const r1 = outer * 0.99, r0 = outer - (outer - inner) * long;
    x.lineWidth = i % 30 === 0 ? 3 : 1.4;
    x.beginPath(); x.moveTo(cx + Math.cos(a) * r1 * k, cx + Math.sin(a) * r1 * k); x.lineTo(cx + Math.cos(a) * r0 * k, cx + Math.sin(a) * r0 * k); x.stroke();
  }
  x.font = `${Math.round((outer - inner) * k * 0.26)}px "Bodoni Moda Variable", serif`;
  x.textAlign = 'center'; x.textBaseline = 'middle';
  NUMERALS.forEach((n, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2, r = inner + (outer - inner) * 0.3;
    x.save(); x.translate(cx + Math.cos(a) * r * k, cx + Math.sin(a) * r * k); x.rotate(a + Math.PI / 2); x.fillText(n, 0, 0); x.restore();
  });
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 4; return t;
}

// ---------------------------------------------------------------- post
const filmShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uShock: { value: 0 }, uAberration: { value: FILM.aberration }, uGrain: { value: FILM.grain }, uVignette: { value: FILM.vignette } },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uTime, uShock, uAberration, uGrain, uVignette; varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main() {
      vec2 d = vUv - .5;
      float k = uAberration + uShock;
      vec3 col = vec3(texture2D(tDiffuse, vUv + d * k).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - d * k).b);
      col *= 1. - uVignette * smoothstep(.25, .85, length(d * vec2(1.15, 1.)));
      col += (hash(vUv * 1000. + fract(uTime * 7.)) - .5) * uGrain * (.35 + .65 * smoothstep(0., .25, dot(col, vec3(.333))));
      gl_FragColor = vec4(col, 1.);
    }`,
};

// ---------------------------------------------------------------- world
export interface World { dispose(): void; flipCard(i: number, on: boolean): void; play(): void; }

// yield between build stages so no single task blocks input for long
const breathe = () => new Promise<void>((r) => setTimeout(r, 0));

export async function createWorld(stage: HTMLElement, mobile: boolean): Promise<World> {
  const renderer = new WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? FX['point-cloud']['dpr-cap-mobile'] : FX['point-cloud']['dpr-cap']);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(new Color(C.void), 1);
  stage.append(renderer.domElement);

  const scene = new Scene();
  scene.fog = new FogExp2(new Color(C.void).getHex(), 0.018);
  const camera = new PerspectiveCamera(params.cam.fov, 1, 0.05, 400);
  const look = new Vector3();

  await breathe();
  // flame
  const pointMat = new ShaderMaterial({
    vertexShader: pointVertex, fragmentShader: pointFragment, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: {
      uMeasure: { value: 0 }, uTime: { value: 0 }, uSize: { value: FX['point-cloud']['size-px'] }, uDpr: { value: dpr },
      uBand: { value: 0 }, uBandY: { value: 0.5 }, uDive: { value: 0 }, uGhost: { value: 0 }, uAlt: { value: 0 }, uFocus: { value: 10 }, uFlameO: { value: 1 },
      uEmber: { value: new Color(C.ember) }, uEmberDeep: { value: new Color(C['ember-deep']) }, uBrass: { value: new Color(C.brass) },
      uBone: { value: new Color(C.bone) }, uMuted: { value: new Color(C.muted) },
      uH1: { value: new Color(C.holo.stops[0]) }, uH2: { value: new Color(C.holo.stops[1]) }, uH3: { value: new Color(C.holo.stops[2]) },
    },
  });
  const flame = new Points(flameGeometry(mobile ? FX['point-cloud']['points-mobile'] : FX['point-cloud']['points-desktop']), pointMat);
  flame.frustumCulled = false;
  scene.add(flame);
  const glow = new Sprite(new SpriteMaterial({ map: radialTexture(C['ember-deep']), blending: AdditiveBlending, transparent: true, depthWrite: false }));
  glow.scale.set(9, 11, 1); glow.position.set(0, 0.9, -0.5);
  scene.add(glow);

  await breathe();
  // stars
  {
    const r = rng(3), n = mobile ? 1600 : 4000, pos = new Float32Array(n * 3), D = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) {
      const u = r() * 2 - 1, a = r() * Math.PI * 2, rad = 45 + r() * 60, s = Math.sqrt(1 - u * u);
      pos[i * 3] = Math.cos(a) * s * rad; pos[i * 3 + 1] = u * rad; pos[i * 3 + 2] = Math.sin(a) * s * rad;
      D[i * 4] = r(); D[i * 4 + 1] = r() < 0.7 ? 2 : 1; D[i * 4 + 3] = 0;
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(pos, 3)); g.setAttribute('aA', new BufferAttribute(pos, 3)); g.setAttribute('aB', new BufferAttribute(pos, 3)); g.setAttribute('aData', new BufferAttribute(D, 4));
    const starMat = pointMat.clone(); starMat.uniforms.uMeasure.value = 1; starMat.uniforms.uSize.value = 4.5;
    const stars = new Points(g, starMat); stars.frustumCulled = false; scene.add(stars);
  }

  await breathe();
  // armillary
  const brass = new Color(C.brass);
  const ringMats: MeshBasicMaterial[] = [];
  const armillary = new Group(); scene.add(armillary);
  const radii = mobile ? [4.2, 5.2, 6.4] : [4.0, 4.7, 5.4, 6.2, 7.1];
  const tilts = [[1.1, 0.2, 0], [0.3, 0.9, 0.2], [-0.6, -0.3, 0.5], [1.45, 0, 0.3], [0.15, -1.2, -0.2]];
  const scatterDirs = radii.map((_, i) => new Vector3(Math.cos(i * 2.1) * 6, Math.sin(i * 1.7) * 4, -Math.abs(Math.sin(i)) * 5));
  const rings = radii.map((rad, i) => {
    const pivot = new Group();
    const mat = new MeshBasicMaterial({ color: brass, transparent: true, opacity: 0, depthWrite: false });
    ringMats.push(mat);
    const torus = new Mesh(new TorusGeometry(rad, i === radii.length - 1 ? 0.022 : 0.014, 6, 320), mat);
    pivot.add(torus);
    if (i === radii.length - 1 || i === 1) { // engraved ticks
      const n = i === 1 ? 72 : 144, tick = new InstancedMesh(new BoxGeometry(0.012, 0.12, 0.012), mat, n), o = new Object3D();
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2, len = k % 6 === 0 ? 1.8 : 1;
        o.position.set(Math.cos(a) * (rad - 0.06 * len), Math.sin(a) * (rad - 0.06 * len), 0); o.rotation.set(0, 0, a + Math.PI / 2); o.scale.set(1, len, 1); o.updateMatrix();
        tick.setMatrixAt(k, o.matrix);
      }
      pivot.add(tick);
    }
    armillary.add(pivot);
    return { pivot, rad, tilt: tilts[i % tilts.length], speed: (i % 2 ? -1 : 1) * (0.07 + i * 0.025) };
  });
  await breathe();
  const dialMat = new MeshBasicMaterial({ map: dialTexture(7.7, 8.9), color: new Color(1, 1, 1).multiplyScalar(0.8), transparent: true, opacity: 0, side: DoubleSide, depthWrite: false });
  const dial = new Mesh(new RingGeometry(7.7, 8.9, 256, 1), dialMat);
  dial.rotation.x = -1.18; dial.position.y = -0.6;
  scene.add(dial);

  await breathe();
  // cards
  const R = FILM['orbit-radius'];
  const orbit = new Group(); scene.add(orbit);
  const textures = await cardTextures();
  const cards = textures.map(([front, back], i) => {
    const holder = new Group(), flipper = new Group();
    const a = (i / textures.length) * Math.PI * 2;
    holder.position.set(Math.sin(a) * R, 0, Math.cos(a) * R); holder.rotation.y = a;
    const fm = new MeshBasicMaterial({ map: front, transparent: true, opacity: 0, depthWrite: false });
    const bm = new MeshBasicMaterial({ map: back, transparent: true, opacity: 0, depthWrite: false });
    const geo = new PlaneGeometry(2.2, 3.575);
    const f = new Mesh(geo, fm), b = new Mesh(geo, bm); b.rotation.y = Math.PI;
    flipper.add(f, b); holder.add(flipper); orbit.add(holder);
    return { flipper, fm, bm, flip: 0 };
  });

  await breathe();
  // rite stations + holo arc on a horizontal ring
  const RR = FILM['rite-radius'];
  const riteRing = new Mesh(new TorusGeometry(RR, 0.018, 6, 360), new MeshBasicMaterial({ color: brass, transparent: true, opacity: 0, depthWrite: false }));
  riteRing.rotation.x = Math.PI / 2; scene.add(riteRing);
  const stationAngle = (k: number) => -Math.PI / 2 + 0.35 + k * 0.42;
  const stationPos = (k: number) => new Vector3(Math.cos(stationAngle(k)) * RR, 0, -Math.sin(stationAngle(k)) * RR);
  const halo = radialTexture(C.bone);
  const stations = Array.from({ length: 6 }, (_, k) => {
    const core = new Mesh(new SphereGeometry(0.08, 16, 12), new MeshBasicMaterial({ color: brass.clone(), transparent: true, opacity: 0 }));
    const s = new Sprite(new SpriteMaterial({ map: halo, color: brass.clone(), blending: AdditiveBlending, transparent: true, opacity: 0, depthWrite: false }));
    s.scale.set(1.1, 1.1, 1);
    const p = stationPos(k); core.position.copy(p); s.position.copy(p);
    scene.add(core, s);
    return { core, s };
  });
  const arcSpan = stationAngle(5) - stationAngle(4);
  const holoMat = new ShaderMaterial({
    transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uT: { value: 0 }, uO: { value: 0 }, uH1: { value: new Color(C.holo.stops[0]) }, uH2: { value: new Color(C.holo.stops[1]) }, uH3: { value: new Color(C.holo.stops[2]) } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
    fragmentShader: `uniform float uT, uO; uniform vec3 uH1, uH2, uH3; varying vec2 vUv;
      void main(){ float g = fract(vUv.x + uT * .2) * 2.; vec3 c = g < 1. ? mix(uH1, uH2, g) : mix(uH2, uH3, g - 1.); gl_FragColor = vec4(c * uO * 1.6, uO); }`,
  });
  const holoArc = new Mesh(new TorusGeometry(RR, 0.045, 8, 64, arcSpan), holoMat);
  holoArc.rotation.set(Math.PI / 2, 0, stationAngle(4));
  scene.add(holoArc);

  await breathe();
  await breathe();
  const forge = buildForge(scene, mobile, dpr, stationPos);
  await breathe();
  const space = await buildSpace(scene, mobile, dpr);

  // warp streaks for chapter journeys: lines that live in camera space and rush past the lens
  scene.add(camera);
  const SN = mobile ? 500 : 1400, spos = new Float32Array(SN * 6), sinf = new Float32Array(SN * 8);
  { const r = rng(23); for (let i = 0; i < SN; i++) { const a = r() * Math.PI * 2, rad = 1.2 + Math.pow(r(), 0.6) * 14, ph = r(), hue = r();
      for (let h = 0; h < 2; h++) { spos.set([Math.cos(a) * rad, Math.sin(a) * rad, 0], i * 6 + h * 3); sinf.set([ph, h, hue, 0], i * 8 + h * 4); } } }
  const sg = new BufferGeometry(); sg.setAttribute('position', new BufferAttribute(spos, 3)); sg.setAttribute('aS', new BufferAttribute(sinf, 4));
  const streakMat = new ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: { uT: { value: 0 }, uW: { value: 0 }, uBone: { value: new Color(C.bone) }, uBrass: { value: new Color(C.brass) }, uH: { value: new Color(C.holo.stops[0]) } },
    vertexShader: `attribute vec4 aS; uniform float uT, uW; uniform vec3 uBone, uBrass, uH; varying vec3 vC; varying float vA;
      void main(){ float z = -2. - mod(aS.x * 120. - uT * 60. * (.4 + uW), 120.);
        vec3 p = vec3(position.xy, z + aS.y * uW * 9.);
        gl_Position = projectionMatrix * vec4(p, 1.);
        vC = aS.z < .7 ? uBone : aS.z < .92 ? uBrass : uH; vA = uW * (1. - smoothstep(60., 120., -z)) * (.3 + .7 * aS.y); }`,
    fragmentShader: 'varying vec3 vC; varying float vA; void main(){ gl_FragColor = vec4(vC * vA, vA); }' });
  const streaks = new LineSegments(sg, streakMat); streaks.frustumCulled = false; camera.add(streaks);

  // post
  // multisampled, half-float target: thin engraved lines stay crisp under the post stack
  const target = new WebGLRenderTarget(2, 2, { type: HalfFloatType, samples: FILM.msaa });
  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new Vector2(256, 256), FILM['bloom-strength'], FILM['bloom-radius'], FILM['bloom-threshold']);
  composer.addPass(bloom);
  const film = new ShaderPass(filmShader);
  composer.addPass(film); // the scene already renders in display space; the film pass adds aberration, vignette and grain only

  if (new URLSearchParams(location.search).has('debug')) (window as unknown as Record<string, unknown>).__film = { bloom, film, composer, scene, params, flame, glow };
  const resize = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false); composer.setSize(w, h);
    bloom.resolution.set(w * (mobile ? 0.5 : 1), h * (mobile ? 0.5 : 1));
    camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize); ro.observe(stage);

  // loop
  let raf = 0, running = false, started = false, last = performance.now(), time = 0, frameAvg = 1 / 60, sinceAdapt = 0; // nothing renders until the visitor enters
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!running) return;
    const raw = (now - last) / 1000;
    const dt = Math.min(0.05, raw); last = now; time += dt;
    // adaptive resolution: keep the film fluid on modest GPUs, sharp on strong ones
    frameAvg = frameAvg * 0.95 + raw * 0.05; sinceAdapt += raw;
    if (sinceAdapt > 1.2) {
      const cap = mobile ? FX['point-cloud']['dpr-cap-mobile'] : FX['point-cloud']['dpr-cap'];
      const cur = renderer.getPixelRatio();
      const next = frameAvg > 1 / 40 ? Math.max(Math.min(1, devicePixelRatio || 1), cur - 0.25) : frameAvg < 1 / 75 ? Math.min(Math.min(devicePixelRatio || 1, cap), cur + 0.25) : cur;
      if (next !== cur) { renderer.setPixelRatio(next); composer.setPixelRatio(next); resize(); pointMat.uniforms.uDpr.value = next; }
      sinceAdapt = 0;
    }
    const P = params;
    // camera with a breath of pointer parallax
    // a camera that is never quite still: a slow orbit-like drift on top of the pointer's parallax
    const dr = P.drift;
    camera.position.set(P.cam.x + P.pointer.x * 0.35 + Math.sin(time * 0.11) * 0.55 * dr, P.cam.y - P.pointer.y * 0.22 + Math.sin(time * 0.07) * 0.28 * dr, P.cam.z + Math.cos(time * 0.09) * 0.45 * dr);
    look.set(P.cam.tx, P.cam.ty, P.cam.tz);
    camera.lookAt(look);
    if (Math.abs(camera.fov - P.cam.fov) > 0.01) { camera.fov = P.cam.fov; camera.updateProjectionMatrix(); }

    const u = pointMat.uniforms;
    u.uTime.value = time; u.uMeasure.value = P.measure; u.uBand.value = P.band; u.uBandY.value = P.bandY; u.uDive.value = P.dive;
    glow.material.opacity = 0.18 * P.measure * P.glow * (1 - P.dive);

    // armillary: tilt from inclined to flat (logo alignment), spin, swap, scatter
    rings.forEach((ring, i) => {
      const k = 1 - P.ringTilt;
      ring.pivot.rotation.set(ring.tilt[0] * k + time * ring.speed * P.ringSpin * k, ring.tilt[1] * k + time * ring.speed * 0.6 * P.ringSpin, ring.tilt[2] * k);
      const swapScale = i === 1 ? 1 + (radii[2] / radii[1] - 1) * P.swap : i === 2 ? 1 + (radii[1] / radii[2] - 1) * P.swap : 1;
      const sc = (1 - P.scatter * 0.6) * swapScale;
      ring.pivot.scale.setScalar(sc);
      ring.pivot.position.copy(scatterDirs[i]).multiplyScalar(P.scatter);
      ringMats[i].opacity = P.armillary * (0.55 + 0.25 * (i % 2));
    });
    dial.rotation.z = time * 0.02; dialMat.opacity = P.dial * 0.75;

    // cards orbit and flip
    orbit.rotation.y = -(P.cardFocus / cards.length) * Math.PI * 2 + time * 0.01 * (1 - P.cards);
    cards.forEach((c, i) => {
      c.flipper.rotation.y = c.flip * Math.PI;
      const n = cards.length, d = (((i - P.cardFocus) % n) + n) % n, focus = 1 - Math.min(1, Math.min(d, n - d) / 0.9);
      c.fm.opacity = c.bm.opacity = P.cards * (0.1 + 0.9 * Math.max(0, focus));
    });

    // rite
    (riteRing.material as MeshBasicMaterial).opacity = P.stations * 0.7;
    stations.forEach((s, k) => {
      const lit = Math.max(0, Math.min(1, P.stationLit - k));
      const col = brass.clone().lerp(new Color(C.ember), lit);
      (s.core.material as MeshBasicMaterial).color.copy(col); (s.core.material as MeshBasicMaterial).opacity = P.stations;
      s.s.material.color.copy(col); s.s.material.opacity = P.stations * (0.15 + 0.45 * lit);
      s.s.scale.setScalar(0.35 + lit * 0.3 + Math.sin(time * 3 + k) * 0.04 * lit);
    });
    holoMat.uniforms.uT.value = time; holoMat.uniforms.uO.value = P.holoArc;
    u.uGhost.value = P.ghost; u.uAlt.value = P.alt; u.uFlameO.value = P.flame;
    forge.update(time, P, dt);
    space.update(time, P, camera.position);
    u.uFocus.value = camera.position.distanceTo(look);
    streakMat.uniforms.uT.value = time; streakMat.uniforms.uW.value = P.warp; streaks.visible = P.warp > 0.002;

    film.uniforms.uTime.value = time; film.uniforms.uShock.value = P.shock * FILM.shock;
    bloom.strength = FILM['bloom-strength'] * P.bloom;
    composer.render();
  };
  const onVis = () => { running = started && document.visibilityState === 'visible'; last = performance.now(); };
  document.addEventListener('visibilitychange', onVis);

  // pre-compile every shader (hidden objects included) and warm the post stack while the gate is still up,
  // so no scene stutters the first time its objects appear
  const hidden: Object3D[] = [];
  scene.traverse((o) => { if (!o.visible) { hidden.push(o); o.visible = true; } });
  try { await renderer.compileAsync(scene, camera); } catch { renderer.compile(scene, camera); }
  hidden.forEach((o) => (o.visible = false));
  composer.render();

  return {
    play() { if (started) return; started = true; running = document.visibilityState === 'visible'; last = performance.now(); raf = requestAnimationFrame(frame); },
    flipCard(i, on) { cards.forEach((c, k) => gsap.to(c, { flip: k === i && on ? 1 : 0, duration: 1.1, ease: 'power3.inOut' })); },
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); document.removeEventListener('visibilitychange', onVis);
      scene.traverse((o) => { const m = o as Mesh; m.geometry?.dispose(); const mat = m.material as MeshBasicMaterial | undefined; mat?.map?.dispose(); mat?.dispose?.(); });
      composer.dispose(); renderer.dispose(); renderer.domElement.remove();
    },
  };
}
