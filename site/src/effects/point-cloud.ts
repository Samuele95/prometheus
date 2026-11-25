// hero-point-cloud: a volume of points in superposition that collapses into the logo's flame and rings.
// The collapse is driven by `state.measure` (0..1), written by the hero choreography.
import {
  BufferAttribute, BufferGeometry, Color, OrthographicCamera, Points, Scene, ShaderMaterial, WebGLRenderer, AdditiveBlending,
} from 'three';
import geometry from '../flame-geometry.json';
import { tokens } from '../tokens';
import { state } from './state';

const fx = tokens.effects['point-cloud'];
const C = tokens.color;

const vertex = /* glsl */ `
  attribute vec3 aA;
  attribute vec3 aB;
  attribute vec4 aData; // x seed, y kind (0 flame, 1 ring, 2 spark), z holo, w height 0..1
  uniform float uMeasure, uTime, uSize, uDpr, uScale;
  uniform vec2 uOffset;
  uniform vec3 uEmber, uEmberDeep, uBrass, uBone, uMuted, uH1, uH2, uH3;
  varying vec3 vColor;
  varying float vAlpha;
  float ease(float t) { return t < .5 ? 4. * t * t * t : 1. - pow(-2. * t + 2., 3.) / 2.; }
  void main() {
    float seed = aData.x;
    float t = ease(clamp(uMeasure * 1.35 - seed * .35, 0., 1.));
    vec3 drift = vec3(sin(uTime * .35 + seed * 40.), cos(uTime * .3 + seed * 31.), sin(uTime * .25 + seed * 17.)) * 14.;
    vec3 a = aA + drift;
    vec3 b = vec3(aB.xy * uScale + uOffset, aB.z * uScale);
    if (aData.y < .5) { // flame flickers upward once it exists, more at the tip
      b.y += sin(uTime * 3.1 + seed * 60. + aB.y * .45) * .02 * 54. * uScale * aData.w * t;
      b.x += sin(uTime * 2.3 + seed * 23.) * .006 * 54. * uScale * aData.w * t;
    }
    vec3 p = mix(a, b, t);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
    gl_PointSize = uSize * uDpr * mix(1.7, 1.15, t);

    vec3 before = mix(uMuted, uBrass, fract(seed * 7.13));
    vec3 after = aData.y < .5 ? mix(uEmberDeep, uEmber, .6 + .4 * aData.w)
               : aData.y < 1.5 ? uBrass : uBone;
    vec3 col = mix(before, after, t);
    if (aData.z > .5) { // holo place 1: a flicker during the collapse only
      float win = smoothstep(.04, .2, uMeasure) * (1. - smoothstep(.8, .96, uMeasure));
      float g = fract(seed * 3. + uTime * .3) * 2.;
      vec3 holo = g < 1. ? mix(uH1, uH2, g) : mix(uH2, uH3, g - 1.);
      col = mix(col, holo, win);
    }
    vColor = col;
    vAlpha = mix(.85, .9, t);
  }`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
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

function parseWave(d: string): Pt[] {
  return d.replace(/^M/, '').split(' L').map((s) => s.trim().split(' ').map(Number) as Pt);
}

// deterministic pseudo-random so every visit draws the same constellation
function rng(seed: number) {
  return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
}
const gauss = (r: () => number) => Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r());

function build(count: number, w: number, h: number) {
  const r = rng(7);
  const wave = parseWave(geometry.wave);
  const [dotX, dotY] = geometry.dot;
  const samples = (geometry.samples as Pt[]).filter((p) => distToPolyline(p, wave) > 0.85 && Math.hypot(p[0] - dotX, p[1] - dotY) > 2.2);
  const yMin = 3, yMax = 57;
  const A = new Float32Array(count * 3), B = new Float32Array(count * 3), D = new Float32Array(count * 4);
  const [rcx, rcy] = geometry.ringCenter;
  for (let i = 0; i < count; i++) {
    // superposition: a wide, soft volume over the whole stage
    A[i * 3] = gauss(r) * w * 0.2 + w * 0.14;
    A[i * 3 + 1] = gauss(r) * h * 0.22;
    A[i * 3 + 2] = gauss(r) * 220;
    const roll = r();
    let kind = 0, u = 0, v = 0, z = 0;
    if (roll < 0.18) { // rings
      kind = 1;
      const ringR = r() < 0.6 ? geometry.rings[0] : geometry.rings[1];
      const a = r() * Math.PI * 2;
      const jitter = (r() - 0.5) * (ringR === geometry.rings[0] ? 1.1 : 0.45);
      u = rcx + Math.cos(a) * (ringR + jitter); v = rcy + Math.sin(a) * (ringR + jitter);
      z = (r() - 0.5) * 0.6;
    } else {
      kind = roll > 0.965 ? 2 : 0;
      for (let tries = 0; tries < 6; tries++) {
        const s = samples[Math.floor(r() * samples.length)];
        const cu = s[0] + gauss(r) * 0.22, cv = s[1] + gauss(r) * 0.22;
        if (distToPolyline([cu, cv], wave) > 0.8 && Math.hypot(cu - dotX, cv - dotY) > 2.15) { u = cu; v = cv; break; }
        u = s[0]; v = s[1];
      }
      z = gauss(r) * 2.2;
    }
    B[i * 3] = u - 32; B[i * 3 + 1] = -(v - 32); B[i * 3 + 2] = z;
    D[i * 4] = r(); D[i * 4 + 1] = kind; D[i * 4 + 2] = r() < fx['holo-share'] ? 1 : 0;
    D[i * 4 + 3] = kind === 0 ? Math.min(1, Math.max(0, (yMax - v) / (yMax - yMin))) : 0;
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(B.slice(), 3)); // three needs `position`; the shader ignores it
  g.setAttribute('aA', new BufferAttribute(A, 3));
  g.setAttribute('aB', new BufferAttribute(B, 3));
  g.setAttribute('aData', new BufferAttribute(D, 4));
  return g;
}

export function mountPointCloud(host: HTMLElement, mark: HTMLElement): () => void {
  const mobile = window.innerWidth < tokens.breakpoints.md;
  const renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? fx['dpr-cap-mobile'] : fx['dpr-cap']);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  host.prepend(renderer.domElement);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, -2000, 2000);
  camera.position.z = 1000;
  const holo = C.holo.stops;
  const material = new ShaderMaterial({
    vertexShader: vertex, fragmentShader: fragment, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: {
      uMeasure: { value: 0 }, uTime: { value: 0 }, uSize: { value: fx['size-px'] }, uDpr: { value: dpr },
      uScale: { value: 8 }, uOffset: { value: [0, 0] },
      uEmber: { value: new Color(C.ember) }, uEmberDeep: { value: new Color(C['ember-deep']) }, uBrass: { value: new Color(C.brass) },
      uBone: { value: new Color(C.bone) }, uMuted: { value: new Color(C.muted) },
      uH1: { value: new Color(holo[0]) }, uH2: { value: new Color(holo[1]) }, uH3: { value: new Color(holo[2]) },
    },
  });
  let points: Points | null = null;

  const layout = () => {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.left = -w / 2; camera.right = w / 2; camera.top = h / 2; camera.bottom = -h / 2;
    camera.updateProjectionMatrix();
    const hr = host.getBoundingClientRect(), mr = mark.getBoundingClientRect();
    const size = mr.width || Math.min(w, h) * 0.6;
    material.uniforms.uScale.value = size / 64;
    material.uniforms.uOffset.value = [mr.left + mr.width / 2 - (hr.left + w / 2), -(mr.top + mr.height / 2 - (hr.top + h / 2))];
    if (!points) {
      points = new Points(build(mobile ? fx['points-mobile'] : fx['points-desktop'], w, h), material);
      points.frustumCulled = false;
      scene.add(points);
    }
  };
  layout();
  mark.style.visibility = 'hidden';
  host.classList.add('is-live');

  let raf = 0, visible = true, running = true;
  const t0 = performance.now();
  const orbit = (tokens.motion.pointer['cloud-orbit-deg'] * Math.PI) / 180;
  const frame = (now: number) => {
    raf = 0;
    if (!running || !visible) return;
    const m = state.measure;
    material.uniforms.uTime.value = (now - t0) / 1000;
    material.uniforms.uMeasure.value = m;
    if (points) { points.rotation.y = state.pointer[0] * orbit * (1 - m); points.rotation.x = -state.pointer[1] * orbit * 0.5 * (1 - m); }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!raf && running && visible) raf = requestAnimationFrame(frame); };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); });
  io.observe(host);
  const onVis = () => { running = document.visibilityState === 'visible'; kick(); };
  document.addEventListener('visibilitychange', onVis);
  const ro = new ResizeObserver(() => { layout(); kick(); });
  ro.observe(host);
  kick();

  return () => {
    cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    points?.geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove();
    mark.style.visibility = '';
  };
}
