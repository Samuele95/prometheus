// Prompt space: the framework's formalism made visible (references/quantum-principles.md).
// A request is a state |ψ⟩ over possible readings (P3); a section is a matrix on that space (P1);
// sections don't commute (P2); they combine by interference (P4); measurement projects, irreversibly (P5).
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, Color, CylinderGeometry, ConeGeometry, Group, Line,
  LineBasicMaterial, LineDashedMaterial, LineSegments, Matrix3, Mesh, MeshBasicMaterial, Points, Quaternion, Scene,
  ShaderMaterial, Sprite, SpriteMaterial, SRGBColorSpace, Vector3,
} from 'three';
import { tokens } from '../tokens';
import type { params as Params } from './world';

const C = tokens.color;
type P = typeof Params;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// the six readings sit on a sphere around the flame; reading 2 is the one the measurement keeps
const DIRS = [
  new Vector3(0.95, 0.35, 0.2), new Vector3(-0.55, 0.75, 0.4), new Vector3(-0.9, -0.25, 0.45),
  new Vector3(0.2, -0.55, 0.9), new Vector3(0.45, 0.6, -0.75), new Vector3(-0.3, -0.35, -0.95),
].map((v) => v.normalize());
const R = 4.6;
export const CHOSEN = 1;
const AMPS = [0.5, 0.62, 0.38, 0.27, 0.33, 0.22];

// the operator of the "matrix" scene: amplify reading 2's direction, flatten reading 6's
function operatorMatrix(): Matrix3 {
  const a = DIRS[1], s = DIRS[5];
  const m = new Matrix3().identity();
  const add = (v: Vector3, k: number) => { // m += k · v vᵀ
    const e = m.elements;
    const vv = [v.x, v.y, v.z];
    for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) e[c * 3 + r] += k * vv[r] * vv[c];
  };
  add(a, 0.75); add(s, -0.8);
  return m;
}
// two operators that do not commute: a shear and a rotation-with-scale
const OP_A = new Matrix3().set(1, 0.85, 0, 0, 1, 0, 0, 0, 1);
const OP_B = (() => { const c = Math.cos(0.9), s = Math.sin(0.9); return new Matrix3().set(c * 1.15, -s * 1.15, 0, s * 0.7, c * 0.7, 0, 0, 0, 1.1); })();
const lerpM = (a: Matrix3, b: Matrix3, t: number) => { const m = new Matrix3(); for (let i = 0; i < 9; i++) m.elements[i] = a.elements[i] + (b.elements[i] - a.elements[i]) * t; return m; };
const I3 = new Matrix3().identity();

function textSprite(text: string, color: string, size = 46, mono = false): Sprite {
  // drawn at 3x so labels stay sharp when the camera comes close
  const k = 3; size *= k;
  const pad = 24 * k, c = document.createElement('canvas'), x = c.getContext('2d')!;
  const math = /[|⟩⟨ψ̂\[\]]/.test(text);
  const font = mono ? `500 ${size}px "Geist Mono Variable", monospace` : math ? `400 ${size}px "STIX Two Math", serif` : `italic 400 ${size}px "Bodoni Moda Variable", serif`;
  x.font = font; const w = Math.ceil(x.measureText(text).width) + pad * 2, h = Math.ceil(size * 1.6);
  c.width = w; c.height = h; x.font = font; x.fillStyle = color; x.textBaseline = 'middle'; x.fillText(text, pad, h / 2);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 16;
  const s = new Sprite(new SpriteMaterial({ map: t, transparent: true, depthWrite: false, opacity: 0 }));
  s.scale.set(w / h * 0.42, 0.42, 1);
  return s;
}

const latticeVertex = /* glsl */ `
  uniform mat3 uM; uniform float uO;
  varying float vA;
  void main() {
    vec3 p = uM * position;
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    gl_Position = projectionMatrix * mv;
    float r = length(position) / 9.;
    vA = uO * (1. - smoothstep(.7, 1.05, r)) * .8;
  }`;
const latticeFragment = 'uniform vec3 uColor; varying float vA; void main(){ gl_FragColor = vec4(uColor * vA, vA); }';

const cloudVertex = /* glsl */ `
  attribute vec4 aInfo; // x reading index, y seed, z unused
  uniform mat3 uM; uniform float uO, uDpr, uTime, uAmp[6], uCollapse;
  uniform vec3 uBrass, uEmber, uBone, uMuted;
  varying vec3 vC; varying float vA;
  void main() {
    int k = int(aInfo.x + .5);
    float amp = uAmp[k];
    vec3 p = uM * position;
    p += vec3(sin(uTime * .8 + aInfo.y * 30.), cos(uTime * .7 + aInfo.y * 21.), sin(uTime * .6 + aInfo.y * 13.)) * .06;
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp((1. + amp * 2.2) * uDpr * 16. / max(.3, -mv.z), 1., 10. * uDpr);
    vC = mix(uMuted, mix(uBrass, uEmber, amp), clamp(amp * 1.3, 0., 1.)) * (.7 + amp * 1.2);
    vA = uO * (.35 + .65 * amp);
  }`;
const cloudFragment = 'varying vec3 vC; varying float vA; void main(){ float d = length(gl_PointCoord - .5); if (d > .5) discard; float a = smoothstep(.5, .1, d) * vA; gl_FragColor = vec4(vC * a, a); }';

const fieldVertex = /* glsl */ `
  uniform float uTime, uO, uDpr; uniform vec2 uS1, uS2; uniform vec3 uBrass, uEmber, uBone;
  varying vec3 vC; varying float vA;
  void main() {
    vec2 q = position.xz;
    float r1 = length(q - uS1), r2 = length(q - uS2);
    float w = cos(r1 * 2.6 - uTime * 2.4) / (1. + r1 * .12) + cos(r2 * 2.6 - uTime * 2.4) / (1. + r2 * .12);
    float I = w * w * .25;                                      // intensity of the summed waves
    vec3 p = vec3(position.x, position.y + w * .65, position.z);
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(uDpr * (1.6 + I * 2.8) * 22. / max(.3, -mv.z), 1.2, 9. * uDpr);
    vC = mix(uBrass * .6, mix(uEmber, uBone, smoothstep(.8, 1.4, I)), clamp(I, 0., 1.)) * 1.25;
    float edge = 1. - smoothstep(6.5, 9.5, length(q));
    vA = uO * edge * (.3 + .7 * clamp(I, 0., 1.));
  }`;

export interface Space { update(time: number, P: P, cam: Vector3): void }

export async function buildSpace(scene: Scene, mobile: boolean, dpr: number): Promise<Space> {
  try { await document.fonts.load('400 40px "STIX Two Math"'); } catch { /* fallback serif */ }
  const lex = (k: string) => document.querySelector(`.film__lexicon [data-k="${k}"]`)?.textContent?.trim() ?? '';
  const root = new Group(); root.position.set(0, 0.6, 0); scene.add(root);

  // lattice: the coordinate frame of prompt space, deformable by the operator in view
  const pts: number[] = [];
  const S = 1.6, N = mobile ? 4 : 5;
  for (let i = -N; i <= N; i++) for (let j = -N; j <= N; j++) {
    if ((i + j) % 2 !== 0 && !mobile) continue;
    pts.push(-N * S, i * S, j * S, N * S, i * S, j * S);
    pts.push(i * S, -N * S, j * S, i * S, N * S, j * S);
    pts.push(i * S, j * S, -N * S, i * S, j * S, N * S);
  }
  const lg = new BufferGeometry(); lg.setAttribute('position', new BufferAttribute(new Float32Array(pts), 3));
  const latticeMat = new ShaderMaterial({ vertexShader: latticeVertex, fragmentShader: latticeFragment, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uM: { value: new Matrix3() }, uO: { value: 0 }, uColor: { value: new Color(C.brass).lerp(new Color(C.bone), 0.25).multiplyScalar(1.25) } } });
  const lattice = new LineSegments(lg, latticeMat); lattice.frustumCulled = false; root.add(lattice);
  // lattice nodes: bright engraved points at every intersection, deformed with the lines
  const nodes: number[] = [];
  for (let i = -N; i <= N; i++) for (let j = -N; j <= N; j++) for (let k = -N; k <= N; k++) if ((i + j + k) % 2 === 0 || mobile) nodes.push(i * S, j * S, k * S);
  const ng = new BufferGeometry(); ng.setAttribute('position', new BufferAttribute(new Float32Array(nodes), 3));
  const nodeMat = new ShaderMaterial({ transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uM: latticeMat.uniforms.uM, uO: { value: 0 }, uDpr: { value: dpr }, uColor: { value: new Color(C.bone) } },
    vertexShader: `uniform mat3 uM; uniform float uO, uDpr; varying float vA;
      void main(){ vec3 p = uM * position; vec4 mv = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mv;
        gl_PointSize = clamp(uDpr * 30. / max(.3, -mv.z), 1., 5. * uDpr); vA = uO * (1. - smoothstep(.7, 1.05, length(position) / 9.)); }`,
    fragmentShader: 'uniform vec3 uColor; varying float vA; void main(){ float d = length(gl_PointCoord - .5); if (d > .5) discard; gl_FragColor = vec4(uColor * vA, vA); }' });
  const latticeNodes = new Points(ng, nodeMat); latticeNodes.frustumCulled = false; root.add(latticeNodes);

  // basis rays, reading clouds, labels
  const rayMat = new LineBasicMaterial({ color: new Color(C.brass), transparent: true, opacity: 0, depthWrite: false });
  const rays = DIRS.map((d) => { const g = new BufferGeometry().setFromPoints([new Vector3(), d.clone().multiplyScalar(R)]); const l = new Line(g, rayMat); root.add(l); return l; });
  const per = mobile ? 450 : 1100, n = per * 6;
  const pos = new Float32Array(n * 3), info = new Float32Array(n * 4);
  let seed = 9; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let k = 0; k < 6; k++) for (let i = 0; i < per; i++) {
    const j = k * per + i, c = DIRS[k].clone().multiplyScalar(R);
    const g = () => Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(2 * Math.PI * rnd());
    pos.set([c.x + g() * 0.32, c.y + g() * 0.32, c.z + g() * 0.32], j * 3); info.set([k, rnd(), 0, 0], j * 4);
  }
  const cg = new BufferGeometry(); cg.setAttribute('position', new BufferAttribute(pos, 3)); cg.setAttribute('aInfo', new BufferAttribute(info, 4));
  const cloudMat = new ShaderMaterial({ vertexShader: cloudVertex, fragmentShader: cloudFragment, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uM: { value: new Matrix3() }, uO: { value: 0 }, uDpr: { value: dpr }, uTime: { value: 0 }, uAmp: { value: AMPS.slice() }, uCollapse: { value: 0 },
      uBrass: { value: new Color(C.brass) }, uEmber: { value: new Color(C.ember) }, uBone: { value: new Color(C.bone) }, uMuted: { value: new Color(C.muted) } } });
  const cloud = new Points(cg, cloudMat); cloud.frustumCulled = false; root.add(cloud);
  const labels = DIRS.map((_, k) => { const s = textSprite(lex(`reading-${k + 1}`), C.bone); root.add(s); return s; });
  const ket = textSprite('|ψ⟩', C.ember, 64); root.add(ket);

  // the state vector |ψ⟩ and two more for the commutator
  const arrow = (color: string) => {
    const g = new Group();
    const mat = new MeshBasicMaterial({ color: new Color(color).multiplyScalar(1.3), transparent: true, opacity: 0, depthWrite: false });
    const shaft = new Mesh(new CylinderGeometry(0.035, 0.035, 1, 12), mat); shaft.position.y = 0.5;
    const head = new Mesh(new ConeGeometry(0.13, 0.42, 20), mat); head.position.y = 1;
    g.add(shaft, head); root.add(g);
    return { g, shaft, head, mat };
  };
  const psi = arrow(C.ember), psiAB = arrow(C.bone), psiBA = arrow(C.holo.stops[0]);
  const up = new Vector3(0, 1, 0), q = new Quaternion();
  const place = (a: ReturnType<typeof arrow>, v: Vector3, o: number) => {
    const len = Math.max(0.001, v.length());
    a.g.quaternion.copy(q.setFromUnitVectors(up, v.clone().normalize()));
    a.shaft.scale.set(1, Math.max(0.01, len - 0.4), 1); a.shaft.position.y = (len - 0.4) / 2; a.head.position.y = len - 0.2;
    a.mat.opacity = o;
  };
  const trailMat = (color: string) => new LineBasicMaterial({ color: new Color(color), transparent: true, opacity: 0, depthWrite: false });
  const mkTrail = (color: string) => { const g = new BufferGeometry(); g.setAttribute('position', new BufferAttribute(new Float32Array(65 * 3), 3)); const l = new Line(g, trailMat(color)); l.frustumCulled = false; root.add(l); return l; };
  const trailAB = mkTrail(C.bone), trailBA = mkTrail(C.holo.stops[0]);
  const gapG = new BufferGeometry().setFromPoints([new Vector3(), new Vector3(1, 0, 0)]);
  const gapMat = new LineDashedMaterial({ color: new Color(C.ember).multiplyScalar(1.4), dashSize: 0.18, gapSize: 0.12, transparent: true, opacity: 0, depthWrite: false });
  const gap = new Line(gapG, gapMat); root.add(gap);
  const comLabel = textSprite('[Â, B̂] |ψ⟩', C.ember, 54); root.add(comLabel);
  const labelAB = textSprite('ÂB̂ |ψ⟩', C.bone, 46); root.add(labelAB);
  const labelBA = textSprite('B̂Â |ψ⟩', C.holo.stops[0], 46); root.add(labelBA);
  // projection of |ψ⟩ onto the kept reading
  const projG = new BufferGeometry().setFromPoints([new Vector3(), new Vector3(1, 0, 0)]);
  const projMat = new LineDashedMaterial({ color: new Color(C.bone), dashSize: 0.14, gapSize: 0.1, transparent: true, opacity: 0, depthWrite: false });
  const proj = new Line(projG, projMat); root.add(proj);

  // interference field: two sections as two wave sources on a plane below the flame
  const F = mobile ? 150 : 260, fpos = new Float32Array(F * F * 3);
  for (let i = 0; i < F; i++) for (let j = 0; j < F; j++) fpos.set([(i / (F - 1) - 0.5) * 19, -3.4, (j / (F - 1) - 0.5) * 19], (i * F + j) * 3);
  const fg = new BufferGeometry(); fg.setAttribute('position', new BufferAttribute(fpos, 3));
  const fieldMat = new ShaderMaterial({ vertexShader: fieldVertex, fragmentShader: cloudFragment, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uO: { value: 0 }, uDpr: { value: dpr }, uS1: { value: [-2.6, -1] }, uS2: { value: [2.6, 1] },
      uBrass: { value: new Color(C.brass) }, uEmber: { value: new Color(C.ember) }, uBone: { value: new Color(C.bone) } } });
  const field = new Points(fg, fieldMat); field.frustumCulled = false; scene.add(field);
  const srcA = textSprite('Â', C.bone, 80), srcB = textSprite('B̂', C.bone, 80); scene.add(srcA, srcB);

  const M = operatorMatrix();
  const v = new Vector3(), tmp = new Vector3();
  return {
    update(time, P, cam) {
      const show = P.space;
      // the lattice deforms under the operator in view: the "matrix" scene applies M; the commutator scene applies A·B
      const warp = ease(clamp01(P.warpOp));
      const comm = clamp01(P.comm);
      let view = lerpM(I3, M, warp);
      if (comm > 0) view = lerpM(I3, new Matrix3().multiplyMatrices(OP_A, OP_B), ease(clamp01(comm * 1.6 - 0.6)) * 0.6);
      latticeMat.uniforms.uM.value.copy(view); latticeMat.uniforms.uO.value = show * (0.5 + 0.5 * Math.max(warp, Math.min(1, comm * 2)));
      nodeMat.uniforms.uO.value = show * 0.7; latticeNodes.visible = show > 0.002;
      cloudMat.uniforms.uM.value.copy(view); cloudMat.uniforms.uTime.value = time; cloudMat.uniforms.uO.value = show * P.readings;
      root.scale.setScalar(0.35 + 0.65 * ease(clamp01(show)));
      // amplitudes: superposition, the operator's stretch, the measurement's projection
      const amps = cloudMat.uniforms.uAmp.value as number[];
      const col = ease(clamp01(P.collapse));
      for (let k = 0; k < 6; k++) {
        const stretched = DIRS[k].clone().applyMatrix3(M).length();
        let a = AMPS[k] * (1 + (stretched - 1) * 1.4 * warp);
        a = a * (1 - col) + (k === CHOSEN ? 1 : 0) * col;
        amps[k] = Math.max(0, Math.min(1, a + Math.sin(time * 1.3 + k) * 0.04 * (1 - col)));
        rays[k].visible = show > 0.01;
        tmp.copy(DIRS[k]).multiplyScalar(R + 0.75).applyMatrix3(view);
        labels[k].position.copy(tmp);
        labels[k].material.opacity = show * P.readings * (0.35 + 0.65 * amps[k]) * (k === CHOSEN ? 1 : 1 - col * 0.85);
      }
      rayMat.opacity = show * P.readings * 0.35;
      // |ψ⟩ = Σ cₖ |k⟩, drawn through the current deformation
      v.set(0, 0, 0); for (let k = 0; k < 6; k++) v.addScaledVector(DIRS[k], amps[k]);
      v.normalize().multiplyScalar(3.4).applyMatrix3(view);
      if (col > 0) v.lerp(DIRS[CHOSEN].clone().multiplyScalar(3.8), col);
      place(psi, v, show * P.arrow * (1 - comm * 0.7));
      ket.position.copy(v).multiplyScalar(1.12); ket.material.opacity = show * P.arrow * (1 - comm * 0.7);
      // projection onto the kept reading
      const kept = DIRS[CHOSEN].clone().multiplyScalar(v.dot(DIRS[CHOSEN]));
      (proj.geometry.attributes.position as BufferAttribute).setXYZ(0, v.x, v.y, v.z); (proj.geometry.attributes.position as BufferAttribute).setXYZ(1, kept.x, kept.y, kept.z);
      proj.geometry.attributes.position.needsUpdate = true; proj.computeLineDistances(); projMat.opacity = show * Math.sin(clamp01(P.collapse) * Math.PI) * 0.9;

      // commutator: the same state through A then B, and through B then A
      const base = new Vector3(0.6, 0.9, 0.4).normalize().multiplyScalar(4.2);
      const path = (first: Matrix3, second: Matrix3, t: number) => {
        const u1 = clamp01(t * 2), u2 = clamp01(t * 2 - 1);
        return base.clone().applyMatrix3(lerpM(I3, first, ease(u1))).applyMatrix3(lerpM(I3, second, ease(u2)));
      };
      const drawTrail = (line: Line, first: Matrix3, second: Matrix3) => {
        const a = line.geometry.attributes.position as BufferAttribute;
        for (let i = 0; i <= 64; i++) { const p = path(first, second, (i / 64) * comm); a.setXYZ(i, p.x, p.y, p.z); }
        a.needsUpdate = true; (line.material as LineBasicMaterial).opacity = show * Math.min(1, comm * 3) * 0.9;
      };
      drawTrail(trailAB, OP_B, OP_A); drawTrail(trailBA, OP_A, OP_B);   // ÂB̂ψ applies B̂ first
      const eAB = path(OP_B, OP_A, comm), eBA = path(OP_A, OP_B, comm);
      place(psiAB, eAB, show * Math.min(1, comm * 3)); place(psiBA, eBA, show * Math.min(1, comm * 3));
      labelAB.position.copy(eAB).multiplyScalar(1.1).add(new Vector3(-0.9, 0.3, 0)); labelBA.position.copy(eBA).multiplyScalar(1.1).add(new Vector3(0.9, 0.3, 0));
      labelAB.material.opacity = labelBA.material.opacity = show * clamp01(comm * 3 - 1.8);
      (gap.geometry.attributes.position as BufferAttribute).setXYZ(0, eAB.x, eAB.y, eAB.z); (gap.geometry.attributes.position as BufferAttribute).setXYZ(1, eBA.x, eBA.y, eBA.z);
      gap.geometry.attributes.position.needsUpdate = true; gap.computeLineDistances();
      gapMat.opacity = show * clamp01(comm * 4 - 3);
      comLabel.position.copy(eAB).add(eBA).multiplyScalar(0.5).add(new Vector3(0, -0.7, 0)); comLabel.material.opacity = gapMat.opacity;

      // interference
      fieldMat.uniforms.uTime.value = time; fieldMat.uniforms.uO.value = P.interf;
      field.visible = P.interf > 0.002;
      srcA.position.set(-2.6, -2.3, -1); srcB.position.set(2.6, -2.3, 1);
      srcA.material.opacity = srcB.material.opacity = P.interf;
      lattice.visible = cloud.visible = show > 0.002;
      void cam;
    },
  };
}
