import{g as Ze}from"./motion-HcuoLYGZ.js";import{C as bt,S as mo,W as Jt,a as Qt,O as vo,b as N,V as Re,M as pe,P as eo,B as X,c as P,d as T,A as $,e as ie,G as Te,f as Bt,D as Qe,L as po,g as It,I as ho,h as go,Q as wo,E as xo,i as to,j as yo,k as bo,l as Co,m as gt,H as Mo,n as Ao,R as So,U as Po,o as Ro,p as To,q as Fo,r as zo,s as Oo,t as ko,u as Wt,v as Lo,w as Ho,x as _o}from"./three-D1rNlBhb.js";import{P as Me,p as qt,l as Vo,S as et,s as Se,T as Eo,V as jt,a as Do,O as Ae,R as Go,r as Bo,c as Io,e as k,b as Kt,d as de,f as Wo,v as qo}from"./index-BTKWfaY6.js";import{a as oe,h as Be,e as Ut}from"./site.config-BjfUZenc.js";const oo=`varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,jo=`// The void: slow domain-warped fBm, nearly black; a faint warm falloff around the flame. No stars.
uniform float uTime;
uniform float uDensity;
uniform vec3 uHueA;
uniform vec3 uHueB;
uniform vec3 uDeep;
uniform vec3 uWarm;
uniform vec2 uOffset;
uniform vec2 uFlame;
uniform float uFlameI;
uniform float uAspect;
uniform float uExposure;
varying vec2 vUv;
#include <noise_lib>
void main() {
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0) * 2.2 + uOffset;
  float t = uTime * 0.02;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  float n = fbm(p + 2.4 * q + vec2(t * 0.5, -t));
  vec3 col = mix(uDeep, mix(uHueB, uHueA, smoothstep(0.35, 0.8, q.x)), smoothstep(0.25, 0.95, n) * uDensity * 2.0);
  vec2 d = (vUv - uFlame) * vec2(uAspect, 1.0);
  float warm = exp(-dot(d, d) * 9.0) * uFlameI;
  col += uWarm * warm * 0.05;
  gl_FragColor = vec4(col * uExposure, 1.0);
}
`,Ko=`// value noise + fBm, shared by the void and the flame (original, generic)
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    a *= 0.5;
  }
  return v;
}
`;mo.noise_lib=Ko;const R=t=>new bt(t),i=oe.scene,Z=oe.motion;function we(t){let e=t>>>0;return()=>{e=e+1831565813>>>0;let o=e;return o=Math.imul(o^o>>>15,o|1),o^=o+Math.imul(o^o>>>7,o|61),((o^o>>>14)>>>0)/4294967296}}function Xe(t){const e=Math.max(t(),1e-9);return Math.sqrt(-2*Math.log(e))*Math.cos(2*Math.PI*t())}const He=(t,e,o,n)=>t+(e-t)*(1-Math.exp(-o*n));class Uo{target=new Jt(4,4);material;scene=new Qt;camera=new vo(-1,1,1,-1,0,1);scale=i["void-resolution"];constructor(){this.material=new N({vertexShader:oo,fragmentShader:jo,depthTest:!1,depthWrite:!1,uniforms:{uTime:{value:0},uDensity:{value:i["void-density"]},uHueA:{value:R(i["void-hue-a"])},uHueB:{value:R(i["void-hue-b"])},uDeep:{value:R(i["void-deep"])},uWarm:{value:R(i["flame-color"])},uOffset:{value:new Re},uFlame:{value:new Re(.5,.5)},uFlameI:{value:1},uAspect:{value:1},uExposure:{value:1}}}),this.scene.add(new pe(new eo(2,2),this.material))}setSize(e,o){this.target.setSize(Math.max(2,Math.round(e*this.scale)),Math.max(2,Math.round(o*this.scale))),this.material.uniforms.uAspect.value=e/Math.max(o,1)}render(e,o){this.material.uniforms.uTime.value=o,e.setRenderTarget(this.target),e.render(this.scene,this.camera),e.setRenderTarget(null)}dispose(){this.target.dispose(),this.material.dispose()}}const No=`// The cloud of readings: every point belongs to a cluster (0..6) or the haze (-1). Each operator light
// acts on the CURRENT weights (uW), so the composition is order-dependent by construction.
attribute float aCluster;
attribute float aJit;
attribute float aPhase;
uniform float uTime;
uniform float uDrift;
uniform float uBreathe;
uniform float uSpread;
uniform float uSize;
uniform float uPixelRatio;
uniform float uCloudLit;
uniform float uW[7];
uniform vec3 uC[7];
uniform float uAmp;
uniform float uSup;
uniform float uMix;
uniform float uCol;
uniform float uAmpT;
uniform float uMixA;
uniform float uMixB;
uniform vec3 uLand;
uniform float uLandOn;
uniform float uGather;
uniform float uPush;
uniform float uViewH;
uniform float uOrder;
uniform float uTighten;
uniform float uConv;
uniform vec3 uFire;
uniform float uField;
uniform float uFR;
uniform float uCalm;
varying float vLit;
varying float vAmp;
varying float vSup;
varying float vMix;
varying float vCol;
varying float vAlpha;
void main() {
  bool has = aCluster > -0.5;
  int ci = has ? int(aCluster + 0.5) : 0;
  vec3 p = position * uSpread;
  vec3 c = has ? uC[ci] * uSpread : vec3(0.0);
  float w = has ? uW[ci] : 1.0 / 7.0;
  p += vec3(sin(uTime * 0.31 + aPhase), cos(uTime * 0.23 + aPhase * 1.3), sin(uTime * 0.17 + aPhase * 0.7)) * uDrift * 8.0;
  p += (has ? (p - c) : vec3(0.0)) * sin(uTime * 0.45 + aPhase * 0.15) * uBreathe * 0.08;

  // order: readings gather toward their cluster (structure appears, nothing is discarded yet)
  if (has) p = mix(p, c + (p - c) * (1.0 - uTighten), uOrder);

  float isT = (has && ci == int(uAmpT + 0.5)) ? 1.0 : 0.0;
  p = mix(p, c + (p - c) * uGather, isT * uAmp);

  float mean = 1.0 / 7.0;
  float below = has ? step(w, mean - 1e-4) : 1.0;
  p = mix(p, p * uPush, below * uSup);

  int ma = int(uMixA + 0.5);
  int mb = int(uMixB + 0.5);
  float isM = (has && (ci == ma || ci == mb)) ? 1.0 : 0.0;
  vec3 mid = (uC[ma] + uC[mb]) * 0.5 * uSpread;
  p = mix(p, mid + (p - c) * 0.75, isM * uMix * 0.55);
  vec3 axis = normalize(uC[mb] - uC[ma] + vec3(1e-4));
  float fringe = 0.5 + 0.5 * sin(dot(p, axis) * 9.0 - uTime * 2.2);

  float surv = (has && w > 0.01) ? 1.0 : 0.0;
  float stream = smoothstep(0.0, 1.0, uCol * 1.2 - aJit * 0.2);
  p = mix(p, uLand + (p - uLand) * 0.04, stream * surv * uLandOn);

  float lit = has ? uCloudLit * (0.4 + aJit * 1.2) + (w * 7.0 - 1.0) * 0.3 : uCloudLit * aJit * 0.5;
  lit += isT * uAmp * 0.8 + (has ? uOrder * 0.15 : 0.0);
  vLit = clamp(lit, 0.0, 1.0);
  vAmp = isT * uAmp;
  vSup = below * uSup;
  vMix = isM * uMix * fringe;
  vCol = stream * surv * uLandOn;
  vAlpha = (1.0 - below * uSup * 0.75) * (1.0 - (1.0 - surv) * uCol * uLandOn * 0.85) * (1.0 - stream * surv * uLandOn * 0.92);

  // the field's reveal (hero) masks the readings too; the closing folds them into the flame
  float R = uField * uFR * 1.35;
  vAlpha *= 1.0 - smoothstep(R - 9.0, R, length(p.xz));
  vAlpha *= 1.0 - 0.55 * uCalm;
  float k = smoothstep(0.0, 1.0, uConv * 1.3 - aJit * 0.3);
  vec3 dF = p - uFire;
  float ang = k * 2.6;
  p = uFire + vec3(cos(ang) * dF.x - sin(ang) * dF.z, dF.y, sin(ang) * dF.x + cos(ang) * dF.z) * (1.0 - k);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = min(uSize * uPixelRatio * (uViewH / 900.0) * (24.0 / -mv.z) * (0.55 + vLit * 0.9), 9.0 * uPixelRatio);
}
`,Yo=`uniform vec3 uReading;
uniform vec3 uReadingLit;
uniform vec3 uOpAmp;
uniform vec3 uOpSup;
uniform vec3 uOpMix;
uniform vec3 uOpCol;
varying float vLit;
varying float vAmp;
varying float vSup;
varying float vMix;
varying float vCol;
varying float vAlpha;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d) * 4.0;
  if (r > 1.0) discard;
  float soft = pow(1.0 - r, 1.6);
  vec3 col = mix(uReading, uReadingLit, vLit);
  col = mix(col, uOpAmp, vAmp * 0.55);
  col = mix(col, uOpSup, vSup * 0.45);
  col += uOpMix * vMix * 0.6;
  col = mix(col, uOpCol * 1.6, vCol);
  float a = soft * (0.18 + vLit * 0.7 + vCol * 0.6) * vAlpha;
  gl_FragColor = vec4(col * a, a);
}
`;function Zo(){const t=i["cloud-count"],e=i["cloud-radius"],o=i.clusters,n=we(2654435769),r=new Float32Array(t*3),l=new Float32Array(t),c=new Float32Array(t),m=new Float32Array(t),u=Math.round(t*i["haze-fraction"]),s=i["cluster-spread"],M=i.world["cloud-center"];for(let a=0;a<t;a++){let v,g,x;if(a<u){const d=n()*Math.PI*2,p=e*Math.sqrt(n());v=M[0]+Math.cos(d)*p,g=.4+Math.abs(Xe(n))*1.6,x=M[2]+Math.sin(d)*p*.8,l[a]=-1}else{const d=o[a%o.length];v=d.pos[0]+Xe(n)*s,g=d.pos[1]+Xe(n)*s*.7,x=d.pos[2]+Xe(n)*s,l[a]=d.id}r[a*3]=v,r[a*3+1]=g,r[a*3+2]=x,c[a]=n(),m[a]=n()*Math.PI*2}const h=new X;h.setAttribute("position",new P(r,3)),h.setAttribute("aCluster",new P(l,1)),h.setAttribute("aJit",new P(c,1)),h.setAttribute("aPhase",new P(m,1));const f=new N({vertexShader:No,fragmentShader:Yo,transparent:!0,depthWrite:!1,blending:$,uniforms:{uTime:{value:0},uDrift:{value:Z["cloud-drift"]},uBreathe:{value:Z["cloud-breathe"]},uSpread:{value:1},uSize:{value:i["reading-size"]},uPixelRatio:{value:1},uViewH:{value:900},uCloudLit:{value:.2},uW:{value:[...oe.composer.w0]},uC:{value:o.map(a=>new T(...a.pos))},uAmp:{value:0},uSup:{value:0},uMix:{value:0},uCol:{value:0},uAmpT:{value:oe.composer.amplify.target},uMixA:{value:1},uMixB:{value:oe.composer.mix.partner},uLand:{value:new T},uLandOn:{value:0},uGather:{value:i["amplify-gather"]},uOrder:{value:0},uTighten:{value:i["order-tighten"]},uPush:{value:i["suppress-push"]},uConv:{value:0},uFire:{value:new T(0,i["brazier-height"]+i["flame-height"]*.5,0)},uField:{value:1},uFR:{value:i.world["field-radius"]},uCalm:{value:0},uReading:{value:R(i["reading-color"])},uReadingLit:{value:R(i["reading-lit-color"])},uOpAmp:{value:R(i["operator-light-amplify"])},uOpSup:{value:R(i["operator-light-suppress"])},uOpMix:{value:R(i["operator-light-mix"])},uOpCol:{value:R(i["operator-light-collapse"])}}}),b=new Uint32Array(t);for(let a=0;a<t;a++)b[a]=a;for(let a=t-1;a>0;a--){const v=Math.floor(n()*(a+1));[b[a],b[v]]=[b[v],b[a]]}h.setIndex(new P(b,1));const y=new ie(h,f);return y.frustumCulled=!1,{points:y,material:f,setFraction(a){h.setDrawRange(0,Math.round(t*a))},update(a,v,g,x){const d=f.uniforms;d.uTime.value=a,d.uPixelRatio.value=g,d.uViewH.value=x,d.uCloudLit.value=v.cloudLit,d.uSpread.value=v.cloudSpread;const p=d.uW.value;p[0]=v.w0,p[1]=v.w1,p[2]=v.w2,p[3]=v.w3,p[4]=v.w4,p[5]=v.w5,p[6]=v.w6,d.uOrder.value=v.order,d.uAmp.value=v.amplify,d.uSup.value=v.suppress,d.uMix.value=v.mix,d.uCol.value=v.collapse,d.uAmpT.value=v.amplifyTarget,d.uMixA.value=v.mixA,d.uMixB.value=v.mixB,d.uLand.value.set(v.landX,v.landY,v.landZ),d.uLandOn.value=v.landOn,d.uConv.value=v.converge,d.uField.value=v.field,d.uCalm.value=v.calm},dispose(){h.dispose(),f.dispose()}}}function Xo(){const t=i["brazier-radius"],e=i["brazier-height"],o=new Te,n=new Bt({color:R(i["brazier-iron"]),roughness:.78,metalness:.55,emissive:R(i["brazier-iron-lit"]),emissiveIntensity:.05,side:Qe}),r=[[.04,.6],[.3,.615],[.58,.68],[.8,.8],[.95,.94],[1,1],[.97,1.02],[.93,.99]],l=new pe(new po(r.map(([y,a])=>new Re(y*t,a*e)),64),n),c=new pe(new It(t*.05,t*.08,e*.6,16),n);c.position.y=e*.3;const m=new It(t*.03,t*.045,t*.75,8);for(let y=0;y<3;y++){const a=y/3*Math.PI*2,v=new pe(m,n);v.position.set(Math.cos(a)*t*.28,t*.12,Math.sin(a)*t*.28),v.rotation.set(Math.sin(a)*1.15,0,-Math.cos(a)*1.15),o.add(v)}o.add(l,c);const u=new Bt({color:R(i["coal-color"]),emissive:R(i["coal-color"]),emissiveIntensity:1,roughness:.9,metalness:0}),s=i["coal-count"],M=new ho(new go(t*.075,0),u,s),h=we(7),f=new to,b=new wo;for(let y=0;y<s;y++){const a=Math.sqrt(h())*t*.78,v=h()*Math.PI*2,g=e*(.66+a/t*.2)+h()*e*.06;b.setFromEuler(new xo(h()*3,h()*3,h()*3));const x=.6+h()*.8;f.compose(new T(Math.cos(v)*a,g,Math.sin(v)*a),b,new T(x,x*.7,x)),M.setMatrixAt(y,f)}return o.add(M),{group:o,update(y,a,v=0){const g=Math.min(2,Math.max(0,v));u.emissiveIntensity=.5+a*(.9+.15*Math.sin(y*1.7))+g*.25,n.emissiveIntensity=.02+a*.06+g*.16},dispose(){n.dispose(),u.dispose(),l.geometry.dispose(),c.geometry.dispose(),m.dispose(),M.geometry.dispose()}}}const $o=`
varying vec3 vLocal;
void main() {
  vLocal = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,Jo=`
uniform float uTime;
uniform float uIntensity;
uniform float uFlare;
uniform float uFlicker;
uniform float uSteps;
uniform vec3 uCam;
uniform vec3 uHalf;
uniform vec3 uFlame;
uniform vec3 uCore;
uniform vec3 uDeep;
varying vec3 vLocal;
#include <noise_lib>
// cheap 3D value noise from two orthogonal 2D slices (rising with time)
float n3(vec3 p) {
  return 0.5 * vnoise(p.xy + vec2(p.z * 0.71, 0.0)) + 0.5 * vnoise(p.zy + vec2(p.x * 0.63 + 17.3, 0.0));
}
float density(vec3 p, out float heat) {
  float H = uHalf.y * 2.0;
  float y = clamp(p.y / H, 0.0, 1.0);
  vec3 q = p / uHalf.x;
  float t = uTime;
  // the draught: the column sways and twists higher up
  float sway = (n3(vec3(0.0, y * 1.6 - t * 0.7, 3.1)) - 0.5) * 0.55 * y * (0.8 + uFlicker * 2.0);
  q.x += sway;
  q.z += (n3(vec3(5.0, y * 1.3 - t * 0.6, 0.0)) - 0.5) * 0.4 * y;
  float r = length(q.xz);
  float width = mix(0.78, 0.06, pow(y, 0.7)) * (1.0 + uFlare * 0.25);
  // two octaves of rising noise tear the outline into tongues
  float n1 = n3(vec3(q.x * 2.2, y * 3.2 - t * 2.1, q.z * 2.2));
  float n2 = n3(vec3(q.x * 5.0 + 3.0, y * 7.0 - t * 3.6, q.z * 5.0));
  float f = (width - r) / width - y * 0.55 + (n1 - 0.5) * 1.15 * (0.25 + y) + (n2 - 0.5) * 0.45 * y + 0.12;
  float d = smoothstep(0.0, 0.35, f) * smoothstep(0.0, 0.05, y);
  heat = clamp(f * 1.6 - y * 0.35, 0.0, 1.0);
  return d;
}
void main() {
  vec3 ro = uCam;
  vec3 rd = normalize(vLocal - uCam);
  // ray / box [−hx, hx] × [0, 2hy] × [−hz, hz]
  vec3 bmin = vec3(-uHalf.x, 0.0, -uHalf.z);
  vec3 bmax = vec3(uHalf.x, uHalf.y * 2.0, uHalf.z);
  vec3 inv = 1.0 / rd;
  vec3 t0 = (bmin - ro) * inv;
  vec3 t1 = (bmax - ro) * inv;
  vec3 tmin = min(t0, t1);
  vec3 tmax = max(t0, t1);
  float tn = max(max(max(tmin.x, tmin.y), tmin.z), 0.0);
  float tf = min(min(tmax.x, tmax.y), tmax.z);
  if (tf <= tn) discard;
  // fewer slices when the fire fills the frame (close-ups, the dive): the cost stays per screen, not per slice
  const int N = 24;
  float dt = (tf - tn) / uSteps;
  // jitter the start per pixel: no banding between slices
  float j = hash12(gl_FragCoord.xy + fract(uTime) * 61.0);
  vec3 col = vec3(0.0);
  float trans = 1.0;
  for (int i = 0; i < N; i++) {
    if (float(i) >= uSteps) break;
    vec3 p = ro + rd * (tn + (float(i) + j) * dt);
    float heat;
    float d = density(p, heat);
    if (d > 0.002) {
      vec3 c = mix(uDeep, uFlame, smoothstep(0.0, 0.35, heat));
      c = mix(c, uCore, smoothstep(0.45, 0.95, heat));
      float a = d * dt * 3.2;
      col += c * a * trans;
      trans *= 1.0 - min(a * 0.35, 0.9);
    }
  }
  col *= uIntensity;
  gl_FragColor = vec4(col, 1.0);
}`;function Qo(){const t=i["flame-height"]*1.55,e=i["flame-height"]*.62,o=i["brazier-height"]*.78,n=new Te,r=new yo(e*2,t,e*2);r.translate(0,t/2,0);const l=new N({vertexShader:$o,fragmentShader:Jo,transparent:!0,depthWrite:!1,blending:$,side:bo,uniforms:{uTime:{value:0},uIntensity:{value:1},uFlare:{value:0},uFlicker:{value:Z["flame-flicker"]},uSteps:{value:24},uCam:{value:new T},uHalf:{value:new T(e,t/2,e)},uFlame:{value:R(i["flame-color"])},uCore:{value:R(i["flame-core-color"])},uDeep:{value:R(i["coal-color"])}}}),c=new pe(r,l);c.renderOrder=2,c.frustumCulled=!1,n.position.y=o,n.add(c);const m=new T,u=new T;return{group:n,centerY:o+t*.32,update(s,M,h,f=0){const b=1+Math.sin(s*13.1)*.04*Z["flame-flicker"]*4+Math.sin(s*7.3)*.03+Math.sin(s*2.1+Math.sin(s*.7)*2)*.05,y=.86+.1*Math.min(1.6,M)+f*.3+Math.sin(s*1.3)*.05;n.scale.set(1+f*.15,y,1+f*.15),n.updateMatrixWorld(),m.copy(h.position),c.worldToLocal(m),l.uniforms.uCam.value.copy(m);const a=h.position.distanceTo(c.getWorldPosition(u));return l.uniforms.uSteps.value=a<2.5?6:a<5?12:24,l.uniforms.uTime.value=s,l.uniforms.uFlare.value=f,l.uniforms.uIntensity.value=Math.min(2.2,M*b)*1.15,b},dispose(){r.dispose(),l.dispose()}}}const ea=`varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,ta=`// An operator light: a soft beam from the flame to a cluster, in the operator's colour. Additive.
uniform vec3 uColor;
uniform float uStrength;
uniform float uTime;
varying vec2 vUv;
void main() {
  float across = 1.0 - abs(vUv.y - 0.5) * 2.0;
  float along = pow(1.0 - vUv.x, 0.6) * smoothstep(0.0, 0.08, vUv.x);
  float ripple = 0.85 + 0.15 * sin(vUv.x * 18.0 - uTime * 3.0);
  float a = pow(across, 2.2) * along * ripple * uStrength * 0.42;
  gl_FragColor = vec4(uColor * a, a);
}
`,Nt=5,oa=14;function aa(){const t=new Te,e=new eo(1,1);e.translate(.5,0,0);const o=f=>{const b=new N({vertexShader:ea,fragmentShader:ta,transparent:!0,depthWrite:!1,blending:$,side:Qe,uniforms:{uColor:{value:R(f)},uStrength:{value:0},uTime:{value:0}}}),y=new pe(e,b);return y.matrixAutoUpdate=!1,y.frustumCulled=!1,y.renderOrder=1,t.add(y),{mesh:y,mat:b}},n=o(i["operator-light-amplify"]),r=o(i["operator-light-mix"]),l=o(i["operator-light-mix"]),c=new T,m=new T,u=new T,s=new T,M=new to;function h(f,b,y,a,v,g,x){c.subVectors(y,b);const d=Math.min(1,Math.max(0,m.subVectors(g.position,b).dot(c)/Math.max(c.lengthSq(),1e-6))),p=g.position.distanceTo(u.copy(b).addScaledVector(c,d));if(a*=Math.min(1,Math.max(0,(p-Nt)/(oa-Nt))),f.mat.uniforms.uStrength.value=a,f.mat.uniforms.uTime.value=x,f.mesh.visible=a>.002,!f.mesh.visible)return;c.subVectors(y,b);const V=c.length();c.normalize(),s.subVectors(g.position,b).normalize(),m.crossVectors(s,c).normalize(),u.crossVectors(c,m),M.makeBasis(c.clone().multiplyScalar(V),m.clone().multiplyScalar(v),u),M.setPosition(b),f.mesh.matrix.copy(M),f.mesh.matrixWorldNeedsUpdate=!0}return{group:t,update(f){h(n,f.flame,f.ampTarget,f.amp,.9,f.camera,f.time),h(r,f.flame,f.mixA,f.mix,.7,f.camera,f.time),h(l,f.flame,f.mixB,f.mix,.7,f.camera,f.time)},dispose(){e.dispose(),[n,r,l].forEach(f=>f.mat.dispose())}}}const Yt=`attribute float aA; uniform float uSize; uniform float uPixelRatio; varying float vA;
void main(){ vA = aA; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * mv;
gl_PointSize = min(uSize * uPixelRatio * (6.0 / max(-mv.z, 0.1)) * 2.5, 40.0 * uPixelRatio); }`,ia=`uniform vec3 uColor; uniform vec3 uHot; uniform float uPhase; uniform float uOn; varying float vA;
void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0; if (r > 1.0) discard;
float lit = clamp(uPhase - vA, 0.0, 1.0); float now = lit * (1.0 - clamp(uPhase - vA - 1.0, 0.0, 1.0));
float core = exp(-r * r * 14.0); float ring = smoothstep(0.62, 0.7, r) * (1.0 - smoothstep(0.78, 0.86, r));
float a = (core * (0.18 + 0.82 * lit) + ring * (0.25 + 0.5 * now)) * uOn;
gl_FragColor = vec4(mix(uColor, uHot, now) * a, a); }`,na=`uniform vec3 uColor; uniform vec3 uHot; uniform float uDraw; uniform float uTime; varying float vA;
void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0; if (r > 1.0) discard;
if (vA > uDraw) discard;
float head = fract(uTime * 0.35); float dist = abs(vA - head); dist = min(dist, 1.0 - dist);
float hot = exp(-dist * dist * 900.0) * step(0.999, uDraw);
float a = exp(-r * r * 9.0) * (0.55 + 0.9 * hot);
gl_FragColor = vec4(mix(uColor, uHot, hot) * a, a); }`,ra=`uniform vec3 uColor; uniform vec3 uHot; uniform float uLift; uniform float uTime; varying float vA;
varying float vF; void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0; if (r > 1.0) discard;
float a = exp(-r * r * 10.0) * uLift * (1.0 - vF) * smoothstep(0.0, 0.08, vF);
gl_FragColor = vec4(mix(uHot, uColor, vF) * a, a); }`,la=`attribute float aA; attribute float aSpeed; uniform float uSize; uniform float uPixelRatio;
uniform float uTime; uniform float uRise; varying float vA; varying float vF;
void main(){ vA = aA; float f = fract(aA + uTime * aSpeed); vF = f;
vec3 p = position; p.y += f * uRise; p.x += sin(uTime * 1.3 + aA * 40.0) * 0.06 * f; p.z += cos(uTime * 1.1 + aA * 31.0) * 0.06 * f;
vec4 mv = modelViewMatrix * vec4(p,1.0); gl_Position = projectionMatrix * mv;
gl_PointSize = min(uSize * uPixelRatio * (1.0 - f * 0.6) * (6.0 / max(-mv.z, 0.1)) * 2.5, 40.0 * uPixelRatio); }`,ua=`attribute float aA; attribute float aH; uniform float uSize; uniform float uPixelRatio;
varying float vA; varying float vH; void main(){ vA = aA; vH = aH; vec4 mv = modelViewMatrix * vec4(position,1.0);
gl_Position = projectionMatrix * mv; gl_PointSize = min(uSize * uPixelRatio * (6.0 / max(-mv.z, 0.1)) * 2.5, 40.0 * uPixelRatio); }`,sa=`uniform vec3 uColor; uniform vec3 uHot; uniform float uPhase; uniform float uOn; uniform float uTime;
varying float vA; varying float vH; void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0; if (r > 1.0) discard;
float lit = clamp(uPhase - vA, 0.0, 1.0); float now = lit * (1.0 - clamp(uPhase - vA - 1.0, 0.0, 1.0));
float flow = 0.5 + 0.5 * sin(vH * 30.0 - uTime * 4.0);
float a = exp(-r * r * 6.0) * (0.3 + 0.6 * lit + 0.8 * now * flow) * (0.35 + 0.65 * vH) * uOn;
gl_FragColor = vec4(mix(uColor, uHot, now * vH) * a, a); }`;function $e(t,e,o){return new N({vertexShader:t,fragmentShader:e,transparent:!0,depthWrite:!1,blending:$,uniforms:{uPixelRatio:{value:1},...o}})}function ca(){const t=R(i["flame-color"]),e=R(i["flame-core-color"]),o=new X,n=new Float32Array(Me*3),r=new Float32Array(Me);for(let A=0;A<Me;A++)n.set(qt(A),A*3),r[A]=A;o.setAttribute("position",new P(n,3)),o.setAttribute("aA",new P(r,1));const l=$e(Yt,ia,{uColor:{value:t},uHot:{value:e},uPhase:{value:0},uOn:{value:0},uSize:{value:8}}),c=new ie(o,l),m=70,u=new X,s=new Float32Array(Me*m*3),M=new Float32Array(Me*m),h=new Float32Array(Me*m);for(let A=0;A<Me;A++){const F=qt(A);for(let w=0;w<m;w++){const O=w/(m-1);s.set([F[0],F[1]*O,F[2]],(A*m+w)*3),M[A*m+w]=A,h[A*m+w]=O}}u.setAttribute("position",new P(s,3)),u.setAttribute("aA",new P(M,1)),u.setAttribute("aH",new P(h,1));const f=$e(ua,sa,{uColor:{value:t},uHot:{value:e},uPhase:{value:0},uOn:{value:0},uSize:{value:2.2},uTime:{value:0}}),b=new ie(u,f),y=160,a=new X,v=new Float32Array(y*3),g=new Float32Array(y);for(let A=0;A<y;A++){const F=A/(y-1);v.set(Vo(F),A*3),g[A]=F}a.setAttribute("position",new P(v,3)),a.setAttribute("aA",new P(g,1));const x=$e(Yt,na,{uColor:{value:t},uHot:{value:e},uDraw:{value:0},uTime:{value:0},uSize:{value:3.4}}),d=new ie(a,x),p=140,V=i["brazier-radius"],j=i["brazier-height"],K=we(11),H=new X,te=new Float32Array(p*3),G=new Float32Array(p),U=new Float32Array(p);for(let A=0;A<p;A++){const F=Math.sqrt(K())*V*.7,w=K()*Math.PI*2;te.set([Math.cos(w)*F,j*.75,Math.sin(w)*F],A*3),G[A]=K(),U[A]=.12+K()*.22}H.setAttribute("position",new P(te,3)),H.setAttribute("aA",new P(G,1)),H.setAttribute("aSpeed",new P(U,1));const B=$e(la,ra,{uColor:{value:t},uHot:{value:e},uLift:{value:0},uTime:{value:0},uRise:{value:2.6},uSize:{value:.7}}),J=new ie(H,B),Q=[c,d,J,b];return Q.forEach((A,F)=>{A.frustumCulled=!1,A.renderOrder=2+F}),{objects:Q,setPixelRatio(A){for(const F of[l,x,B,f])F.uniforms.uPixelRatio.value=A},update(A,F){l.uniforms.uPhase.value=F.phase,l.uniforms.uOn.value=Math.min(1,F.phase*4),c.visible=F.phase>.001,f.uniforms.uPhase.value=F.phase,f.uniforms.uOn.value=Math.min(1,F.phase*4),f.uniforms.uTime.value=A,b.visible=c.visible,x.uniforms.uDraw.value=F.loopback,x.uniforms.uTime.value=A,d.visible=F.loopback>.001,B.uniforms.uLift.value=F.lift,B.uniforms.uTime.value=A,J.visible=F.lift>.001},dispose(){for(const A of[o,a,H,u])A.dispose();for(const A of[l,x,B,f])A.dispose()}}}const fa=`attribute float aSeed; uniform float uSize; uniform float uPixelRatio; uniform float uTime;
uniform float uDrift; uniform vec3 uFlame; uniform vec3 uCam; uniform float uBox; varying float vNear; varying float vHeat; varying float vSeed;
void main(){ vec3 p = position;
  p.x += sin(uTime * uDrift * 3.1 + aSeed * 17.0) * 0.6;
  p.y += mod(uTime * uDrift * (0.4 + aSeed) + aSeed * 9.0, 6.0) - 3.0;
  p.z += cos(uTime * uDrift * 2.3 + aSeed * 11.0) * 0.6;
  // the motes travel with the camera (a box around it, wrapped), so every shot of the field has a foreground
  vec3 B = vec3(uBox, uBox * 0.5, uBox);
  p = uCam + mod(p - uCam + B * 0.5, B) - B * 0.5;
  vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
  float d = max(-mv.z, 0.05); vNear = clamp(1.6 / d, 0.0, 1.0); vSeed = aSeed;
  vHeat = clamp(1.0 - distance(p, uFlame) / 9.0, 0.0, 1.0) * 0.8 + 0.2;
  // bokeh is fill-rate: cap the disc, and skip motes that would brush the lens
  gl_PointSize = d < 3.0 ? 0.0 : min(uSize * uPixelRatio * (6.0 / d) * 2.5, 28.0 * uPixelRatio); }`,ma=`uniform vec3 uAsh; uniform vec3 uEmber; uniform float uOpacity; varying float vNear; varying float vHeat;
varying float vSeed; void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0; if (r > 1.0) discard;
  // near = a soft bokeh disc with a faint rim; far = a small bright speck
  float disc = smoothstep(1.0, 0.75, r) * (0.55 + 0.45 * smoothstep(0.55, 0.92, r));
  float speck = exp(-r * r * 8.0);
  float a = mix(speck, disc * 0.45, vNear) * uOpacity * (0.25 + 0.75 * vHeat) * (0.6 + 0.4 * vSeed);
  vec3 c = mix(uAsh, uEmber, vHeat);
  gl_FragColor = vec4(c * a, a); }`;function va(){const t=i.motes,e=we(23),o=new Float32Array(t.count*3),n=new Float32Array(t.count);for(let m=0;m<t.count;m++)o.set([(e()-.5)*t.radius*2,(e()-.5)*t.radius,(e()-.5)*t.radius*2],m*3),n[m]=e();const r=new X;r.setAttribute("position",new P(o,3)),r.setAttribute("aSeed",new P(n,1));const l=new N({vertexShader:fa,fragmentShader:ma,transparent:!0,depthWrite:!1,blending:$,uniforms:{uSize:{value:t.size},uPixelRatio:{value:1},uTime:{value:0},uDrift:{value:t.drift},uOpacity:{value:t.opacity},uCam:{value:new T},uBox:{value:t.radius*2},uFlame:{value:[0,i["brazier-height"]+i["flame-height"]/2,0]},uAsh:{value:R(i["reading-lit-color"])},uEmber:{value:R(i["flame-color"])}}}),c=new ie(r,l);return c.frustumCulled=!1,c.renderOrder=6,{points:c,setPixelRatio(m){l.uniforms.uPixelRatio.value=m},setFraction(m){r.setDrawRange(0,Math.max(0,Math.round(t.count*m)))},update(m,u,s){l.uniforms.uTime.value=m,l.uniforms.uCam.value.copy(s),l.uniforms.uOpacity.value=t.opacity*(.5+.5*Math.min(1.2,u))},dispose(){r.dispose(),l.dispose()}}}const Ge=oe.scene.embers,da=`
attribute vec4 aSeed;
uniform float uTime;
uniform float uRate;
uniform float uRise;
uniform float uSpread;
uniform float uSize;
uniform float uPixelRatio;
uniform float uFlame;
uniform float uBurst;
uniform vec3 uBase;
uniform vec3 uPull;
uniform float uPullK;
varying float vLife;
varying float vHeat;
varying float vA;
void main() {
  float life = fract(uTime * uRate * (0.6 + aSeed.w * 0.8) + aSeed.x);
  float a = aSeed.y * 6.2831853;
  vec2 out2 = vec2(cos(a), sin(a));
  // the draught: up fast at first, then the spark tires and drifts out over the field
  float up = uRise * (1.0 - pow(1.0 - min(life * 1.6, 1.0), 2.0)) * (0.55 + aSeed.z * 0.9);
  float fall = smoothstep(0.55, 1.0, life) * uRise * 0.55;
  float reach = pow(life, 1.4) * uSpread * (0.4 + aSeed.z);
  vec3 p = uBase + vec3(out2.x * reach, up - fall, out2.y * reach - reach * 0.35);
  // bent toward what the operator acts on
  vec3 toPull = uPull - uBase;
  p += toPull * uPullK * smoothstep(0.08, 0.9, life) * (0.35 + 0.65 * aSeed.w);
  // turbulence
  p.x += sin(uTime * 2.3 + aSeed.x * 40.0 + life * 9.0) * 0.35 * life;
  p.z += cos(uTime * 1.9 + aSeed.y * 31.0 + life * 7.0) * 0.35 * life;
  p.y = max(p.y, 0.04);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float d = max(-mv.z, 0.2);
  vLife = life;
  vHeat = 1.0 - smoothstep(0.0, 0.75, life);
  float on = clamp(uFlame, 0.0, 1.6) * (0.55 + uBurst * 1.2);
  vA = on * smoothstep(0.0, 0.04, life) * (1.0 - smoothstep(0.82, 1.0, life));
  gl_PointSize = clamp(uSize * uPixelRatio * (10.0 / d) * (0.6 + vHeat * 0.9) * (1.0 + uBurst * 0.5), 1.0, 9.0 * uPixelRatio);
}`,pa=`
uniform vec3 uHot;
uniform vec3 uEmber;
uniform vec3 uAsh;
varying float vLife;
varying float vHeat;
varying float vA;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d) * 4.0;
  if (r > 1.0) discard;
  float core = exp(-r * 5.0);
  vec3 c = mix(uAsh, uEmber, smoothstep(0.0, 0.45, vHeat));
  c = mix(c, uHot, smoothstep(0.55, 1.0, vHeat));
  float a = core * vA * (0.35 + vHeat);
  gl_FragColor = vec4(c * a * 1.6, a);
}`;function ha(){const t=Ge.count,e=we(932837),o=new Float32Array(t*4);for(let u=0;u<t*4;u++)o[u]=e();const n=new X;n.setAttribute("position",new P(new Float32Array(t*3),3)),n.setAttribute("aSeed",new P(o,4));const r=new T(0,i["brazier-height"]*.95,0),l=new N({vertexShader:da,fragmentShader:pa,transparent:!0,depthWrite:!1,blending:$,uniforms:{uTime:{value:0},uRate:{value:Ge.rate},uRise:{value:Ge.rise},uSpread:{value:Ge.spread},uSize:{value:Ge.size},uPixelRatio:{value:1},uFlame:{value:1},uBurst:{value:0},uBase:{value:r},uPull:{value:new T},uPullK:{value:0},uHot:{value:R(i["flame-core-color"])},uEmber:{value:R(i["flame-color"])},uAsh:{value:R(i["coal-color"])}}}),c=new ie(n,l);c.frustumCulled=!1,c.renderOrder=4;const m=l.uniforms;return{points:c,setPixelRatio(u){m.uPixelRatio.value=u},setFraction(u){n.setDrawRange(0,Math.round(t*u))},update(u,s,M,h,f){m.uTime.value=u,m.uFlame.value=s,m.uBurst.value=M,h&&m.uPull.value.copy(h),m.uPullK.value=h?f:0},dispose(){n.dispose(),l.dispose()}}}const Pe=et.length,ga=`
attribute vec2 aCorner;
attribute vec3 aCenter;
attribute vec2 aSize;
attribute float aShape;
attribute float aDim;
uniform float uK[${Pe}];
uniform float uTilt;
varying vec2 vP;
varying vec2 vSize;
varying float vK;
varying float vDim;
void main() {
  float k = uK[int(aShape + 0.5)];
  float e = 1.0 - pow(1.0 - clamp(k, 0.0, 1.0), 3.0);
  float lift = -0.5 + e * (0.95 - 0.2 * aDim);
  vec3 p = aCenter + vec3(-aCorner.x * aSize.x, lift, 0.0)
    + vec3(0.0, sin(uTilt), cos(uTilt)) * ((aCorner.y + 0.5) * aSize.y);
  vP = aCorner * aSize;
  vSize = aSize;
  vK = k;
  vDim = aDim;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`,wa=`
uniform float uTime;
uniform vec3 uCore;
uniform vec3 uFlame;
uniform vec3 uHot;
varying vec2 vP;
varying vec2 vSize;
varying float vK;
varying float vDim;
#include <noise_lib>
float sdBox(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
void main() {
  float d = sdBox(vP, vSize * 0.5, 0.14);
  if (d > 0.08) discard;
  float fill = smoothstep(0.02, -0.04, d);
  // the hot edge: a thin rim that flickers like an ember
  float heat = 0.75 + 0.5 * vnoise(vec2(atan(vP.y, vP.x) * 3.0, uTime * 2.2));
  float rim = exp(-abs(d) * 38.0) * heat;
  // lit from the fire's side (its lower edge), faint rows of light inside
  float lit = 0.55 + 0.45 * smoothstep(vSize.y * 0.5, -vSize.y * 0.5, vP.y);
  float rows = 0.85 + 0.15 * sin(vP.y * 40.0);
  vec3 col = uCore * fill * 0.2 * lit * rows + mix(uFlame, uHot, 0.35) * rim * 1.1;
  float a = smoothstep(0.05, 0.6, vK) * mix(1.0, 0.42, vDim);
  gl_FragColor = vec4(col * a, 1.0);
}`,xa=`
attribute vec2 aA;
attribute vec2 aB;
attribute vec2 aEnd;
attribute float aShape;
attribute float aDim;
attribute float aS0;
attribute float aLen;
attribute float aTotal;
attribute float aRing;
uniform float uK[${Pe}];
uniform float uG[${Pe}];
uniform float uW;
varying float vAlong;
varying float vSide;
varying float vK;
varying float vG;
varying float vTotal;
varying float vDim;
varying float vRing;
void main() {
  int s = int(aShape + 0.5);
  vec2 dir = normalize(aB - aA);
  vec2 n = vec2(-dir.y, dir.x);
  float w = uW * (aRing > 0.5 ? 0.9 : 1.0);
  vec2 q = mix(aA, aB, aEnd.x) + n * aEnd.y * w;
  vAlong = aS0 + aEnd.x * aLen;
  vSide = aEnd.y;
  vK = uK[s];
  vG = aRing > 0.5 ? uK[s] : uG[s];
  vTotal = aTotal;
  vDim = aDim;
  vRing = aRing;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(q.x, aRing > 0.5 ? 0.1 : 0.32, q.y, 1.0);
}`,ya=`
uniform float uTime;
uniform vec3 uFlame;
uniform vec3 uHot;
uniform vec3 uRingCol;
varying float vAlong;
varying float vSide;
varying float vK;
varying float vG;
varying float vTotal;
varying float vDim;
varying float vRing;
void main() {
  float core = exp(-vSide * vSide * 3.5);
  // the burn: it grows from part to part, its front brightest
  float front = vG * (vTotal + 0.6);
  float grown = smoothstep(front, front - 0.35, vAlong);
  float head = exp(-pow((vAlong - front + 0.25) / 0.35, 2.0)) * step(vG, 0.999);
  // the fire running along it
  float speed = vRing > 0.5 ? 0.6 : 4.2;
  float flow = 0.35 + 0.65 * pow(0.5 + 0.5 * sin(vAlong * 2.3 - uTime * speed), 3.0);
  vec3 c = vRing > 0.5 ? uRingCol * (0.42 + 0.3 * flow) : mix(uFlame, uHot, flow * 0.7) * 1.7;
  float a = core * grown * (vRing > 0.5 ? 0.55 : flow) + head * core * 1.8;
  a *= smoothstep(0.1, 0.7, vK) * mix(1.0, 0.45, vDim);
  gl_FragColor = vec4(c * a, 1.0);
}`;function ba(){const t=new Te,e=[],o=[],n=[],r=[],l=[],c=[];let m=0;et.forEach((A,F)=>A.nodes.forEach(w=>{const O=Se(F,w.lx,w.lz);for(const[I,z]of[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]])e.push(I,z),o.push(O[0],0,O[2]),n.push(w.w,w.h),r.push(F),l.push(w.dim??0);c.push(m,m+1,m+2,m,m+2,m+3),m+=4}));const u=new X;u.setAttribute("position",new P(new Float32Array(o),3)),u.setAttribute("aCorner",new P(new Float32Array(e),2)),u.setAttribute("aCenter",new P(new Float32Array(o),3)),u.setAttribute("aSize",new P(new Float32Array(n),2)),u.setAttribute("aShape",new P(new Float32Array(r),1)),u.setAttribute("aDim",new P(new Float32Array(l),1)),u.setIndex(c);const s=new Array(Pe).fill(0),M=new Array(Pe).fill(0),h={uTime:{value:0},uK:{value:s},uFlame:{value:R(i["flame-color"])},uHot:{value:R(i["flame-core-color"])}},f=new N({vertexShader:ga,fragmentShader:wa,transparent:!0,depthWrite:!1,blending:$,side:Qe,uniforms:{...h,uTilt:{value:Eo},uCore:{value:R(i.world["field-crest-color"])}}}),b=new pe(u,f);b.frustumCulled=!1,b.renderOrder=5;const y=[],a=[],v=[],g=[],x=[],d=[],p=[],V=[],j=[],K=[];let H=0;const te=(A,F,w,O,I,z,ae)=>{const W=Math.hypot(w[0]-F[0],w[2]-F[2]);for(const[Y,re]of[[0,-1],[1,-1],[1,1],[0,1]])y.push(F[0],F[2]),a.push(w[0],w[2]),v.push(Y,re),g.push(A),x.push(z),d.push(O),p.push(W),V.push(I),j.push(ae);return K.push(H,H+1,H+2,H,H+2,H+3),H+=4,W};et.forEach((A,F)=>{const w=A.id==="persona",O=A.trails.map(_=>Math.hypot(_.to[0]-_.from[0],_.to[1]-_.from[1])),I=w?Math.max(...O):O.reduce((_,ve)=>_+ve,0);let z=0;A.trails.forEach((_,ve)=>{te(F,Se(F,..._.from),Se(F,..._.to),w?0:z,I,_.dim??0,0),z+=O[ve]});const ae=64,W=_=>{const ve=_/ae*Math.PI*2;return Se(F,Math.cos(ve)*jt,Math.sin(ve)*jt*Do)};let Y=0;for(let _=0;_<ae;_++)Y+=Math.hypot(W(_+1)[0]-W(_)[0],W(_+1)[2]-W(_)[2]);let re=0;for(let _=0;_<ae;_++)re+=te(F,W(_),W(_+1),re,Y,0,1)});const G=new X,U=A=>new Float32Array(A);G.setAttribute("position",new P(new Float32Array(H/1*3),3)),G.setAttribute("aA",new P(U(y),2)),G.setAttribute("aB",new P(U(a),2)),G.setAttribute("aEnd",new P(U(v),2)),G.setAttribute("aShape",new P(U(g),1)),G.setAttribute("aDim",new P(U(x),1)),G.setAttribute("aS0",new P(U(d),1)),G.setAttribute("aLen",new P(U(p),1)),G.setAttribute("aTotal",new P(U(V),1)),G.setAttribute("aRing",new P(U(j),1)),G.setIndex(K);const B=new N({vertexShader:xa,fragmentShader:ya,transparent:!0,depthWrite:!1,blending:$,side:Qe,uniforms:{...h,uG:{value:M},uW:{value:.2},uRingCol:{value:R(i.world["field-crest-color"])}}}),J=new pe(G,B);J.frustumCulled=!1,J.renderOrder=4,t.add(J,b);let Q=-1;return{group:t,k:s,g:M,update(A,F,w){h.uTime.value=A,Q=Math.round(w);let O=0;for(let z=0;z<Pe;z++)z!==Q&&(O=Math.max(O,s[z]));let I=!1;for(let z=0;z<Pe;z++)z===Q&&O<.3?(s[z]===0&&(I=!0),s[z]=Math.min(1,s[z]+F*1.25)):z!==Q&&(s[z]=Math.max(0,s[z]-F*2.2)),M[z]=s[z]>.9&&z===Q?Math.min(1,M[z]+F*.7):Math.max(0,M[z]-F*3);return I},dispose(){u.dispose(),G.dispose(),f.dispose(),B.dispose()}}}const ne=i.world,Ie=`
uniform float uTime;
uniform float uW[7];
uniform vec3 uC[7];
uniform float uAmp;
uniform float uSup;
uniform float uMix;
uniform float uCol;
uniform float uAmpT;
uniform float uMixA;
uniform float uMixB;
uniform vec3 uLand;
uniform float uLandOn;
uniform float uCalm;
uniform float uField;
uniform float uConv;
uniform vec3 uFire;
uniform float uFireI;
uniform float uFA;
uniform float uFK;
uniform float uFS;
uniform float uCH;
uniform float uCS;
uniform float uNear;
uniform float uFR;
uniform vec3 uFC;
uniform vec3 uS[6];
uniform float uPhase;
uniform vec3 uCr[6];
uniform float uLift;
uniform float uCrys;
uniform vec3 uOrb;
uniform float uOrbR;
uniform float uOrbit;
uniform float uRewrite;
uniform vec3 uCursor;
uniform float uCursorOn;
uniform vec3 uPulseC;
uniform float uPulseT;
uniform float uPulseV;
uniform float uRead;
// a hand-over lifts the whole field's light for a moment (a level, not a wave): no frame goes dark
uniform float uGlow;
uniform float uGlowN;
uniform float uRings;
uniform vec4 uLik;
uniform float uScatter;
uniform float uStray;
uniform vec3 uTl[6];
#include <noise_lib>

// M6: one likely reading — the crest (xy = place, z = strength, w = width)
float crestG(vec2 q) {
  vec2 d = q - uLik.xy;
  return exp(-dot(d, d) / (2.0 * uLik.w * uLik.w));
}
// how dark the rest of the field goes while one reading is likely (calm, dark field around the crest)
float focusDim(vec2 q) {
  return 1.0 - 0.38 * uLik.z * (1.0 - crestG(q)) * (1.0 - 0.6 * uScatter);
}

// height of the field at floor point q; tint = (amplify, suppress, mix, collapse) presence
float fieldH(vec2 q, out vec4 tint) {
  float r = length(q);
  float calm = 1.0 - 0.9 * uCalm;
  // M6 — no motion without a cause. At rest: flat, with one slow uniform breath. The only waves are the
  // fire's rings (the prompt reaching out over the readings), when the film calls for them.
  float h = uFA * calm * 0.05 * sin(uTime * 0.35);
  h += uRings * uFA * calm * sin(uFK * r * 0.55 - uTime * uFS) * 0.55 * exp(-r / 34.0);
  // one likely reading rises; a confused prompt raises many small ones; a flaw raises a stray one
  h += uLik.z * uCH * 1.25 * crestG(q);
  vec2 qs = q * 0.42 + vec2(7.3, 1.9);
  h += uScatter * uCH * 0.75 * pow(max(vnoise(qs) - 0.42, 0.0) / 0.58, 1.6);
  vec2 ds = q - (uLik.xy + vec2(3.2, 2.4));
  h += uStray * uCH * 0.9 * exp(-dot(ds, ds) / 2.2);
  tint = vec4(0.0);
  float mean = 1.0 / 7.0;
  float bumps = 0.0;
  int ta = int(uAmpT + 0.5);
  for (int i = 0; i < 7; i++) {
    vec2 d = q - uC[i].xz;
    float g = exp(-dot(d, d) / (2.0 * uCS * uCS));
    float w = uW[i];
    float b = uRead * uCH * 0.32 * pow(max(w * 7.0, 0.0), 0.85) * g * calm;
    float isT = i == ta ? 1.0 : 0.0;
    b += isT * uAmp * uCH * 0.55 * g;
    tint.x += isT * uAmp * g;
    float below = step(w, mean - 1e-4);
    b -= below * uSup * uCH * 0.4 * g;
    tint.y += below * uSup * g;
    bumps += b;
  }
  vec2 a = uC[int(uMixA + 0.5)].xz;
  vec2 bb = uC[int(uMixB + 0.5)].xz;
  float I = cos(length(q - a) * 3.0 - uTime * 2.4) + cos(length(q - bb) * 3.0 - uTime * 2.4);
  float span = length(a - bb) * 0.75 + 2.5;
  float env = exp(-pow(length(q - (a + bb) * 0.5) / span, 2.0));
  h += uMix * 0.42 * I * env;
  tint.z = uMix * env * (0.55 + 0.25 * I);
  vec2 dl = q - uLand.xz;
  float gl = exp(-dot(dl, dl) / 1.4);
  float coll = uCol * uLandOn;
  h = (h + bumps) * (1.0 - coll * 0.85) + coll * uCH * 1.5 * gl;
  tint.w = coll * gl;
  // flat at the brazier's foot
  return h * smoothstep(uNear * 0.6, uNear * 2.0, r);
}

// the readings' own light on the field: each cluster glows by its weight (the amplified one most)
float readingsGlow(vec2 q) {
  float g = 0.0;
  for (int i = 0; i < 7; i++) {
    vec2 d = q - uC[i].xz;
    g += pow(max(uW[i] * 7.0, 0.0), 1.3) * exp(-dot(d, d) / (2.0 * uCS * uCS * 2.2));
  }
  return uRead * g * (1.0 - uCol * uLandOn * 0.7);
}

// the landmarks light the field around them: the forge's lit stations, the risen crystals, the orbit
vec3 landmarkGlow(vec2 q) {
  float st = 0.0;
  for (int i = 0; i < 6; i++) {
    float lit = clamp(uPhase - float(i), 0.0, 1.0);
    float now = lit * (1.0 - clamp(uPhase - float(i) - 1.0, 0.0, 1.0));
    vec2 d = q - uS[i].xz;
    st += (0.45 * lit + 0.9 * now) * exp(-dot(d, d) / 9.0);
  }
  // chapter 7 (M6): the field's own light draws the standing shape — a glow under each of its tiles
  float cr = 0.0;
  for (int i = 0; i < 6; i++) {
    vec2 d = q - uTl[i].xy;
    cr += uTl[i].z * exp(-dot(d, d) / 2.4);
  }
  float ring = abs(length(q - uOrb.xz) - uOrbR);
  float orb = uOrbit * exp(-ring * ring / 1.6) * (0.6 + 0.8 * clamp(uRewrite - 1.0, 0.0, 1.0));
  return vec3(st, cr, orb);
}

// the visitor's hand: the field lifts and ripples under the cursor, lit by it
vec2 cursorFx(vec2 q) {
  if (uCursorOn < 0.01) return vec2(0.0);
  float d = length(q - uCursor.xz);
  float glow = exp(-d * d / 9.0) * uCursorOn;
  float ripple = sin(d * 2.6 - uTime * 5.0) * exp(-d * 0.35) * uCursorOn;
  return vec2(glow * 0.7 + ripple * 0.18, glow + max(ripple, 0.0) * 0.4);
}

// an operator's shock ring: runs out across the field from where the operator acted (chapter 3)
float pulseRing(vec2 q) {
  if (uPulseT < 0.0) return 0.0;
  float d = length(q - uPulseC.xz);
  return exp(-pow((d - uPulseT * uPulseV) / 0.9, 2.0)) * exp(-uPulseT * 0.6) + exp(-d * d / 6.0) * exp(-uPulseT * 1.6);
}

// the fire's reach: 1 near the brazier, falling off over the field
float fireLight(vec3 p) {
  // the fire throws its light on the field: it breathes with the flicker and reaches further in a flare
  float d = length(p - uFire);
  float reach = 21.0 * (0.75 + 0.35 * uFireI);
  return uFireI / (1.0 + pow(d / reach, 2.0));
}

// the hero's reveal: the lit disc grows from the fire; a bright crest runs at its edge
vec2 reveal(float r) {
  float R = uField * uFR * 1.35;
  float m = 1.0 - smoothstep(R - 9.0, R, r);
  float crest = exp(-pow((r - R) / 1.8, 2.0)) * (1.0 - smoothstep(0.97, 1.0, uField));
  return vec2(m, crest);
}

// the closing: everything folds back into the flame along a spiral
vec3 converge(vec3 p, float seed) {
  float k = smoothstep(0.0, 1.0, uConv * 1.3 - seed * 0.3);
  vec3 d = p - uFire;
  float ang = k * 2.6;
  vec3 s = vec3(cos(ang) * d.x - sin(ang) * d.z, d.y, sin(ang) * d.x + cos(ang) * d.z);
  return uFire + s * (1.0 - k);
}
`,Ca=ne.stations.map(t=>new T(...t)),Ma=ne.crystals.map(t=>new T(...t));function Aa(){const t=new T(0,i["brazier-height"]+i["flame-height"]*.5,0);return{uTime:{value:0},uW:{value:[...oe.composer.w0]},uC:{value:i.clusters.map(e=>new T(...e.pos))},uAmp:{value:0},uSup:{value:0},uMix:{value:0},uCol:{value:0},uAmpT:{value:oe.composer.amplify.target},uMixA:{value:1},uMixB:{value:oe.composer.mix.partner},uLand:{value:new T},uLandOn:{value:0},uCalm:{value:0},uField:{value:0},uConv:{value:0},uFire:{value:t},uFireI:{value:1},uFA:{value:ne["field-amp"]},uFK:{value:ne["field-wave-k"]},uFS:{value:ne["field-wave-speed"]},uCH:{value:ne["field-cluster-height"]},uCS:{value:ne["field-cluster-sigma"]},uNear:{value:ne["field-near-fire"]},uFR:{value:ne["field-radius"]},uFC:{value:new T(...ne["field-center"])},uS:{value:Ca},uPhase:{value:0},uCr:{value:Ma},uLift:{value:0},uCrys:{value:0},uOrb:{value:new T(...Ae.center)},uOrbR:{value:Ae.radius},uOrbit:{value:0},uRewrite:{value:0},uCursor:{value:new T},uCursorOn:{value:0},uRead:{value:0},uGlow:{value:0},uGlowN:{value:0},uRings:{value:0},uLik:{value:new Co(0,-12,0,3)},uScatter:{value:0},uStray:{value:0},uTl:{value:Array.from({length:6},()=>new T)},uPulseC:{value:new T},uPulseT:{value:-1},uPulseV:{value:ne["pulse-speed"]},uPulseCol:{value:R(i["operator-light-amplify"])},uFieldColor:{value:R(ne["field-color"])},uFieldLit:{value:R(ne["field-lit-color"])},uCrest:{value:R(ne["field-crest-color"])},uOpAmp:{value:R(i["operator-light-amplify"])},uOpSup:{value:R(i["operator-light-suppress"])},uOpMix:{value:R(i["operator-light-mix"])},uOpCol:{value:R(i["operator-light-collapse"])}}}function Sa(t,e,o,n){t.uTime.value=o;const r=t.uW.value;r[0]=e.w0,r[1]=e.w1,r[2]=e.w2,r[3]=e.w3,r[4]=e.w4,r[5]=e.w5,r[6]=e.w6,t.uAmp.value=e.amplify,t.uSup.value=e.suppress,t.uMix.value=e.mix,t.uCol.value=e.collapse,t.uAmpT.value=e.amplifyTarget,t.uMixA.value=e.mixA,t.uMixB.value=e.mixB,n&&t.uLand.value.copy(n),t.uLandOn.value=n?1:0,t.uCalm.value=e.calm,t.uField.value=e.field,t.uConv.value=e.converge,t.uPhase.value=e.phase,t.uLift.value=e.lift,t.uCrys.value=e.crystals,t.uOrbit.value=e.orbit,t.uRewrite.value=e.rewrite,t.uRead.value=e.readings,t.uRings.value=e.rings,t.uScatter.value=e.scatter,t.uStray.value=e.stray,t.uLik.value.set(e.crestX,e.crestZ,e.crest,e.crestW)}const Je=i.world,Pa=`
${Ie}
attribute float aSeed;
uniform float uSize;
uniform float uPixelRatio;
uniform float uViewH;
varying float vB;
varying float vFire;
varying float vCrest;
varying vec4 vTint;
varying float vA;
varying vec3 vLm;
varying float vPulse;
varying float vCur;
void main() {
  vec3 p = position;
  vec4 tint;
  float h = fieldH(p.xz, tint);
  float pr = pulseRing(position.xz);
  // M6b: the ring's light falls off with distance from where it started, so far off (where perspective packs
  // the points) it never piles up into a bright band across the frame
  float prNear = 1.0 / (1.0 + pow(length(position.xz - uPulseC.xz) / 24.0, 2.0));
  vec2 cf = cursorFx(position.xz);
  vPulse = pr;
  vCur = cf.y;
  p.y += h + pr * 0.6 + cf.x;
  float r = length(p.xz);
  vec2 rv = reveal(r);
  float fire = fireLight(p);
  float rel = clamp(h / (uCH * 0.9), -1.0, 1.0);
  p = converge(p, aSeed);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float d = max(-mv.z, 0.1);
  float shade = 0.4 + 0.6 * clamp(rel * 0.5 + 0.5, 0.0, 1.0);
  float glow = readingsGlow(p.xz) * (1.0 - 0.5 * uCalm);
  vec3 lm = landmarkGlow(p.xz);
  vLm = lm;
  float b = (1.12 + 0.9 * fire) * (1.0 - 0.15 * uCalm) * shade + max(rel, 0.0) * 0.9 + rv.y * 1.8 + tint.x * 0.8 + tint.w * 1.5 + tint.z * 0.45 + glow * 0.32 + lm.x * 1.3 + lm.y * 1.2 + lm.z * 1.1 + pr * 1.2 * prNear + cf.y * 1.4;
  b *= focusDim(p.xz);
  // M6b: the hand-over lift is mostly local — around the fire and the likely reading — plus an even lift on
  // the near and middle field only, so a cut that looks away from the fire never goes black; never a full-frame veil (the far-point
  // boost below is capped, so this cannot pile up into a band at the horizon)
  float nearW = 1.0 - smoothstep(30.0, 80.0, d);
  b += uGlowN * 3.5 * nearW + uGlow * 0.55 * (min(fire, 1.2) + crestG(p.xz) * uLik.z);
  vB = b;
  vFire = max(fire, glow * 0.45);
  vCrest = clamp(max(rel, 0.0) * 0.8 + rv.y + tint.w, 0.0, 1.0);
  vTint = tint;
  // distance haze toward the void, and the reveal mask
  // constant surface brightness: as the dots shrink with distance they burn brighter — but only while they
  // can still shrink (M6b): past the size floor the boost would just stack into a milky band at the horizon
  vA = (rv.x + rv.y) * exp(-max(d - 30.0, 0.0) / 30.0) * (0.75 + 0.25 * aSeed) * (1.0 - uConv * 0.35) * clamp(d / 12.0, 1.0, 2.1);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(uSize * uPixelRatio * (uViewH / 900.0) * (38.0 / d) * (0.75 + min(b, 1.6) * 0.5), 1.8 * uPixelRatio, 7.0 * uPixelRatio);
}`,Ra=`
uniform vec3 uFieldColor;
uniform vec3 uFieldLit;
uniform vec3 uCrest;
uniform vec3 uOpAmp;
uniform vec3 uOpSup;
uniform vec3 uOpMix;
uniform vec3 uOpCol;
varying float vB;
varying float vFire;
varying float vCrest;
varying vec4 vTint;
varying float vA;
varying vec3 vLm;
varying float vPulse;
varying float vCur;
uniform vec3 uEmber;
uniform vec3 uPulseCol;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d) * 4.0;
  if (r > 1.0) discard;
  float soft = pow(1.0 - r, 1.8);
  vec3 c = mix(uFieldColor, uFieldLit, clamp(vFire * 1.2, 0.0, 1.0));
  c = mix(c, uCrest, vCrest * 0.6);
  c = mix(c, uOpAmp, clamp(vTint.x, 0.0, 1.0) * 0.7);
  c = mix(c, uOpSup, clamp(vTint.y, 0.0, 1.0) * 0.6);
  c += uOpMix * clamp(vTint.z, 0.0, 1.0) * 0.7;
  c = mix(c, uOpCol * 1.4, clamp(vTint.w, 0.0, 1.0));
  c = mix(c, uEmber, clamp(vLm.x, 0.0, 1.0) * 0.8);
  c = mix(c, uCrest, clamp(vLm.y, 0.0, 1.0) * 0.6);
  c = mix(c, uOpSup, clamp(vLm.z, 0.0, 1.0) * 0.7);
  c = mix(c, uPulseCol * 1.3, clamp(vPulse, 0.0, 1.0));
  c = mix(c, uCrest, clamp(vCur, 0.0, 1.0) * 0.5);
  float a = soft * clamp(vB, 0.0, 1.8) * 0.85 * vA;
  gl_FragColor = vec4(c * a, a);
}`;function Ta(t){const e=Je["field-radius"],o=Je["field-spacing"],[n,,r]=Je["field-center"],l=o*Math.sqrt(3)/2,c=we(27750862),m=[];for(let a=-Math.ceil(e/l);a<=Math.ceil(e/l);a++){const v=a*l,g=a%2?o/2:0;for(let x=-e;x<=e;x+=o){const d=x+g+(c()-.5)*o*.45,p=v+(c()-.5)*o*.45;d*d+p*p<=e*e&&m.push(n+d,0,r+p)}}const u=m.length/3,s=we(85925405),M=new Float32Array(u);for(let a=0;a<u;a++)M[a]=s();const h=new X;h.setAttribute("position",new P(new Float32Array(m),3)),h.setAttribute("aSeed",new P(M,1));const f=new Uint32Array(u);for(let a=0;a<u;a++)f[a]=a;for(let a=u-1;a>0;a--){const v=Math.floor(s()*(a+1));[f[a],f[v]]=[f[v],f[a]]}h.setIndex(new P(f,1));const b=new N({vertexShader:Pa,fragmentShader:Ra,transparent:!0,depthWrite:!1,blending:$,uniforms:{...t,uSize:{value:Je["field-point-size"]},uEmber:{value:R(i["flame-color"])},uPixelRatio:{value:1},uViewH:{value:900}}}),y=new ie(h,b);return y.frustumCulled=!1,y.renderOrder=0,{object:y,count:u,setPixelRatio(a,v){b.uniforms.uPixelRatio.value=a,b.uniforms.uViewH.value=v},setFraction(a){h.setDrawRange(0,Math.round(u*a))},dispose(){h.dispose(),b.dispose()}}}const wt=i.world,Fa=`
${Ie}
attribute float aK;
varying float vA;
varying float vFire;
varying float vK;
varying float vAx;
void main() {
  vec3 p = position;
  // the measuring axes appear once the field is fully awake (end of the hero)
  vAx = smoothstep(0.85, 1.0, uField);
  float r = length(p.xz);
  vec2 rv = reveal(r);
  vec3 lm = landmarkGlow(p.xz);
  vFire = fireLight(p) + readingsGlow(p.xz) * 0.25 + lm.x + lm.y + lm.z;
  vK = aK;
  p = converge(p, 0.5);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float d = max(-mv.z, 0.1);
  float fromC = length(position.xz - uFC.xz);
  vA = (rv.x + rv.y * 2.0) * exp(-max(d - 20.0, 0.0) / 30.0) * (1.0 - smoothstep(18.0, 40.0, fromC)) * (1.0 - 0.5 * uCalm);
  gl_Position = projectionMatrix * mv;
}`,za=`
uniform vec3 uFieldColor;
uniform vec3 uFieldLit;
uniform vec3 uCrest;
uniform float uStrength;
varying float vA;
varying float vFire;
varying float vK;
varying float vAx;
void main() {
  // aK: 0 = floor grid, 1 = major grid line, 2 = axis
  vec3 c = mix(uFieldLit * 0.55, uFieldLit, clamp(vFire * 1.3, 0.0, 1.0));
  c = mix(c, uCrest, step(1.5, vK) * 0.55);
  float a = vA * uStrength * (vK > 1.5 ? 0.45 * vAx : vK > 0.5 ? 0.5 : 0.24) * clamp(1.0 + vFire, 1.0, 2.5);
  gl_FragColor = vec4(c * a, a);
}`,Oa=`
${Ie}
uniform float uPixelRatio;
varying float vA;
void main() {
  vec3 p = converge(position, 0.5);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float d = max(-mv.z, 0.1);
  vA = reveal(length(position.xz)).x * exp(-max(d - 20.0, 0.0) / 30.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = min(2.4 * uPixelRatio * (16.0 / d), 5.0 * uPixelRatio);
}`,ka=`
uniform vec3 uCrest;
varying float vA;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d) * 4.0;
  if (r > 1.0) discard;
  float a = (1.0 - r) * 0.7 * vA;
  gl_FragColor = vec4(uCrest * a, a) * smoothstep(0.85, 1.0, uField);
}`,La=`
${Ie}
attribute float aCl;
attribute float aF;
uniform float uPixelRatio;
varying float vA;
varying float vT;
void main() {
  int i = int(aCl + 0.5);
  float w = uW[i] * 7.0;
  float isT = i == int(uAmpT + 0.5) ? uAmp : 0.0;
  vT = isT;
  vec3 p = converge(position, 0.5);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float d = max(-mv.z, 0.1);
  vA = reveal(length(position.xz)).x * (0.25 + 0.75 * clamp(w, 0.0, 2.5)) * (1.0 - uCol * uLandOn * 0.7) * (1.0 - 0.5 * uCalm) * (0.4 + 0.6 * aF);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(2.2 * uPixelRatio * (14.0 / d), 1.2 * uPixelRatio, 4.0 * uPixelRatio);
}`,Ha=`
uniform vec3 uFieldLit;
uniform vec3 uOpAmp;
varying float vA;
varying float vT;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d) * 4.0;
  if (r > 1.0) discard;
  float a = (1.0 - r) * 0.7 * vA;
  gl_FragColor = vec4(mix(uFieldLit, uOpAmp, vT) * a, a);
}`,_a=`
attribute float aS;
varying float vS;
void main() { vS = aS; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,Va=`
uniform vec3 uColor;
uniform float uOn;
uniform float uDash;
varying float vS;
void main() {
  float dash = uDash > 0.5 ? step(0.5, fract(vS * 14.0)) : 1.0;
  float a = uOn * dash * (uDash > 0.5 ? 0.45 : 0.95);
  gl_FragColor = vec4(uColor * a, a);
}`;function Ea(t){const e=new Te,[o,,n]=wt["field-center"],r=wt["space-grid-step"],l=40,c=[],m=[],u=(w,O,I)=>{const z=Math.max(1,Math.ceil(Math.hypot(O[0]-w[0],O[1]-w[1],O[2]-w[2])/.8));for(let ae=0;ae<z;ae++){const W=ae/z,Y=(ae+1)/z;c.push(...w.map((re,_)=>re+(O[_]-re)*W),...w.map((re,_)=>re+(O[_]-re)*Y)),m.push(I,I)}};for(let w=-l;w<=l;w+=r){const O=Math.abs(Math.round(w/r))%5===0?1:0;u([o+w,.01,n-l],[o+w,.01,n+l],O),u([o-l,.01,n+w],[o+l,.01,n+w],O)}const s=[o,.02,n+2],M=wt["space-axis-length"];u([s[0]-M,s[1],s[2]],[s[0]+M,s[1],s[2]],2),u([s[0],s[1],s[2]+M],[s[0],s[1],s[2]-M],2),u([s[0],s[1],s[2]],[s[0],s[1]+M*.7,s[2]],2);const h=new X;h.setAttribute("position",new P(new Float32Array(c),3)),h.setAttribute("aK",new P(new Float32Array(m),1));const f=new N({vertexShader:Fa,fragmentShader:za,transparent:!0,depthWrite:!1,blending:$,uniforms:{...t,uStrength:{value:1}}}),b=new gt(h,f);b.frustumCulled=!1,e.add(b);const y=[];for(let w=-M;w<=M;w++)w!==0&&(y.push(s[0]+w,s[1],s[2],s[0],s[1],s[2]-w),w>0&&w<=M*.7&&y.push(s[0],s[1]+w,s[2]));const a=new X;a.setAttribute("position",new P(new Float32Array(y),3));const v=new N({vertexShader:Oa,fragmentShader:ka,transparent:!0,depthWrite:!1,blending:$,uniforms:{...t,uPixelRatio:{value:1}}}),g=new ie(a,v);g.frustumCulled=!1,e.add(g);const x=[],d=[],p=[];i.clusters.forEach((w,O)=>{const[I,z,ae]=w.pos;for(let W=0;W<=18;W++)x.push(I,z*W/18,ae),d.push(O),p.push(W/18);for(let W=0;W<48;W++){const Y=W/48*Math.PI*2;x.push(I+Math.cos(Y)*1.1,.03,ae+Math.sin(Y)*1.1),d.push(O),p.push(1)}});const V=new X;V.setAttribute("position",new P(new Float32Array(x),3)),V.setAttribute("aCl",new P(new Float32Array(d),1)),V.setAttribute("aF",new P(new Float32Array(p),1));const j=new N({vertexShader:La,fragmentShader:Ha,transparent:!0,depthWrite:!1,blending:$,uniforms:{...t,uPixelRatio:{value:1}}}),K=new ie(V,j);K.frustumCulled=!1,e.add(K);const H=new X,te=new Float32Array(18);H.setAttribute("position",new P(te,3)),H.setAttribute("aS",new P(new Float32Array([0,1,0,1,0,1]),1));const G=w=>new N({vertexShader:_a,fragmentShader:Va,transparent:!0,depthWrite:!1,blending:$,uniforms:{uColor:t.uOpCol,uOn:{value:0},uDash:{value:w}}}),U=G(0),B=G(1),J=new gt(H,U);J.geometry.setDrawRange(0,2),J.frustumCulled=!1;const Q=H.clone(),A=new gt(Q,B);A.frustumCulled=!1,e.add(J,A);const F=new T(s[0],s[1],s[2]);return{object:e,origin:F,setPixelRatio(w){v.uniforms.uPixelRatio.value=w,j.uniforms.uPixelRatio.value=w},setFraction(){},setVector(w,O){const I=J.geometry.attributes.position;I.setXYZ(0,F.x,F.y,F.z),I.setXYZ(1,w.x,w.y,w.z),I.needsUpdate=!0;const z=Q.attributes.position;z.setXYZ(0,w.x,w.y,w.z),z.setXYZ(1,w.x,.02,w.z),z.setXYZ(2,w.x,.02,w.z),z.setXYZ(3,F.x,F.y,F.z),z.setXYZ(4,w.x,.02,w.z),z.setXYZ(5,w.x,.02,F.z),z.needsUpdate=!0,U.uniforms.uOn.value=O,B.uniforms.uOn.value=O},dispose(){h.dispose(),f.dispose(),a.dispose(),v.dispose(),V.dispose(),j.dispose(),H.dispose(),Q.dispose(),U.dispose(),B.dispose()}}}const ao=i.world,io=ao["trail-length"],xt=4,Da=`
uniform float uSize;
uniform float uPixelRatio;
uniform float uOn;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.6 + 0.4 * uOn) * clamp(14.0 / -mv.z, 0.35, 3.0) * 6.0;
}`,Ga=`
uniform vec3 uColor;
uniform vec3 uHalo;
uniform float uOn;
uniform float uTime;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d) * 2.0;
  if (r > 1.0) discard;
  float core = exp(-r * r * 60.0);
  float halo = exp(-r * r * 6.0) * (0.35 + 0.08 * sin(uTime * 3.0));
  float rays = pow(max(0.0, 1.0 - abs(d.x) * 22.0), 3.0) * exp(-abs(d.y) * 5.0) + pow(max(0.0, 1.0 - abs(d.y) * 22.0), 3.0) * exp(-abs(d.x) * 5.0);
  float a = (core * 1.6 + halo + rays * 0.35) * uOn;
  gl_FragColor = vec4(mix(uHalo, uColor, core) * a, a);
}`,Ba=`
attribute float aT;
uniform float uPixelRatio;
uniform float uSize;
varying float vT;
void main() {
  vT = aT;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.5 + 0.8 * aT) * clamp(12.0 / -mv.z, 0.3, 2.5);
}`,Ia=`
uniform vec3 uColor;
uniform vec3 uHead;
uniform float uOn;
varying float vT;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d) * 4.0;
  if (r > 1.0) discard;
  float a = (1.0 - r) * (0.18 + 0.82 * vT) * uOn;
  gl_FragColor = vec4(mix(uColor, uHead, vT * vT) * a, a);
}`;function Zt(t,e,o){const n=io*xt,r=new X;r.setAttribute("position",new P(new Float32Array(n*3),3)),r.setAttribute("aT",new P(new Float32Array(n),1)),r.setDrawRange(0,0);const l=new N({vertexShader:Ba,fragmentShader:Ia,transparent:!0,depthWrite:!1,blending:$,uniforms:{uColor:{value:R(t)},uHead:{value:R(e)},uOn:{value:0},uPixelRatio:{value:1},uSize:{value:o}}}),c=new ie(r,l);return c.frustumCulled=!1,c.renderOrder=4,{pts:c,mat:l,geo:r,write:u=>{const s=r.attributes.position,M=r.attributes.aT;let h=0;const f=Math.max(1,u.length-1);for(let b=0;b<u.length;b++){const y=u[b],a=u[Math.min(u.length-1,b+1)],v=b<u.length-1?xt:1;for(let g=0;g<v;g++){const x=g/xt;s.setXYZ(h,y.x+(a.x-y.x)*x,y.y+(a.y-y.y)*x,y.z+(a.z-y.z)*x),M.setX(h,(b+x)/f),h++}}r.setDrawRange(0,h),s.needsUpdate=!0,M.needsUpdate=!0}}}function Wa(){const t=new Te,e=new X;e.setAttribute("position",new P(new Float32Array(3),3));const o=new N({vertexShader:Da,fragmentShader:Ga,transparent:!0,depthWrite:!1,blending:$,uniforms:{uColor:{value:R(i["operator-light-collapse"])},uHalo:{value:R(i["flame-core-color"])},uOn:{value:0},uTime:{value:0},uSize:{value:ao["prompt-size"]},uPixelRatio:{value:1}}}),n=new ie(e,o);n.frustumCulled=!1,n.renderOrder=5;const r=Zt(i["operator-light-amplify"],i["operator-light-collapse"],2.6),l=Zt(i["operator-light-mix"],i["operator-light-mix"],2);t.add(l.pts,r.pts,n);const c=new T;let m=!1,u=[],s=[],M=0,h=!1;const f=new T;return{group:t,position:c,setPixelRatio(b){o.uniforms.uPixelRatio.value=b,r.mat.uniforms.uPixelRatio.value=b,l.mat.uniforms.uPixelRatio.value=b},update(b,y,a,v,g,x){const d=Math.min(1,Math.max(0,g)),p=d*d*(3-2*d),V=new T().lerpVectors(v,a,p);if(m&&a.distanceTo(f)>2.2&&(u.length>6&&(s=u,M=0),u=[],h=!0),f.copy(a),m?c.lerp(V,1-Math.exp(-5.5*y)):(c.copy(V),m=!0),h&&c.distanceTo(V)<.35&&(h=!1),x>.01&&d>.98&&!h){const j=u[u.length-1];(!j||j.distanceTo(c)>.06)&&(u.push(c.clone()),u.length>io&&u.shift(),r.write(u))}x<.01&&u.length&&(u=[],s=[],r.geo.setDrawRange(0,0),l.geo.setDrawRange(0,0)),M+=y,s.length&&M<y*1.5&&l.write(s),e.attributes.position.setXYZ(0,c.x,c.y,c.z),e.attributes.position.needsUpdate=!0,o.uniforms.uOn.value=Math.min(1,g*2.5),o.uniforms.uTime.value=b,r.mat.uniforms.uOn.value=x,l.mat.uniforms.uOn.value=x*.55*Math.max(.35,1-M/40)},dispose(){e.dispose(),o.dispose(),r.geo.dispose(),r.mat.dispose(),l.geo.dispose(),l.mat.dispose()}}}const qa=`
${Ie}
attribute float aRoute;
attribute float aS;
uniform float uRide;
uniform float uPixelRatio;
uniform float uRoutes;
uniform float uLit;
varying float vS;
varying float vOn;
varying float vHot;
void main() {
  vec3 p = position;
  vec4 tint;
  p.y += uRide * fieldH(p.xz, tint) + 0.12;
  float lit = 1.0 - clamp(abs(uLit - (aRoute + 1.0)), 0.0, 1.0);
  vOn = uRoutes * (0.22 + 0.78 * lit);
  vS = aS;
  float head = fract(uTime * 0.12 + aRoute * 0.33);
  float dh = abs(aS - head);
  vHot = exp(-dh * dh * 600.0) * lit;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = min((1.6 + vHot * 4.0 + lit * 1.2) * uPixelRatio * (14.0 / max(-mv.z, 0.1)), 9.0 * uPixelRatio);
}`,ja=`
uniform vec3 uColor;
uniform vec3 uHot;
varying float vS;
varying float vOn;
varying float vHot;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d) * 4.0;
  if (r > 1.0) discard;
  float a = (1.0 - r) * vOn * (0.9 + 1.6 * vHot);
  gl_FragColor = vec4(mix(uColor, uHot, vHot) * a, a);
}`;function Ka(t,e){const o=[],n=[],r=[];Go.forEach((u,s)=>{const M=Bo(u,40);let h=0;const f=[0];for(let a=1;a<M.length;a++)h+=Math.hypot(M[a][0]-M[a-1][0],M[a][2]-M[a-1][2]),f.push(h);const b=Math.max(2,Math.round(h/.22));let y=0;for(let a=0;a<b;a++){const v=a/(b-1)*h;for(;y<f.length-2&&f[y+1]<v;)y++;const g=(v-f[y])/Math.max(f[y+1]-f[y],1e-6),x=M[y],d=M[y+1];o.push(x[0]+(d[0]-x[0])*g,x[1]+(d[1]-x[1])*g,x[2]+(d[2]-x[2])*g),n.push(s),r.push(a/(b-1))}});const l=new X;l.setAttribute("position",new P(new Float32Array(o),3)),l.setAttribute("aRoute",new P(new Float32Array(n),1)),l.setAttribute("aS",new P(new Float32Array(r),1));const c=new N({vertexShader:qa,fragmentShader:ja,transparent:!0,depthWrite:!1,blending:$,uniforms:{...t,uRide:{value:e?1:0},uPixelRatio:{value:1},uRoutes:{value:0},uLit:{value:0},uColor:{value:R(i["flame-color"])},uHot:{value:R(i["flame-core-color"])}}}),m=new ie(l,c);return m.frustumCulled=!1,m.renderOrder=2,{object:m,setPixelRatio(u){c.uniforms.uPixelRatio.value=u},update(u,s){c.uniforms.uRoutes.value=u,c.uniforms.uLit.value=s,m.visible=u>.005},dispose(){l.dispose(),c.dispose()}}}const Xt=i.world,Ua=`
attribute float aA;
uniform float uPixelRatio;
uniform float uSize;
uniform float uMin;
varying float vA;
void main() {
  vA = aA;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  // M6b: a beacon the camera passes close to stays a light, never a frame-filling wash
  gl_PointSize = clamp(uSize * uPixelRatio * (10.0 / max(-mv.z, 0.1)), uMin * uPixelRatio, 40.0 * uPixelRatio);
}`,Na=`
uniform vec3 uColor;
uniform vec3 uCore;
uniform float uOn;
varying float vA;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d) * 2.0;
  if (r > 1.0) discard;
  float a = (exp(-r * r * 30.0) * 1.4 + exp(-r * r * 5.0) * 0.35) * uOn;
  gl_FragColor = vec4(mix(uColor, uCore, exp(-r * r * 30.0)) * a, a);
}`,Ya=`
uniform vec3 uColor;
uniform vec3 uHot;
uniform float uOn;
uniform float uPulse;
uniform float uHead;
varying float vA;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d) * 4.0;
  if (r > 1.0) discard;
  float dh = abs(vA - uHead); dh = min(dh, 1.0 - dh);
  float near = exp(-dh * dh * 220.0);
  float a = (1.0 - r) * uOn * (0.6 + 1.2 * uPulse + near * 1.4);
  gl_FragColor = vec4(mix(uColor, uHot, max(uPulse, near)) * a, a);
}`,Za=`
uniform vec3 uCold;
uniform vec3 uHot;
uniform float uOn;
uniform float uHeat;
varying float vA;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d) * 2.0;
  if (r > 1.0) discard;
  float a = (exp(-r * r * 40.0) * 1.5 + exp(-r * r * 6.0) * 0.4) * uOn;
  gl_FragColor = vec4(mix(uCold, uHot, uHeat) * a, a);
}`,Xa=`
attribute float aTier;
attribute float aH;
uniform float uGrow[6];
varying vec3 vN;
varying vec3 vV;
varying float vH;
varying float vTier;
varying float vG;
void main() {
  int k = int(aTier + 0.5);
  float g = uGrow[k];
  vG = g;
  vec3 p = position;
  vec3 base = vec3(p.x, 0.0, p.z);
  p.y *= g;
  vH = aH;
  vTier = aTier;
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vN = normalize(mat3(modelMatrix) * normal);
  vV = normalize(cameraPosition - wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,$a=`
uniform vec3 uTier[3];
uniform vec3 uCore;
uniform float uOn;
uniform float uTime;
varying vec3 vN;
varying vec3 vV;
varying float vH;
varying float vTier;
varying float vG;
void main() {
  vec3 c = uTier[int(floor(vTier / 2.0 + 0.01))];
  float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
  float bands = 0.5 + 0.5 * sin(vH * 18.0 - uTime * 1.6);
  float a = (0.10 + fres * 0.9 + bands * 0.12 + smoothstep(0.85, 1.0, vH) * 0.6) * uOn * smoothstep(0.0, 0.08, vG);
  gl_FragColor = vec4(mix(c, uCore, fres * 0.4) * a, a);
}`;function yt(t,e,o,n,r=0){const l=new X;l.setAttribute("position",new P(new Float32Array(t*3),3)),l.setAttribute("aA",new P(new Float32Array(t),1));const c=new N({vertexShader:Ua,fragmentShader:e,transparent:!0,depthWrite:!1,blending:$,uniforms:{uPixelRatio:{value:1},uSize:{value:n},uMin:{value:r},...o}}),m=new ie(l,c);return m.frustumCulled=!1,{p:m,geo:l,mat:c}}function Ja(){const t=[],e=[],o=[],n=[],r=we(12648430);for(let c=0;c<6;c++){const m=Xt.crystals[c],u=Xt["crystal-height"][c],s=.42+r()*.18,M=.18,h=(r()-.5)*.12,f=r()*Math.PI,b=Array.from({length:6},(g,x)=>{const d=f+x/6*Math.PI*2;return[Math.cos(d)*s,M*u,Math.sin(d)*s]}),y=[h*u,u,h*u*.5],a=[0,0,0],v=(g,x,d)=>{const p=[x[0]-g[0],x[1]-g[1],x[2]-g[2]],V=[d[0]-g[0],d[1]-g[1],d[2]-g[2]],j=new T(p[1]*V[2]-p[2]*V[1],p[2]*V[0]-p[0]*V[2],p[0]*V[1]-p[1]*V[0]).normalize();for(const K of[g,x,d])t.push(m[0]+K[0],m[1]+K[1],m[2]+K[2]),e.push(j.x,j.y,j.z),o.push(c),n.push(K[1]/u)};for(let g=0;g<6;g++){const x=b[g],d=b[(g+1)%6];v(x,y,d),v(x,d,a)}}const l=new X;return l.setAttribute("position",new P(new Float32Array(t),3)),l.setAttribute("normal",new P(new Float32Array(e),3)),l.setAttribute("aTier",new P(new Float32Array(o),1)),l.setAttribute("aH",new P(new Float32Array(n),1)),l}function Qa(t){const e=new Te,o=R(i["flame-color"]),n=R(i["flame-core-color"]),r=yt(1,Na,{uColor:{value:o},uCore:{value:n},uOn:{value:1}},3.2,26);r.geo.attributes.position.setXYZ(0,t.x,t.y,t.z),r.p.renderOrder=7;const l=300,c=yt(l,Ya,{uColor:{value:R(i["operator-light-suppress"])},uHot:{value:n},uOn:{value:0},uPulse:{value:0},uHead:{value:0}},3.2,1.5),m=.26,u=(g,x)=>{const d=Math.cos(g)*x,p=Math.sin(g)*x;return new T(Ae.center[0]+d,Ae.center[1]+p*Math.sin(m),Ae.center[2]+p*Math.cos(m))};for(let g=0;g<l;g++){const x=u(g/l*Math.PI*2,Ae.radius);c.geo.attributes.position.setXYZ(g,x.x,x.y,x.z),c.geo.attributes.aA.setX(g,g/l)}const s=yt(1,Za,{uCold:{value:R(i["operator-light-suppress"])},uHot:{value:R(i["operator-light-collapse"])},uOn:{value:0},uHeat:{value:1}},12,10),M=Ja(),h=new N({vertexShader:Xa,fragmentShader:$a,transparent:!0,depthWrite:!1,blending:$,uniforms:{uGrow:{value:[0,0,0,0,0,0]},uTier:{value:[R(i["flame-core-color"]),R(i["flame-color"]),R(i["operator-light-collapse"])]},uCore:{value:n},uOn:{value:0},uTime:{value:0}}}),f=new pe(M,h);f.frustumCulled=!1,f.renderOrder=3,e.add(r.p,c.p,s.p,f);const b=new T;let y=0,a=1,v=0;return{group:e,agentPos:b,setPixelRatio(g){for(const x of[r.mat,c.mat,s.mat])x.uniforms.uPixelRatio.value=g},update(g,x,d){r.mat.uniforms.uOn.value=Math.min(1.3,d.flame)*(.55+.45*(1-d.converge*.5));const p=Math.max(0,Math.min(1,d.rewrite-1));p>.5&&y<=.5&&(v=0,a=1),y=p,v=Math.min(1,v+x*.09),a=Math.max(0,a-x*.12);const V=g*.55,j=Ae.radius*(1+v*.55+Math.sin(g*1.7)*.04*v);b.copy(u(V,j)),b.y+=v*.9,s.geo.attributes.position.setXYZ(0,b.x,b.y,b.z),s.geo.attributes.position.needsUpdate=!0,s.mat.uniforms.uOn.value=d.orbit,s.mat.uniforms.uHeat.value=Math.max(a,p),c.mat.uniforms.uOn.value=d.orbit,c.mat.uniforms.uPulse.value=p,c.mat.uniforms.uHead.value=(V/(Math.PI*2)%1+1)%1,c.p.visible=s.p.visible=d.orbit>.005;const K=h.uniforms.uGrow.value;for(let H=0;H<6;H++){const te=Math.max(0,Math.min(1,d.lift*6-H));K[H]=te*te*(3-2*te)*(d.crystals>0?1:0)}h.uniforms.uOn.value=d.crystals*(1-d.converge),h.uniforms.uTime.value=g,f.visible=d.crystals>.005},crystalTop:Io,dispose(){for(const g of[r,c,s])g.geo.dispose(),g.mat.dispose();M.dispose(),h.dispose()}}}const ei=`// The forge pass (after tone mapping) + the hacking layer's raster (2026-10-31): the picture sits behind
// slightly curved glass — barrel, a faint chromatic split toward the edges, scan lines, grain, a dark
// level and a vignette — and it warms up from a bright line when the boot gate switches off. Between
// chapters the signal tears: rows of the picture slip sideways and split into colour for a moment.
// Kept under the fire and the field: everything here frames them.
uniform sampler2D tDiffuse;
uniform vec2 uRes;
uniform float uTime;
uniform float uHeat;
uniform float uBlur;
uniform float uGrain;
uniform float uVignette;
uniform float uSat;
uniform float uFlare;
uniform float uTear;
uniform vec3 uTearColor;
uniform float uDive;
uniform float uZoom;
uniform vec2 uCenter;
uniform vec3 uDiveColor;
uniform float uLift;
uniform float uScan;
uniform float uScanPx;
uniform float uBarrel;
uniform float uCA;
uniform float uLevel;
uniform float uGamma;
uniform float uWarm;
uniform float uCrush;
uniform float uFringe;
uniform float uEdge;
varying vec2 vUv;
#include <noise_lib>

vec2 barrel(vec2 uv, float k) {
  vec2 c = uv * 2.0 - 1.0;
  c *= 1.0 + k * dot(c, c);
  return c * 0.5 + 0.5;
}

vec3 sampleCA(vec2 uv, vec2 off) {
  return vec3(
    texture2D(tDiffuse, uv + off).r,
    texture2D(tDiffuse, uv).g,
    texture2D(tDiffuse, uv - off).b
  );
}

void main() {
  vec2 suv = barrel(vUv, uBarrel);
  // the warm-up: the picture opens vertically from a bright line (1 = fully open)
  float open = smoothstep(0.0, 0.55, uWarm);
  float band = mix(0.006, 1.0, open);
  float lit = 1.0 - smoothstep(band * 0.5 - 0.004, band * 0.5 + 0.004, abs(suv.y - 0.5));
  vec2 uv = suv;
  uv.y = (suv.y - 0.5) / band + 0.5;

  float h = vnoise(vec2(uv.x * 40.0, uv.y * 8.0 - uTime * 3.0)) - 0.5;
  uv.x += h * uHeat;
  // the signal tear between chapters: rows slip sideways, decaying (uTear 0 → 1, −1 = none)
  float tear = 0.0;
  if (uTear >= 0.0) {
    float k = (1.0 - uTear) * (1.0 - uTear);
    float row = floor(suv.y * 36.0 + floor(uTime * 30.0));
    float r = hash12(vec2(row, floor(uTime * 24.0)));
    float slip = step(0.7, r);
    uv.x += (r - 0.5) * slip * k * 0.12;
    tear = slip * k;
  }
  vec2 dir = suv - 0.5;
  vec2 ca = dir * (uCA * (0.3 + length(dir) * 1.8) + tear * 10.0) / uRes;
  vec3 col;
  // the dive / the rewind: everything rushes past the flame (a radial streak toward it)
  if (uZoom > 0.0005) {
    vec2 d = uv - uCenter;
    col = vec3(0.0);
    for (int i = 0; i < 12; i++) {
      float kk = float(i) / 11.0;
      col += texture2D(tDiffuse, uCenter + d * (1.0 - kk * uZoom)).rgb;
    }
    col /= 12.0;
  } else {
    col = sampleCA(uv, ca);
    // a faint RGB fringe on the brightest things (the fire, the field's crests), as on a tube
    float hl = smoothstep(0.45, 1.1, dot(col, vec3(0.2126, 0.7152, 0.0722)));
    if (hl > 0.001) {
      vec2 f = vec2(uFringe, 0.0) / uRes;
      vec3 fr = sampleCA(uv, f * 2.0);
      col = mix(col, vec3(fr.r, col.g, fr.b), hl * 0.8);
    }
  }
  col += uTearColor * tear * 0.12;
  if (uBlur > 0.0005) {
    col += texture2D(tDiffuse, uv + vec2(0.0, uBlur)).rgb;
    col += texture2D(tDiffuse, uv - vec2(0.0, uBlur)).rgb;
    col /= 3.0;
  }
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  float warm = smoothstep(0.0, 0.25, col.r - col.b);
  col = mix(vec3(luma), col, mix(1.0, uSat, warm));
  // M6b: a flare lifts the light around the fire, not the whole frame
  vec2 fa = (vUv - uCenter) * vec2(uRes.x / uRes.y, 1.0);
  col *= 1.0 + uFlare * 0.3 * exp(-dot(fa, fa) * 4.0);
  // darker overall, highlights kept: a gentle toe on the mids, then the level
  col = pow(max(col, 0.0), vec3(uGamma)) * uLevel;
  // deepen the blacks: the low, brownish haze sinks toward black; the fire stays the main light
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  // M6b: during a hand-over the shadows are lifted instead of the whole frame — dim detail (the field's
  // dots, the far crest) comes up, black stays black and the bright parts are left as they are
  col *= mix(1.0 - uCrush * (1.0 - uLift), 1.0, smoothstep(0.004, 0.05, lum));
  col *= 1.0 + uLift * 4.0 * (1.0 - smoothstep(0.03, 0.35, lum));
  // through the fire: a white-hot core opens from the flame until it fills the frame
  if (uDive > 0.001) {
    vec2 a = (vUv - uCenter) * vec2(uRes.x / uRes.y, 1.0);
    // M6b: the core stays a local glow around the flame (never the whole frame), and the rest of the
    // frame darkens as the camera goes through — a warm ember, not a white or milky veil
    float core = exp(-dot(a, a) * mix(30.0, 2.4, uDive * uDive)) * uDive;
    col *= 1.0 - 0.72 * smoothstep(0.2, 0.95, uDive) * (1.0 - 0.6 * core);
    col += uDiveColor * core * 0.28;
    // the rush smears the flame's bloom across the frame: keep that light near the flame
    col *= 1.0 - 0.55 * smoothstep(0.1, 0.9, uDive) * smoothstep(0.12, 0.6, length(a));
  }
  // the raster: scan lines (stronger on the bright parts, as on a tube) + grain
  float s = 0.5 + 0.5 * sin(gl_FragCoord.y * 3.14159265 / uScanPx);
  col *= 1.0 - uScan * s * (1.0 - uDive);
  float g = hash12(gl_FragCoord.xy + fract(uTime * 7.31) * 113.0) - 0.5;
  col += g * uGrain;
  vec2 v = vUv - 0.5;
  col *= 1.0 - uVignette * (1.0 - uDive) * smoothstep(0.2, 0.85, dot(v, v) * 2.2);
  // outside the glass: black, with a soft edge
  vec2 e = smoothstep(vec2(0.0), vec2(uEdge), suv) * smoothstep(vec2(0.0), vec2(uEdge), 1.0 - suv);
  col *= e.x * e.y;
  // the glass: a rounded tube edge, slightly lit, so the curvature reads at the frame's edge
  vec2 cq = abs(suv - 0.5) * 2.0;
  float rim = pow(max(cq.x, cq.y), 18.0);
  col += uDiveColor * 0.025 * rim * step(cq.x, 1.0) * step(cq.y, 1.0);
  // the warm-up: the line burns bright, then the picture settles to its level
  col *= lit;
  col += uDiveColor * lit * (1.0 - open) * 0.25;
  col *= 1.0 + (1.0 - smoothstep(0.55, 1.0, uWarm)) * step(0.001, 1.0 - uWarm) * 0.15;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`,ue=oe.signal,$t=Z["bloom-strength"]*Be("bloom-gain"),ti=1.2;class oi{composer;bloom;forge;constructor(e,o,n){const r=new Jt(4,4,{type:Mo});this.composer=new Ao(e,r),this.composer.addPass(new So(o,n)),this.bloom=new Po(new Re(4,4),$t,Z["bloom-radius"],Z["bloom-threshold"]),this.composer.addPass(this.bloom),this.composer.addPass(new Ro),this.forge=new To(new N({vertexShader:oo,fragmentShader:ei,uniforms:{tDiffuse:{value:null},uRes:{value:new Re(4,4)},uTime:{value:0},uHeat:{value:0},uBlur:{value:0},uGrain:{value:Math.max(Be("grain"),ue.grain)},uVignette:{value:Math.max(Be("vignette"),ue.vignette)},uSat:{value:Be("ember-saturation")},uFlare:{value:0},uTear:{value:-1},uTearColor:{value:new bt(ue["tear-color"])},uDive:{value:0},uZoom:{value:0},uLift:{value:0},uCenter:{value:new Re(.5,.5)},uDiveColor:{value:new bt(Z["dive-color"])},uScan:{value:ue["scan-strength"]},uScanPx:{value:ue["scan-px"]},uBarrel:{value:ue.barrel},uCA:{value:ue["ca-px"]},uLevel:{value:ue.level},uGamma:{value:ue.gamma},uWarm:{value:1},uCrush:{value:ue.crush},uFringe:{value:ue.fringe},uEdge:{value:ue["edge-px"]}}})),this.composer.addPass(this.forge)}setSize(e,o,n){this.composer.setPixelRatio(n),this.composer.setSize(e,o),this.bloom.resolution.set(e*n/2,o*n/2),this.forge.uniforms.uRes.value.set(e*n,o*n),this.forge.uniforms.uScanPx.value=ue["scan-px"]*n}bloomOn=!0;bloomK=1;lastT=-1;setBloomEnabled(e){this.bloomOn=e,e&&(this.bloom.enabled=!0)}update(e){const o=Math.min(Math.abs(e.velocity),8),n=this.forge.uniforms,r=this.lastT<0?0:Math.min(.1,Math.max(0,e.time-this.lastT));this.lastT=e.time,this.bloomK=Math.min(1,Math.max(0,this.bloomK+(this.bloomOn?r:-r)/ti)),this.bloom.strength=$t*this.bloomK,!this.bloomOn&&this.bloomK===0&&(this.bloom.enabled=!1),n.uTime.value=e.time,n.uHeat.value=(Z["heat-shimmer"]+o*Z["heat-shimmer-velocity-gain"])*Be("heat-shimmer-gain")*e.heat,n.uBlur.value=o*Z["heat-shimmer-velocity-gain"],n.uFlare.value=e.flare,n.uTear.value=e.tear,n.uWarm.value=e.warm,n.uLift.value=e.lift,n.uDive.value=e.dive,n.uZoom.value=Math.max(e.dive*e.dive*Z["dive-zoom"],e.warp*Z["warp-zoom"]),n.uCenter.value.set(e.center[0],e.center[1])}render(){this.composer.render()}dispose(){this.composer.dispose(),this.bloom.dispose()}}const ai=38;class ii{level=0;frameMs=i["frame-budget-ms"];exhausted=!1;strikes=0;samples=[];lastChange=0;levels;locked;constructor(e,o){const n=typeof location<"u"?parseFloat(new URLSearchParams(location.search).get("rs")??""):NaN,r=Number.isFinite(n)?Math.min(1,Math.max(.4,n)):1,l=Math.min(e,i["max-pixel-ratio"])*r,c=i["void-resolution"];this.levels=[{pixelRatio:l,bloom:!0,voidScale:c,cloud:1},{pixelRatio:Math.min(l,1),bloom:!0,voidScale:c,cloud:1},{pixelRatio:Math.min(l,1),bloom:!1,voidScale:c,cloud:1},{pixelRatio:Math.min(l,1),bloom:!1,voidScale:c/2,cloud:1},{pixelRatio:Math.min(l,1),bloom:!1,voidScale:c/2,cloud:.5}],o==="low"&&(this.level=this.levels.length-1),this.locked=o==="low"||o==="high"}get current(){return this.levels[this.level]}pct(e){const o=[...this.samples].sort((n,r)=>n-r);return o[Math.min(o.length-1,Math.floor(o.length*e))]}upAt=-1/0;noUp=!1;sample(e,o){if(e<=0||e>1e3)return!1;const n=i["governor-window-frames"];if(this.samples.push(e),this.samples.length>n&&this.samples.shift(),this.samples.length<n)return!1;const r=this.pct(.5),l=Math.max(this.pct(.1),4);if(this.frameMs=r,this.locked||o-this.lastChange<2e3)return!1;const c=i["frame-budget-ms"],m=this.levels.length-1,u=r>c*1.15&&(r>l*1.3||r>ai);if(this.level===m&&u&&r>c*1.6)return this.strikes++,this.lastChange=o,this.samples.length=0,this.strikes>=2&&!this.exhausted?(this.exhausted=!0,!0):!1;if(u&&this.level<m)o-this.upAt<3e4&&(this.noUp=!0),this.level++;else if(!u&&!this.noUp&&this.level>0&&r<=l*1.08&&o-this.lastChange>12e3)this.level--,this.upAt=o;else return!1;return this.lastChange=o,this.samples.length=0,!0}}const ni=`// The collapse: one white-hot point that pulses once.
uniform vec3 uColor;
uniform float uOn;
uniform float uPulse;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d) * 2.0;
  if (r > 1.0) discard;
  float core = exp(-r * r * 18.0);
  float halo = exp(-r * r * 5.0) * 0.18 * (1.0 + uPulse);
  float a = (core + halo) * uOn;
  gl_FragColor = vec4(uColor * a * 1.2, a);
}
`,ri=`uniform float uSize; uniform float uPixelRatio; uniform float uPulse;
void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * mv;
gl_PointSize = min(uSize * uPixelRatio * (1.0 + uPulse * 0.6) * (6.0 / max(-mv.z, 0.1)) * 2.5, 40.0 * uPixelRatio); }`;async function fi(t){const{canvas:e,state:o}=t,n=new Fo({canvas:e,antialias:!1,alpha:!1,powerPreference:"high-performance",stencil:!1});n.toneMapping=zo,n.setClearColor(R(oe.color.bg),1);const r=new Qt,l=new Oo(o.fov,1,.05,200);r.add(new ko(R(i["rim-light-a"]),R(i["void-deep"]),.25));const c=new Wt(R(i["rim-light-a"]),.9);c.position.set(-4,3,-4);const m=new Wt(R(i["rim-light-b"]),.8);m.position.set(4,2,-3),r.add(c,m);const u=new Uo;r.background=u.target.texture;const s=Zo();r.add(s.points);const M=Xo();r.add(M.group);const h=Qo();r.add(h.group);const f=new T(0,h.centerY,0),b=new Lo(R(i["key-light"]),6,9,1.4);b.position.copy(f),r.add(b);const y=aa();r.add(y.group);const a=ca();r.add(...a.objects);const v=va();r.add(v.points);const g=ha();r.add(g.points);const x=ba();r.add(x.group);const d=new T,p=Aa(),V=k.field==="wave"?Ta(p):null,j=k.field==="space"?Ea(p):null,K=V??j;r.add(K.object);const H=Ka(p,k.field==="wave");r.add(H.object);const te=Wa();r.add(te.group);const G=Qa(f);r.add(G.group);const U=new T;let B=-1,J=-1;const Q=new X;Q.setAttribute("position",new P(new Float32Array(3),3));const A=new N({vertexShader:ri,fragmentShader:ni,transparent:!0,depthWrite:!1,blending:$,uniforms:{uColor:{value:R(i["operator-light-collapse"])},uOn:{value:0},uPulse:{value:0},uSize:{value:i["landing-size"]},uPixelRatio:{value:1}}}),F=new ie(Q,A);F.frustumCulled=!1,F.renderOrder=3,r.add(F);const w=new oi(n,r,l),O=new ii(window.devicePixelRatio||1,k.quality);let I=0,z=0;function ae(){const C=O.current;n.setPixelRatio(C.pixelRatio),n.setSize(I,z,!1),u.scale=C.voidScale,u.setSize(I*C.pixelRatio,z*C.pixelRatio),w.setSize(I,z,C.pixelRatio),w.setBloomEnabled(C.bloom),s.setFraction(C.cloud*(k.field==="wave"?.55:1)),K.setFraction(C.cloud),V?.setPixelRatio(C.pixelRatio,z),j?.setPixelRatio(C.pixelRatio),H.setPixelRatio(C.pixelRatio),te.setPixelRatio(C.pixelRatio),G.setPixelRatio(C.pixelRatio),A.uniforms.uPixelRatio.value=C.pixelRatio,a.setPixelRatio(C.pixelRatio),v.setPixelRatio(C.pixelRatio),v.setFraction(C.cloud),g.setPixelRatio(C.pixelRatio),g.setFraction(Math.max(.35,C.cloud))}function W(){I=e.clientWidth||window.innerWidth,z=e.clientHeight||window.innerHeight,l.aspect=I/Math.max(z,1),l.updateProjectionMatrix(),ae()}W(),window.addEventListener("resize",W),t.onProgress?.("shaders",.3),await n.compileAsync(r,l),t.onProgress?.("shaders",1);const Y={x:0,y:0,sx:0,sy:0},re=new Ho,_=new _o(new T(0,1,0),0),ve=new T,tt=new T;let ot=-10,at=0;const Ct=new Re,Mt=C=>(Ct.set(C.clientX/window.innerWidth*2-1,-(C.clientY/window.innerHeight)*2+1),re.setFromCamera(Ct,l),!re.ray.intersectPlane(_,ve)||ve.distanceTo(l.position)>60?!1:(tt.copy(ve),!0)),At=C=>{Y.x=C.clientX/window.innerWidth*2-1,Y.y=C.clientY/window.innerHeight*2-1,C.pointerType!=="touch"&&!k.reducedMotion&&Mt(C)&&(ot=E)},St=C=>{k.reducedMotion||!ge||C.target?.closest("a, button, input, select, textarea, label, [data-owns-keys], .menu, .gate, .hud")||Mt(C)&&(ot=E,p.uPulseC.value.copy(tt),p.uPulseCol.value.set(i["flame-core-color"]),p.uPulseV.value=i.world["pulse-speed"],B=0,ee=Math.max(ee,.5))};window.addEventListener("pointerdown",St,{passive:!0}),window.addEventListener("pointermove",At,{passive:!0});const fe=new T(o.camX,o.camY,o.camZ),xe=new T(o.lookX,o.lookY,o.lookZ),ye=new T,We=new T,Fe=new T,qe=new T,it=new T,no=new T(0,1,0),nt=new T,rt=new T,lt=new T,ut=new T,je=new T,he=i.clusters.map(C=>new T(...C.pos));let ze=o.fov;const st=new T,ct=new T,Pt=new T;let Ke=0,E=0,be=0,ge=!0,ee=0,ft=0,Rt=0,mt=-1,Ue=0,Tt=0,Oe=0,Ne=!1,Ye=0,Ft=0,zt=-10,vt=!1,dt=0,_e=0;const ro=["amplify","suppress","mix","collapse"],Ot={amplify:0,suppress:0,mix:0,collapse:0},lo=Kt("boot").flame,kt={v:t.awake?1:lo},Lt={v:t.awake||k.posterCapture?1:.32},pt=new Set,uo=7.3;function so(C){if(C.landOn>.5)return je.set(C.landX,C.landY,C.landZ);if(C.collapse<.001)return null;const se=[C.w0,C.w1,C.w2,C.w3,C.w4,C.w5,C.w6],q=Math.max(...se);let S=0;return je.set(0,0,0),se.forEach((ke,_t)=>{ke>=oe.composer.collapse["keep-ratio"]*q&&(je.addScaledVector(he[_t],ke),S+=ke)}),S>0?je.multiplyScalar(1/S):null}function Ht(C,se){if(!ge)return;const q=Math.min(se,100)/1e3;E=k.posterCapture?uo:E+q,be++,O.sample(se,performance.now())&&(O.exhausted?t.onStruggle?.():ae());const S=o;k.posterCapture&&Object.assign(S,Kt("hero"),Wo("hero-open")),ye.set(S.camX,S.camY,S.camZ),We.set(S.lookX,S.lookY,S.lookZ),Y.sx=He(Y.sx,k.posterCapture||k.reducedMotion?0:Y.x,3,q),Y.sy=He(Y.sy,k.posterCapture||k.reducedMotion?0:Y.y,3,q),Fe.subVectors(We,ye).normalize(),qe.crossVectors(Fe,no).normalize(),it.crossVectors(qe,Fe).normalize();const ke=Z["pointer-parallax"];if(ye.addScaledVector(qe,Y.sx*ke).addScaledVector(it,-Y.sy*ke*.6),!k.posterCapture&&!k.reducedMotion){const L=oe.scene["camera-drift"];ye.addScaledVector(qe,Math.sin(E*.13)*L).addScaledVector(it,Math.sin(E*.21)*L*.45)}if(ye.distanceTo(fe)>80||be<3||k.posterCapture)fe.copy(ye),xe.copy(We),ze=S.fov,st.set(0,0,0),ct.set(0,0,0),Ke=0;else{const L=Z["camera-spring"],D=Math.min(q,1/20);for(let me=Math.max(1,Math.round(q/D));me>0;me--)st.addScaledVector(Pt.subVectors(ye,fe),L*L*D).multiplyScalar(1-2*L*D),fe.addScaledVector(st,D),ct.addScaledVector(Pt.subVectors(We,xe),L*L*D).multiplyScalar(1-2*L*D),xe.addScaledVector(ct,D),Ke=(Ke+(S.fov-ze)*L*L*D)*(1-2*L*D),ze+=Ke*D}l.position.copy(fe),l.lookAt(xe),de.on=!k.posterCapture,de.camX=fe.x,de.camY=fe.y,de.camZ=fe.z,de.lookX=xe.x,de.lookY=xe.y,de.lookZ=xe.z,de.fov=ze,Math.abs(l.fov-ze)>.001&&(l.fov=ze,l.updateProjectionMatrix());for(const L of ro){const D=S[L];D>.35&&Ot[L]<=.35&&!k.reducedMotion&&be>3&&(ee=Math.max(ee,.45),Oe=1),Ot[L]=D}Oe=Math.max(0,Oe-q*.9),_e=Math.max(0,_e-q/4.5);const ht=k.reducedMotion?0:S.cutLift;p.uGlow.value=_e*.35+.65*ht,p.uGlowN.value=ht,ee=Math.max(0,ee-q/(Ut(Z.slow)/1e3));const Vt=l.position.distanceTo(f),Ve=ee*Math.min(1,Math.max(.25,(Vt-3)/9)),Ce=S.flame*kt.v*(1+Ve*(Z["flare-flame"]-1)),Et=S.dive>.02?1:Math.min(1,Math.max(.12,(Vt-2.2)/4.5)),Dt=h.update(E,Ce*Et,l,Ve*Et);b.intensity=7.5*Ce*Dt*(1+Ve*.8),p.uFireI.value=Math.min(2.6,Ce*Dt*(1+Ve*.35)+_e*.25),M.group.position.y=Math.sin(E*.4)*Z["brazier-drift"]*.3,M.group.rotation.y=Math.sin(E*.13)*Z["brazier-drift"],M.update(E,Ce,S.rewrite);const Le=u.material.uniforms;nt.copy(f).project(l),Le.uFlame.value.set(nt.x*.5+.5,nt.y*.5+.5),Le.uFlameI.value=Ce,Le.uExposure.value=S.exposure;const co=Math.atan2(Fe.x,-Fe.z);Le.uOffset.value.set(co*1.2+fe.x*.03,Math.asin(Math.max(-1,Math.min(1,Fe.y)))*1.2+fe.y*.02),(be%2===1||be<3)&&u.render(n,E);const ce=so(S);if(s.update(E,S,O.current.pixelRatio,z),ce&&S.landOn<.5){const L=s.material.uniforms;L.uLand.value.copy(ce),L.uLandOn.value=1}rt.copy(he[Math.round(S.amplifyTarget)]??he[0]),lt.copy(he[Math.round(S.mixA)]??he[0]),ut.copy(he[Math.round(S.mixB)]??he[0]),y.update({flame:f,amp:S.amplify,ampTarget:rt,mix:S.mix,mixA:lt,mixB:ut,camera:l,time:E}),a.update(E,S),v.update(E,Ce,fe);let Ee=0;ce&&S.collapse>.05?(d.copy(ce),Ee=S.collapse):S.mix>.05?(d.copy(lt).add(ut).multiplyScalar(.5),Ee=S.mix*.8):S.amplify>.05&&(d.copy(rt),Ee=S.amplify),g.update(E,Ce,Math.max(Oe,ee*.6),Ee>0?d:null,Math.min(1,Ee)),Sa(p,S,E,ce),Ye=He(Ye,Ne?1:0,Ne?1.6:3,q),Ye>p.uLik.value.z+.01&&p.uLik.value.set(Ft,zt,Ye,2.3),dt=He(dt,vt?1:0,2.5,q),p.uStray.value=Math.max(S.stray,dt);{const L=x.k;let D=-1;L.forEach((le,De)=>{le>.02&&(D<0||le>L[D])&&(D=De)});const me=p.uTl.value;for(let le=0;le<me.length;le++)me[le].set(0,0,0);if(D>=0){const le=Se(D,0,0);p.uLik.value.z<L[D]*.3&&p.uLik.value.set(le[0],le[2],L[D]*.3,4.4),et[D].nodes.slice(0,me.length).forEach((De,fo)=>{const Gt=Se(D,De.lx,De.lz);me[fo].set(Gt[0],Gt[2],L[D]*(De.dim?.45:.9))})}}if(at=He(at,E-ot<2.5?1:0,3,q),p.uCursor.value.lerp(tt,1-Math.exp(-8*q)),p.uCursorOn.value=at,J>=0&&(J=J>=1?-1:J+q/(oe.signal["tear-ms"]/1e3)),B>=0&&(B=B>8?-1:B+q),p.uPulseT.value=B,ce)U.copy(ce);else{U.set(0,0,0);const L=[S.w0,S.w1,S.w2,S.w3,S.w4,S.w5,S.w6],D=L.reduce((me,le)=>me+le,0)||1;L.forEach((me,le)=>U.addScaledVector(he[le],me/D))}if(te.update(E,q,U,f,S.prompt,S.trail),j?.setVector(te.position,Math.min(1,S.prompt*2)*(1-S.converge)),H.update(S.routes*(1-S.converge),S.route),G.update(E,q,S),x.update(E,q,S.delivery??-1)&&!k.reducedMotion){const L=Se(Math.round(S.delivery),0,0);p.uPulseC.value.set(L[0],0,L[2]),p.uPulseCol.value.set(i["flame-color"]),p.uPulseV.value=i.world["pulse-speed"],B=0,ee=Math.max(ee,.35)}S.collapse>.95&&Tt<=.95&&!k.reducedMotion&&(Ue=1),Tt=S.collapse,Ue=Math.max(0,Ue-q/(Z["composer-landing-pulse-ms"]/1e3)),A.uniforms.uOn.value=ce?Math.min(1,S.collapse*1.2):0,A.uniforms.uPulse.value=Math.sin(Ue*Math.PI),ce&&Q.attributes.position.setXYZ(0,ce.x,ce.y,ce.z),Q.attributes.position.needsUpdate=!0,ft=He(ft,E<mt?Rt:0,E<mt?6:2.5,q),n.toneMappingExposure=S.exposure,w.update({time:E,velocity:k.posterCapture?0:qo.value,heat:S.heat,flare:Ve,tear:J,dive:k.reducedMotion||k.posterCapture?0:S.dive,warp:ft,center:[Le.uFlame.value.x,Le.uFlame.value.y],warm:Lt.v,lift:ht}),w.render();for(const L of pt)L(q,E);be===2&&t.onProgress?.("first-frame",1),k.posterCapture&&be===40&&(document.documentElement.dataset.posterReady="1")}return Ze.ticker.add(Ht),e.addEventListener("webglcontextlost",C=>{C.preventDefault(),ge=!1,t.onLost?.()}),{canvas:e,setActive(C){ge=C},get qualityLevel(){return O.level},get qualityLevels(){return O.levels.length},get frameMs(){return O.frameMs},onFrame(C){return pt.add(C),()=>pt.delete(C)},pulse(C,se,q){k.reducedMotion||(p.uPulseC.value.set(...C),p.uPulseCol.value.set(se),p.uPulseV.value=q??i.world["pulse-speed"],B=0)},tear(){k.reducedMotion||!ge||(J=0,ee=Math.max(ee,.45),Oe=Math.max(Oe,.5))},crestAt(C,se){Ne=C!==null&&!k.reducedMotion,C!==null&&(Ft=C,zt=se??-10)},stray(C){vt=C&&!k.reducedMotion},delivery(){return x},handover(){k.reducedMotion||!ge||(p.uPulseC.value.set(0,0,0),p.uPulseCol.value.set(i["flame-color"]),p.uPulseV.value=i.world["pulse-speed"]*1.8,B=0,_e=.85,ee=Math.max(ee,.4),Ne=!1,vt=!1)},flare(C=1){k.reducedMotion||(ee=Math.max(ee,Math.min(1,C)))},warp(C,se){k.reducedMotion||!ge||(Rt=Math.max(0,Math.min(1,C)),mt=E+se/1e3)},ignite(){k.reducedMotion||!ge||(ee=1,p.uPulseC.value.set(0,0,0),p.uPulseCol.value.set(i["flame-core-color"]),p.uPulseV.value=i.world["ignite-speed"],B=0)},wake(){Ze.fromTo(Lt,{v:.32},{v:1,duration:oe.signal["warm-ms"]/1e3,ease:"power2.out"}),Ze.to(kt,{v:1,duration:(oe.motion["gate-exit-ms"]+Ut(oe.motion.cine))/1e3,ease:"power2.out"}),ee=1,p.uPulseC.value.set(0,0,0),p.uPulseCol.value.set(i["flame-core-color"]),p.uPulseV.value=i.world["ignite-speed"],B=0},dispose(){de.on=!1,Ze.ticker.remove(Ht),window.removeEventListener("resize",W),window.removeEventListener("pointermove",At),window.removeEventListener("pointerdown",St),u.dispose(),s.dispose(),M.dispose(),h.dispose(),y.dispose(),a.dispose(),v.dispose(),g.dispose(),x.dispose(),K.dispose(),H.dispose(),te.dispose(),G.dispose(),Q.dispose(),A.dispose(),w.dispose(),n.dispose()}}}export{fi as createRenderer};
