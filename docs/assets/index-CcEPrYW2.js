import{g as Qe}from"./motion-HcuoLYGZ.js";import{C as St,S as ho,W as Qt,a as eo,O as go,b as K,V as ze,M as ge,P as to,B as X,c as P,d as T,A as $,e as ne,G as Oe,f as Wt,D as at,L as wo,g as qt,I as xo,h as yo,Q as bo,E as Co,i as oo,j as Ao,k as Mo,l as So,m as bt,H as Po,n as Ro,R as To,U as Fo,o as zo,p as Oo,q as ko,r as Lo,s as Ho,t as _o,u as jt,v as Vo,w as Eo,x as Do}from"./three-D1rNlBhb.js";import{P as Pe,p as Nt,l as Go,S as it,s as Te,T as Bo,V as Ut,a as Io,O as Re,R as Wo,r as qo,c as jo,e as L,b as Kt,d as he,f as No,v as Uo}from"./index-DXbj4L3t.js";import{a as oe,h as Ie,e as Yt}from"./site.config-BLObtfzG.js";const ao=`varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Ko=`// The void: slow domain-warped fBm, nearly black; a faint warm falloff around the flame. No stars.
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
`,Yo=`// value noise + fBm, shared by the void and the flame (original, generic)
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
`;ho.noise_lib=Yo;const R=t=>new St(t),i=oe.scene,Z=oe.motion;function be(t){let e=t>>>0;return()=>{e=e+1831565813>>>0;let a=e;return a=Math.imul(a^a>>>15,a|1),a^=a+Math.imul(a^a>>>7,a|61),((a^a>>>14)>>>0)/4294967296}}function et(t){const e=Math.max(t(),1e-9);return Math.sqrt(-2*Math.log(e))*Math.cos(2*Math.PI*t())}const Ee=(t,e,a,n)=>t+(e-t)*(1-Math.exp(-a*n));class Zo{target=new Qt(4,4);material;scene=new eo;camera=new go(-1,1,1,-1,0,1);scale=i["void-resolution"];constructor(){this.material=new K({vertexShader:ao,fragmentShader:Ko,depthTest:!1,depthWrite:!1,uniforms:{uTime:{value:0},uDensity:{value:i["void-density"]},uHueA:{value:R(i["void-hue-a"])},uHueB:{value:R(i["void-hue-b"])},uDeep:{value:R(i["void-deep"])},uWarm:{value:R(i["flame-color"])},uOffset:{value:new ze},uFlame:{value:new ze(.5,.5)},uFlameI:{value:1},uAspect:{value:1},uExposure:{value:1}}}),this.scene.add(new ge(new to(2,2),this.material))}setSize(e,a){this.target.setSize(Math.max(2,Math.round(e*this.scale)),Math.max(2,Math.round(a*this.scale))),this.material.uniforms.uAspect.value=e/Math.max(a,1)}render(e,a){this.material.uniforms.uTime.value=a,e.setRenderTarget(this.target),e.render(this.scene,this.camera),e.setRenderTarget(null)}dispose(){this.target.dispose(),this.material.dispose()}}const Xo=`// The cloud of readings: every point belongs to a cluster (0..6) or the haze (-1). Each operator light
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
`,$o=`uniform vec3 uReading;
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
`;function Jo(){const t=i["cloud-count"],e=i["cloud-radius"],a=i.clusters,n=be(2654435769),l=new Float32Array(t*3),r=new Float32Array(t),s=new Float32Array(t),p=new Float32Array(t),c=Math.round(t*i["haze-fraction"]),u=i["cluster-spread"],A=i.world["cloud-center"];for(let o=0;o<t;o++){let v,g,x;if(o<c){const m=n()*Math.PI*2,d=e*Math.sqrt(n());v=A[0]+Math.cos(m)*d,g=.4+Math.abs(et(n))*1.6,x=A[2]+Math.sin(m)*d*.8,r[o]=-1}else{const m=a[o%a.length];v=m.pos[0]+et(n)*u,g=m.pos[1]+et(n)*u*.7,x=m.pos[2]+et(n)*u,r[o]=m.id}l[o*3]=v,l[o*3+1]=g,l[o*3+2]=x,s[o]=n(),p[o]=n()*Math.PI*2}const h=new X;h.setAttribute("position",new P(l,3)),h.setAttribute("aCluster",new P(r,1)),h.setAttribute("aJit",new P(s,1)),h.setAttribute("aPhase",new P(p,1));const f=new K({vertexShader:Xo,fragmentShader:$o,transparent:!0,depthWrite:!1,blending:$,uniforms:{uTime:{value:0},uDrift:{value:Z["cloud-drift"]},uBreathe:{value:Z["cloud-breathe"]},uSpread:{value:1},uSize:{value:i["reading-size"]},uPixelRatio:{value:1},uViewH:{value:900},uCloudLit:{value:.2},uW:{value:[...oe.composer.w0]},uC:{value:a.map(o=>new T(...o.pos))},uAmp:{value:0},uSup:{value:0},uMix:{value:0},uCol:{value:0},uAmpT:{value:oe.composer.amplify.target},uMixA:{value:1},uMixB:{value:oe.composer.mix.partner},uLand:{value:new T},uLandOn:{value:0},uGather:{value:i["amplify-gather"]},uOrder:{value:0},uTighten:{value:i["order-tighten"]},uPush:{value:i["suppress-push"]},uConv:{value:0},uFire:{value:new T(0,i["brazier-height"]+i["flame-height"]*.5,0)},uField:{value:1},uFR:{value:i.world["field-radius"]},uCalm:{value:0},uReading:{value:R(i["reading-color"])},uReadingLit:{value:R(i["reading-lit-color"])},uOpAmp:{value:R(i["operator-light-amplify"])},uOpSup:{value:R(i["operator-light-suppress"])},uOpMix:{value:R(i["operator-light-mix"])},uOpCol:{value:R(i["operator-light-collapse"])}}}),C=new Uint32Array(t);for(let o=0;o<t;o++)C[o]=o;for(let o=t-1;o>0;o--){const v=Math.floor(n()*(o+1));[C[o],C[v]]=[C[v],C[o]]}h.setIndex(new P(C,1));const b=new ne(h,f);return b.frustumCulled=!1,{points:b,material:f,setFraction(o){h.setDrawRange(0,Math.round(t*o))},update(o,v,g,x){const m=f.uniforms;m.uTime.value=o,m.uPixelRatio.value=g,m.uViewH.value=x,m.uCloudLit.value=v.cloudLit,m.uSpread.value=v.cloudSpread;const d=m.uW.value;d[0]=v.w0,d[1]=v.w1,d[2]=v.w2,d[3]=v.w3,d[4]=v.w4,d[5]=v.w5,d[6]=v.w6,m.uOrder.value=v.order,m.uAmp.value=v.amplify,m.uSup.value=v.suppress,m.uMix.value=v.mix,m.uCol.value=v.collapse,m.uAmpT.value=v.amplifyTarget,m.uMixA.value=v.mixA,m.uMixB.value=v.mixB,m.uLand.value.set(v.landX,v.landY,v.landZ),m.uLandOn.value=v.landOn,m.uConv.value=v.converge,m.uField.value=v.field,m.uCalm.value=v.calm},dispose(){h.dispose(),f.dispose()}}}function Qo(){const t=i["brazier-radius"],e=i["brazier-height"],a=new Oe,n=new Wt({color:R(i["brazier-iron"]),roughness:.78,metalness:.55,emissive:R(i["brazier-iron-lit"]),emissiveIntensity:.05,side:at}),l=[[.04,.6],[.3,.615],[.58,.68],[.8,.8],[.95,.94],[1,1],[.97,1.02],[.93,.99]],r=new ge(new wo(l.map(([b,o])=>new ze(b*t,o*e)),64),n),s=new ge(new qt(t*.05,t*.08,e*.6,16),n);s.position.y=e*.3;const p=new qt(t*.03,t*.045,t*.75,8);for(let b=0;b<3;b++){const o=b/3*Math.PI*2,v=new ge(p,n);v.position.set(Math.cos(o)*t*.28,t*.12,Math.sin(o)*t*.28),v.rotation.set(Math.sin(o)*1.15,0,-Math.cos(o)*1.15),a.add(v)}a.add(r,s);const c=new Wt({color:R(i["coal-color"]),emissive:R(i["coal-color"]),emissiveIntensity:1,roughness:.9,metalness:0}),u=i["coal-count"],A=new xo(new yo(t*.075,0),c,u),h=be(7),f=new oo,C=new bo;for(let b=0;b<u;b++){const o=Math.sqrt(h())*t*.78,v=h()*Math.PI*2,g=e*(.66+o/t*.2)+h()*e*.06;C.setFromEuler(new Co(h()*3,h()*3,h()*3));const x=.6+h()*.8;f.compose(new T(Math.cos(v)*o,g,Math.sin(v)*o),C,new T(x,x*.7,x)),A.setMatrixAt(b,f)}return a.add(A),{group:a,update(b,o,v=0){const g=Math.min(2,Math.max(0,v));c.emissiveIntensity=.5+o*(.9+.15*Math.sin(b*1.7))+g*.25,n.emissiveIntensity=.02+o*.06+g*.16},dispose(){n.dispose(),c.dispose(),r.geometry.dispose(),s.geometry.dispose(),p.dispose(),A.geometry.dispose()}}}const ea=`
varying vec3 vLocal;
void main() {
  vLocal = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,ta=`
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
}`;function oa(){const t=i["flame-height"]*1.55,e=i["flame-height"]*.62,a=i["brazier-height"]*.78,n=new Oe,l=new Ao(e*2,t,e*2);l.translate(0,t/2,0);const r=new K({vertexShader:ea,fragmentShader:ta,transparent:!0,depthWrite:!1,blending:$,side:Mo,uniforms:{uTime:{value:0},uIntensity:{value:1},uFlare:{value:0},uFlicker:{value:Z["flame-flicker"]},uSteps:{value:24},uCam:{value:new T},uHalf:{value:new T(e,t/2,e)},uFlame:{value:R(i["flame-color"])},uCore:{value:R(i["flame-core-color"])},uDeep:{value:R(i["coal-color"])}}}),s=new ge(l,r);s.renderOrder=2,s.frustumCulled=!1,n.position.y=a,n.add(s);const p=new T,c=new T;return{group:n,centerY:a+t*.32,update(u,A,h,f=0){const C=1+Math.sin(u*13.1)*.04*Z["flame-flicker"]*4+Math.sin(u*7.3)*.03+Math.sin(u*2.1+Math.sin(u*.7)*2)*.05,b=.86+.1*Math.min(1.6,A)+f*.3+Math.sin(u*1.3)*.05;n.scale.set(1+f*.15,b,1+f*.15),n.updateMatrixWorld(),p.copy(h.position),s.worldToLocal(p),r.uniforms.uCam.value.copy(p);const o=h.position.distanceTo(s.getWorldPosition(c));return r.uniforms.uSteps.value=o<2.5?6:o<5?12:24,r.uniforms.uTime.value=u,r.uniforms.uFlare.value=f,r.uniforms.uIntensity.value=Math.min(2.2,A*C)*1.15,C},dispose(){l.dispose(),r.dispose()}}}const aa=`varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,ia=`// An operator light: a soft beam from the flame to a cluster, in the operator's colour. Additive.
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
`,Zt=5,na=14;function ra(){const t=new Oe,e=new to(1,1);e.translate(.5,0,0);const a=f=>{const C=new K({vertexShader:aa,fragmentShader:ia,transparent:!0,depthWrite:!1,blending:$,side:at,uniforms:{uColor:{value:R(f)},uStrength:{value:0},uTime:{value:0}}}),b=new ge(e,C);return b.matrixAutoUpdate=!1,b.frustumCulled=!1,b.renderOrder=1,t.add(b),{mesh:b,mat:C}},n=a(i["operator-light-amplify"]),l=a(i["operator-light-mix"]),r=a(i["operator-light-mix"]),s=new T,p=new T,c=new T,u=new T,A=new oo;function h(f,C,b,o,v,g,x){s.subVectors(b,C);const m=Math.min(1,Math.max(0,p.subVectors(g.position,C).dot(s)/Math.max(s.lengthSq(),1e-6))),d=g.position.distanceTo(c.copy(C).addScaledVector(s,m));if(o*=Math.min(1,Math.max(0,(d-Zt)/(na-Zt))),f.mat.uniforms.uStrength.value=o,f.mat.uniforms.uTime.value=x,f.mesh.visible=o>.002,!f.mesh.visible)return;s.subVectors(b,C);const V=s.length();s.normalize(),u.subVectors(g.position,C).normalize(),p.crossVectors(u,s).normalize(),c.crossVectors(s,p),A.makeBasis(s.clone().multiplyScalar(V),p.clone().multiplyScalar(v),c),A.setPosition(C),f.mesh.matrix.copy(A),f.mesh.matrixWorldNeedsUpdate=!0}return{group:t,update(f){h(n,f.flame,f.ampTarget,f.amp,.9,f.camera,f.time),h(l,f.flame,f.mixA,f.mix,.7,f.camera,f.time),h(r,f.flame,f.mixB,f.mix,.7,f.camera,f.time)},dispose(){e.dispose(),[n,l,r].forEach(f=>f.mat.dispose())}}}const Xt=`attribute float aA; uniform float uSize; uniform float uPixelRatio; varying float vA;
void main(){ vA = aA; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * mv;
gl_PointSize = min(uSize * uPixelRatio * (6.0 / max(-mv.z, 0.1)) * 2.5, 40.0 * uPixelRatio); }`,la=`uniform vec3 uColor; uniform vec3 uHot; uniform float uPhase; uniform float uOn; varying float vA;
void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0; if (r > 1.0) discard;
float lit = clamp(uPhase - vA, 0.0, 1.0); float now = lit * (1.0 - clamp(uPhase - vA - 1.0, 0.0, 1.0));
float core = exp(-r * r * 14.0); float ring = smoothstep(0.62, 0.7, r) * (1.0 - smoothstep(0.78, 0.86, r));
float a = (core * (0.18 + 0.82 * lit) + ring * (0.25 + 0.5 * now)) * uOn;
gl_FragColor = vec4(mix(uColor, uHot, now) * a, a); }`,ua=`uniform vec3 uColor; uniform vec3 uHot; uniform float uDraw; uniform float uTime; varying float vA;
void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0; if (r > 1.0) discard;
if (vA > uDraw) discard;
float head = fract(uTime * 0.35); float dist = abs(vA - head); dist = min(dist, 1.0 - dist);
float hot = exp(-dist * dist * 900.0) * step(0.999, uDraw);
float a = exp(-r * r * 9.0) * (0.55 + 0.9 * hot);
gl_FragColor = vec4(mix(uColor, uHot, hot) * a, a); }`,sa=`uniform vec3 uColor; uniform vec3 uHot; uniform float uLift; uniform float uTime; varying float vA;
varying float vF; void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0; if (r > 1.0) discard;
float a = exp(-r * r * 10.0) * uLift * (1.0 - vF) * smoothstep(0.0, 0.08, vF);
gl_FragColor = vec4(mix(uHot, uColor, vF) * a, a); }`,ca=`attribute float aA; attribute float aSpeed; uniform float uSize; uniform float uPixelRatio;
uniform float uTime; uniform float uRise; varying float vA; varying float vF;
void main(){ vA = aA; float f = fract(aA + uTime * aSpeed); vF = f;
vec3 p = position; p.y += f * uRise; p.x += sin(uTime * 1.3 + aA * 40.0) * 0.06 * f; p.z += cos(uTime * 1.1 + aA * 31.0) * 0.06 * f;
vec4 mv = modelViewMatrix * vec4(p,1.0); gl_Position = projectionMatrix * mv;
gl_PointSize = min(uSize * uPixelRatio * (1.0 - f * 0.6) * (6.0 / max(-mv.z, 0.1)) * 2.5, 40.0 * uPixelRatio); }`,fa=`attribute float aA; attribute float aH; uniform float uSize; uniform float uPixelRatio;
varying float vA; varying float vH; void main(){ vA = aA; vH = aH; vec4 mv = modelViewMatrix * vec4(position,1.0);
gl_Position = projectionMatrix * mv; gl_PointSize = min(uSize * uPixelRatio * (6.0 / max(-mv.z, 0.1)) * 2.5, 40.0 * uPixelRatio); }`,va=`uniform vec3 uColor; uniform vec3 uHot; uniform float uPhase; uniform float uOn; uniform float uTime;
varying float vA; varying float vH; void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0; if (r > 1.0) discard;
float lit = clamp(uPhase - vA, 0.0, 1.0); float now = lit * (1.0 - clamp(uPhase - vA - 1.0, 0.0, 1.0));
float flow = 0.5 + 0.5 * sin(vH * 30.0 - uTime * 4.0);
float a = exp(-r * r * 6.0) * (0.3 + 0.6 * lit + 0.8 * now * flow) * (0.35 + 0.65 * vH) * uOn;
gl_FragColor = vec4(mix(uColor, uHot, now * vH) * a, a); }`;function tt(t,e,a){return new K({vertexShader:t,fragmentShader:e,transparent:!0,depthWrite:!1,blending:$,uniforms:{uPixelRatio:{value:1},...a}})}function ma(){const t=R(i["flame-color"]),e=R(i["flame-core-color"]),a=new X,n=new Float32Array(Pe*3),l=new Float32Array(Pe);for(let S=0;S<Pe;S++)n.set(Nt(S),S*3),l[S]=S;a.setAttribute("position",new P(n,3)),a.setAttribute("aA",new P(l,1));const r=tt(Xt,la,{uColor:{value:t},uHot:{value:e},uPhase:{value:0},uOn:{value:0},uSize:{value:8}}),s=new ne(a,r),p=70,c=new X,u=new Float32Array(Pe*p*3),A=new Float32Array(Pe*p),h=new Float32Array(Pe*p);for(let S=0;S<Pe;S++){const F=Nt(S);for(let w=0;w<p;w++){const O=w/(p-1);u.set([F[0],F[1]*O,F[2]],(S*p+w)*3),A[S*p+w]=S,h[S*p+w]=O}}c.setAttribute("position",new P(u,3)),c.setAttribute("aA",new P(A,1)),c.setAttribute("aH",new P(h,1));const f=tt(fa,va,{uColor:{value:t},uHot:{value:e},uPhase:{value:0},uOn:{value:0},uSize:{value:2.2},uTime:{value:0}}),C=new ne(c,f),b=160,o=new X,v=new Float32Array(b*3),g=new Float32Array(b);for(let S=0;S<b;S++){const F=S/(b-1);v.set(Go(F),S*3),g[S]=F}o.setAttribute("position",new P(v,3)),o.setAttribute("aA",new P(g,1));const x=tt(Xt,ua,{uColor:{value:t},uHot:{value:e},uDraw:{value:0},uTime:{value:0},uSize:{value:3.4}}),m=new ne(o,x),d=140,V=i["brazier-radius"],j=i["brazier-height"],N=be(11),H=new X,te=new Float32Array(d*3),B=new Float32Array(d),U=new Float32Array(d);for(let S=0;S<d;S++){const F=Math.sqrt(N())*V*.7,w=N()*Math.PI*2;te.set([Math.cos(w)*F,j*.75,Math.sin(w)*F],S*3),B[S]=N(),U[S]=.12+N()*.22}H.setAttribute("position",new P(te,3)),H.setAttribute("aA",new P(B,1)),H.setAttribute("aSpeed",new P(U,1));const I=tt(ca,sa,{uColor:{value:t},uHot:{value:e},uLift:{value:0},uTime:{value:0},uRise:{value:2.6},uSize:{value:.7}}),J=new ne(H,I),Q=[s,m,J,C];return Q.forEach((S,F)=>{S.frustumCulled=!1,S.renderOrder=2+F}),{objects:Q,setPixelRatio(S){for(const F of[r,x,I,f])F.uniforms.uPixelRatio.value=S},update(S,F){r.uniforms.uPhase.value=F.phase,r.uniforms.uOn.value=Math.min(1,F.phase*4),s.visible=F.phase>.001,f.uniforms.uPhase.value=F.phase,f.uniforms.uOn.value=Math.min(1,F.phase*4),f.uniforms.uTime.value=S,C.visible=s.visible,x.uniforms.uDraw.value=F.loopback,x.uniforms.uTime.value=S,m.visible=F.loopback>.001,I.uniforms.uLift.value=F.lift,I.uniforms.uTime.value=S,J.visible=F.lift>.001},dispose(){for(const S of[a,o,H,c])S.dispose();for(const S of[r,x,I,f])S.dispose()}}}const da=`attribute float aSeed; uniform float uSize; uniform float uPixelRatio; uniform float uTime;
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
  gl_PointSize = d < 3.0 ? 0.0 : min(uSize * uPixelRatio * (6.0 / d) * 2.5, 28.0 * uPixelRatio); }`,pa=`uniform vec3 uAsh; uniform vec3 uEmber; uniform float uOpacity; varying float vNear; varying float vHeat;
varying float vSeed; void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0; if (r > 1.0) discard;
  // near = a soft bokeh disc with a faint rim; far = a small bright speck
  float disc = smoothstep(1.0, 0.75, r) * (0.55 + 0.45 * smoothstep(0.55, 0.92, r));
  float speck = exp(-r * r * 8.0);
  float a = mix(speck, disc * 0.45, vNear) * uOpacity * (0.25 + 0.75 * vHeat) * (0.6 + 0.4 * vSeed);
  vec3 c = mix(uAsh, uEmber, vHeat);
  gl_FragColor = vec4(c * a, a); }`;function ha(){const t=i.motes,e=be(23),a=new Float32Array(t.count*3),n=new Float32Array(t.count);for(let p=0;p<t.count;p++)a.set([(e()-.5)*t.radius*2,(e()-.5)*t.radius,(e()-.5)*t.radius*2],p*3),n[p]=e();const l=new X;l.setAttribute("position",new P(a,3)),l.setAttribute("aSeed",new P(n,1));const r=new K({vertexShader:da,fragmentShader:pa,transparent:!0,depthWrite:!1,blending:$,uniforms:{uSize:{value:t.size},uPixelRatio:{value:1},uTime:{value:0},uDrift:{value:t.drift},uOpacity:{value:t.opacity},uCam:{value:new T},uBox:{value:t.radius*2},uFlame:{value:[0,i["brazier-height"]+i["flame-height"]/2,0]},uAsh:{value:R(i["reading-lit-color"])},uEmber:{value:R(i["flame-color"])}}}),s=new ne(l,r);return s.frustumCulled=!1,s.renderOrder=6,{points:s,setPixelRatio(p){r.uniforms.uPixelRatio.value=p},setFraction(p){l.setDrawRange(0,Math.max(0,Math.round(t.count*p)))},update(p,c,u){r.uniforms.uTime.value=p,r.uniforms.uCam.value.copy(u),r.uniforms.uOpacity.value=t.opacity*(.5+.5*Math.min(1.2,c))},dispose(){l.dispose(),r.dispose()}}}const We=oe.scene.embers,ga=`
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
}`,wa=`
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
}`;function xa(){const t=We.count,e=be(932837),a=new Float32Array(t*4);for(let c=0;c<t*4;c++)a[c]=e();const n=new X;n.setAttribute("position",new P(new Float32Array(t*3),3)),n.setAttribute("aSeed",new P(a,4));const l=new T(0,i["brazier-height"]*.95,0),r=new K({vertexShader:ga,fragmentShader:wa,transparent:!0,depthWrite:!1,blending:$,uniforms:{uTime:{value:0},uRate:{value:We.rate},uRise:{value:We.rise},uSpread:{value:We.spread},uSize:{value:We.size},uPixelRatio:{value:1},uFlame:{value:1},uBurst:{value:0},uBase:{value:l},uPull:{value:new T},uPullK:{value:0},uHot:{value:R(i["flame-core-color"])},uEmber:{value:R(i["flame-color"])},uAsh:{value:R(i["coal-color"])}}}),s=new ne(n,r);s.frustumCulled=!1,s.renderOrder=4;const p=r.uniforms;return{points:s,setPixelRatio(c){p.uPixelRatio.value=c},setFraction(c){n.setDrawRange(0,Math.round(t*c))},update(c,u,A,h,f){p.uTime.value=c,p.uFlame.value=u,p.uBurst.value=A,h&&p.uPull.value.copy(h),p.uPullK.value=h?f:0},dispose(){n.dispose(),r.dispose()}}}const Fe=it.length,ya=`
attribute vec2 aCorner;
attribute vec3 aCenter;
attribute vec2 aSize;
attribute float aShape;
attribute float aDim;
uniform float uK[${Fe}];
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
}`,ba=`
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
}`,Ca=`
attribute vec2 aA;
attribute vec2 aB;
attribute vec2 aEnd;
attribute float aShape;
attribute float aDim;
attribute float aS0;
attribute float aLen;
attribute float aTotal;
attribute float aRing;
uniform float uK[${Fe}];
uniform float uG[${Fe}];
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
}`,Aa=`
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
}`;function Ma(){const t=new Oe,e=[],a=[],n=[],l=[],r=[],s=[];let p=0;it.forEach((S,F)=>S.nodes.forEach(w=>{const O=Te(F,w.lx,w.lz);for(const[W,z]of[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]])e.push(W,z),a.push(O[0],0,O[2]),n.push(w.w,w.h),l.push(F),r.push(w.dim??0);s.push(p,p+1,p+2,p,p+2,p+3),p+=4}));const c=new X;c.setAttribute("position",new P(new Float32Array(a),3)),c.setAttribute("aCorner",new P(new Float32Array(e),2)),c.setAttribute("aCenter",new P(new Float32Array(a),3)),c.setAttribute("aSize",new P(new Float32Array(n),2)),c.setAttribute("aShape",new P(new Float32Array(l),1)),c.setAttribute("aDim",new P(new Float32Array(r),1)),c.setIndex(s);const u=new Array(Fe).fill(0),A=new Array(Fe).fill(0),h={uTime:{value:0},uK:{value:u},uFlame:{value:R(i["flame-color"])},uHot:{value:R(i["flame-core-color"])}},f=new K({vertexShader:ya,fragmentShader:ba,transparent:!0,depthWrite:!1,blending:$,side:at,uniforms:{...h,uTilt:{value:Bo},uCore:{value:R(i.world["field-crest-color"])}}}),C=new ge(c,f);C.frustumCulled=!1,C.renderOrder=5;const b=[],o=[],v=[],g=[],x=[],m=[],d=[],V=[],j=[],N=[];let H=0;const te=(S,F,w,O,W,z,ae)=>{const q=Math.hypot(w[0]-F[0],w[2]-F[2]);for(const[Y,le]of[[0,-1],[1,-1],[1,1],[0,1]])b.push(F[0],F[2]),o.push(w[0],w[2]),v.push(Y,le),g.push(S),x.push(z),m.push(O),d.push(q),V.push(W),j.push(ae);return N.push(H,H+1,H+2,H,H+2,H+3),H+=4,q};it.forEach((S,F)=>{const w=S.id==="persona",O=S.trails.map(_=>Math.hypot(_.to[0]-_.from[0],_.to[1]-_.from[1])),W=w?Math.max(...O):O.reduce((_,me)=>_+me,0);let z=0;S.trails.forEach((_,me)=>{te(F,Te(F,..._.from),Te(F,..._.to),w?0:z,W,_.dim??0,0),z+=O[me]});const ae=64,q=_=>{const me=_/ae*Math.PI*2;return Te(F,Math.cos(me)*Ut,Math.sin(me)*Ut*Io)};let Y=0;for(let _=0;_<ae;_++)Y+=Math.hypot(q(_+1)[0]-q(_)[0],q(_+1)[2]-q(_)[2]);let le=0;for(let _=0;_<ae;_++)le+=te(F,q(_),q(_+1),le,Y,0,1)});const B=new X,U=S=>new Float32Array(S);B.setAttribute("position",new P(new Float32Array(H/1*3),3)),B.setAttribute("aA",new P(U(b),2)),B.setAttribute("aB",new P(U(o),2)),B.setAttribute("aEnd",new P(U(v),2)),B.setAttribute("aShape",new P(U(g),1)),B.setAttribute("aDim",new P(U(x),1)),B.setAttribute("aS0",new P(U(m),1)),B.setAttribute("aLen",new P(U(d),1)),B.setAttribute("aTotal",new P(U(V),1)),B.setAttribute("aRing",new P(U(j),1)),B.setIndex(N);const I=new K({vertexShader:Ca,fragmentShader:Aa,transparent:!0,depthWrite:!1,blending:$,side:at,uniforms:{...h,uG:{value:A},uW:{value:.2},uRingCol:{value:R(i.world["field-crest-color"])}}}),J=new ge(B,I);J.frustumCulled=!1,J.renderOrder=4,t.add(J,C);let Q=-1;return{group:t,k:u,g:A,update(S,F,w){h.uTime.value=S,Q=Math.round(w);let O=0;for(let z=0;z<Fe;z++)z!==Q&&(O=Math.max(O,u[z]));let W=!1;for(let z=0;z<Fe;z++)z===Q&&O<.3?(u[z]===0&&(W=!0),u[z]=Math.min(1,u[z]+F*1.25)):z!==Q&&(u[z]=Math.max(0,u[z]-F*2.2)),A[z]=u[z]>.9&&z===Q?Math.min(1,A[z]+F*.7):Math.max(0,A[z]-F*3);return W},dispose(){c.dispose(),B.dispose(),f.dispose(),I.dispose()}}}const re=i.world,qe=`
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
`,Sa=re.stations.map(t=>new T(...t)),Pa=re.crystals.map(t=>new T(...t));function Ra(){const t=new T(0,i["brazier-height"]+i["flame-height"]*.5,0);return{uTime:{value:0},uW:{value:[...oe.composer.w0]},uC:{value:i.clusters.map(e=>new T(...e.pos))},uAmp:{value:0},uSup:{value:0},uMix:{value:0},uCol:{value:0},uAmpT:{value:oe.composer.amplify.target},uMixA:{value:1},uMixB:{value:oe.composer.mix.partner},uLand:{value:new T},uLandOn:{value:0},uCalm:{value:0},uField:{value:0},uConv:{value:0},uFire:{value:t},uFireI:{value:1},uFA:{value:re["field-amp"]},uFK:{value:re["field-wave-k"]},uFS:{value:re["field-wave-speed"]},uCH:{value:re["field-cluster-height"]},uCS:{value:re["field-cluster-sigma"]},uNear:{value:re["field-near-fire"]},uFR:{value:re["field-radius"]},uFC:{value:new T(...re["field-center"])},uS:{value:Sa},uPhase:{value:0},uCr:{value:Pa},uLift:{value:0},uCrys:{value:0},uOrb:{value:new T(...Re.center)},uOrbR:{value:Re.radius},uOrbit:{value:0},uRewrite:{value:0},uCursor:{value:new T},uCursorOn:{value:0},uRead:{value:0},uGlow:{value:0},uGlowN:{value:0},uRings:{value:0},uLik:{value:new So(0,-12,0,3)},uScatter:{value:0},uStray:{value:0},uTl:{value:Array.from({length:6},()=>new T)},uPulseC:{value:new T},uPulseT:{value:-1},uPulseV:{value:re["pulse-speed"]},uPulseCol:{value:R(i["operator-light-amplify"])},uFieldColor:{value:R(re["field-color"])},uFieldLit:{value:R(re["field-lit-color"])},uCrest:{value:R(re["field-crest-color"])},uOpAmp:{value:R(i["operator-light-amplify"])},uOpSup:{value:R(i["operator-light-suppress"])},uOpMix:{value:R(i["operator-light-mix"])},uOpCol:{value:R(i["operator-light-collapse"])}}}function Ta(t,e,a,n){t.uTime.value=a;const l=t.uW.value;l[0]=e.w0,l[1]=e.w1,l[2]=e.w2,l[3]=e.w3,l[4]=e.w4,l[5]=e.w5,l[6]=e.w6,t.uAmp.value=e.amplify,t.uSup.value=e.suppress,t.uMix.value=e.mix,t.uCol.value=e.collapse,t.uAmpT.value=e.amplifyTarget,t.uMixA.value=e.mixA,t.uMixB.value=e.mixB,n&&t.uLand.value.copy(n),t.uLandOn.value=n?1:0,t.uCalm.value=e.calm,t.uField.value=e.field,t.uConv.value=e.converge,t.uPhase.value=e.phase,t.uLift.value=e.lift,t.uCrys.value=e.crystals,t.uOrbit.value=e.orbit,t.uRewrite.value=e.rewrite,t.uRead.value=e.readings,t.uRings.value=e.rings,t.uScatter.value=e.scatter,t.uStray.value=e.stray,t.uLik.value.set(e.crestX,e.crestZ,e.crest,e.crestW)}const ot=i.world,Fa=`
${qe}
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
}`,za=`
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
}`;function Oa(t){const e=ot["field-radius"],a=ot["field-spacing"],[n,,l]=ot["field-center"],r=a*Math.sqrt(3)/2,s=be(27750862),p=[];for(let o=-Math.ceil(e/r);o<=Math.ceil(e/r);o++){const v=o*r,g=o%2?a/2:0;for(let x=-e;x<=e;x+=a){const m=x+g+(s()-.5)*a*.45,d=v+(s()-.5)*a*.45;m*m+d*d<=e*e&&p.push(n+m,0,l+d)}}const c=p.length/3,u=be(85925405),A=new Float32Array(c);for(let o=0;o<c;o++)A[o]=u();const h=new X;h.setAttribute("position",new P(new Float32Array(p),3)),h.setAttribute("aSeed",new P(A,1));const f=new Uint32Array(c);for(let o=0;o<c;o++)f[o]=o;for(let o=c-1;o>0;o--){const v=Math.floor(u()*(o+1));[f[o],f[v]]=[f[v],f[o]]}h.setIndex(new P(f,1));const C=new K({vertexShader:Fa,fragmentShader:za,transparent:!0,depthWrite:!1,blending:$,uniforms:{...t,uSize:{value:ot["field-point-size"]},uEmber:{value:R(i["flame-color"])},uPixelRatio:{value:1},uViewH:{value:900}}}),b=new ne(h,C);return b.frustumCulled=!1,b.renderOrder=0,{object:b,count:c,setPixelRatio(o,v){C.uniforms.uPixelRatio.value=o,C.uniforms.uViewH.value=v},setFraction(o){h.setDrawRange(0,Math.round(c*o))},dispose(){h.dispose(),C.dispose()}}}const Ct=i.world,ka=`
${qe}
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
}`,La=`
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
}`,Ha=`
${qe}
uniform float uPixelRatio;
varying float vA;
void main() {
  vec3 p = converge(position, 0.5);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float d = max(-mv.z, 0.1);
  vA = reveal(length(position.xz)).x * exp(-max(d - 20.0, 0.0) / 30.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = min(2.4 * uPixelRatio * (16.0 / d), 5.0 * uPixelRatio);
}`,_a=`
uniform vec3 uCrest;
varying float vA;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d) * 4.0;
  if (r > 1.0) discard;
  float a = (1.0 - r) * 0.7 * vA;
  gl_FragColor = vec4(uCrest * a, a) * smoothstep(0.85, 1.0, uField);
}`,Va=`
${qe}
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
}`,Ea=`
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
}`,Da=`
attribute float aS;
varying float vS;
void main() { vS = aS; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,Ga=`
uniform vec3 uColor;
uniform float uOn;
uniform float uDash;
varying float vS;
void main() {
  float dash = uDash > 0.5 ? step(0.5, fract(vS * 14.0)) : 1.0;
  float a = uOn * dash * (uDash > 0.5 ? 0.45 : 0.95);
  gl_FragColor = vec4(uColor * a, a);
}`;function Ba(t){const e=new Oe,[a,,n]=Ct["field-center"],l=Ct["space-grid-step"],r=40,s=[],p=[],c=(w,O,W)=>{const z=Math.max(1,Math.ceil(Math.hypot(O[0]-w[0],O[1]-w[1],O[2]-w[2])/.8));for(let ae=0;ae<z;ae++){const q=ae/z,Y=(ae+1)/z;s.push(...w.map((le,_)=>le+(O[_]-le)*q),...w.map((le,_)=>le+(O[_]-le)*Y)),p.push(W,W)}};for(let w=-r;w<=r;w+=l){const O=Math.abs(Math.round(w/l))%5===0?1:0;c([a+w,.01,n-r],[a+w,.01,n+r],O),c([a-r,.01,n+w],[a+r,.01,n+w],O)}const u=[a,.02,n+2],A=Ct["space-axis-length"];c([u[0]-A,u[1],u[2]],[u[0]+A,u[1],u[2]],2),c([u[0],u[1],u[2]+A],[u[0],u[1],u[2]-A],2),c([u[0],u[1],u[2]],[u[0],u[1]+A*.7,u[2]],2);const h=new X;h.setAttribute("position",new P(new Float32Array(s),3)),h.setAttribute("aK",new P(new Float32Array(p),1));const f=new K({vertexShader:ka,fragmentShader:La,transparent:!0,depthWrite:!1,blending:$,uniforms:{...t,uStrength:{value:1}}}),C=new bt(h,f);C.frustumCulled=!1,e.add(C);const b=[];for(let w=-A;w<=A;w++)w!==0&&(b.push(u[0]+w,u[1],u[2],u[0],u[1],u[2]-w),w>0&&w<=A*.7&&b.push(u[0],u[1]+w,u[2]));const o=new X;o.setAttribute("position",new P(new Float32Array(b),3));const v=new K({vertexShader:Ha,fragmentShader:_a,transparent:!0,depthWrite:!1,blending:$,uniforms:{...t,uPixelRatio:{value:1}}}),g=new ne(o,v);g.frustumCulled=!1,e.add(g);const x=[],m=[],d=[];i.clusters.forEach((w,O)=>{const[W,z,ae]=w.pos;for(let q=0;q<=18;q++)x.push(W,z*q/18,ae),m.push(O),d.push(q/18);for(let q=0;q<48;q++){const Y=q/48*Math.PI*2;x.push(W+Math.cos(Y)*1.1,.03,ae+Math.sin(Y)*1.1),m.push(O),d.push(1)}});const V=new X;V.setAttribute("position",new P(new Float32Array(x),3)),V.setAttribute("aCl",new P(new Float32Array(m),1)),V.setAttribute("aF",new P(new Float32Array(d),1));const j=new K({vertexShader:Va,fragmentShader:Ea,transparent:!0,depthWrite:!1,blending:$,uniforms:{...t,uPixelRatio:{value:1}}}),N=new ne(V,j);N.frustumCulled=!1,e.add(N);const H=new X,te=new Float32Array(18);H.setAttribute("position",new P(te,3)),H.setAttribute("aS",new P(new Float32Array([0,1,0,1,0,1]),1));const B=w=>new K({vertexShader:Da,fragmentShader:Ga,transparent:!0,depthWrite:!1,blending:$,uniforms:{uColor:t.uOpCol,uOn:{value:0},uDash:{value:w}}}),U=B(0),I=B(1),J=new bt(H,U);J.geometry.setDrawRange(0,2),J.frustumCulled=!1;const Q=H.clone(),S=new bt(Q,I);S.frustumCulled=!1,e.add(J,S);const F=new T(u[0],u[1],u[2]);return{object:e,origin:F,setPixelRatio(w){v.uniforms.uPixelRatio.value=w,j.uniforms.uPixelRatio.value=w},setFraction(){},setVector(w,O){const W=J.geometry.attributes.position;W.setXYZ(0,F.x,F.y,F.z),W.setXYZ(1,w.x,w.y,w.z),W.needsUpdate=!0;const z=Q.attributes.position;z.setXYZ(0,w.x,w.y,w.z),z.setXYZ(1,w.x,.02,w.z),z.setXYZ(2,w.x,.02,w.z),z.setXYZ(3,F.x,F.y,F.z),z.setXYZ(4,w.x,.02,w.z),z.setXYZ(5,w.x,.02,F.z),z.needsUpdate=!0,U.uniforms.uOn.value=O,I.uniforms.uOn.value=O},dispose(){h.dispose(),f.dispose(),o.dispose(),v.dispose(),V.dispose(),j.dispose(),H.dispose(),Q.dispose(),U.dispose(),I.dispose()}}}const io=i.world,no=io["trail-length"],At=4,Ia=`
uniform float uSize;
uniform float uPixelRatio;
uniform float uOn;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.6 + 0.4 * uOn) * clamp(14.0 / -mv.z, 0.35, 3.0) * 6.0;
}`,Wa=`
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
}`,qa=`
attribute float aT;
uniform float uPixelRatio;
uniform float uSize;
varying float vT;
void main() {
  vT = aT;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.5 + 0.8 * aT) * clamp(12.0 / -mv.z, 0.3, 2.5);
}`,ja=`
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
}`;function $t(t,e,a){const n=no*At,l=new X;l.setAttribute("position",new P(new Float32Array(n*3),3)),l.setAttribute("aT",new P(new Float32Array(n),1)),l.setDrawRange(0,0);const r=new K({vertexShader:qa,fragmentShader:ja,transparent:!0,depthWrite:!1,blending:$,uniforms:{uColor:{value:R(t)},uHead:{value:R(e)},uOn:{value:0},uPixelRatio:{value:1},uSize:{value:a}}}),s=new ne(l,r);return s.frustumCulled=!1,s.renderOrder=4,{pts:s,mat:r,geo:l,write:c=>{const u=l.attributes.position,A=l.attributes.aT;let h=0;const f=Math.max(1,c.length-1);for(let C=0;C<c.length;C++){const b=c[C],o=c[Math.min(c.length-1,C+1)],v=C<c.length-1?At:1;for(let g=0;g<v;g++){const x=g/At;u.setXYZ(h,b.x+(o.x-b.x)*x,b.y+(o.y-b.y)*x,b.z+(o.z-b.z)*x),A.setX(h,(C+x)/f),h++}}l.setDrawRange(0,h),u.needsUpdate=!0,A.needsUpdate=!0}}}function Na(){const t=new Oe,e=new X;e.setAttribute("position",new P(new Float32Array(3),3));const a=new K({vertexShader:Ia,fragmentShader:Wa,transparent:!0,depthWrite:!1,blending:$,uniforms:{uColor:{value:R(i["operator-light-collapse"])},uHalo:{value:R(i["flame-core-color"])},uOn:{value:0},uTime:{value:0},uSize:{value:io["prompt-size"]},uPixelRatio:{value:1}}}),n=new ne(e,a);n.frustumCulled=!1,n.renderOrder=5;const l=$t(i["operator-light-amplify"],i["operator-light-collapse"],2.6),r=$t(i["operator-light-mix"],i["operator-light-mix"],2);t.add(r.pts,l.pts,n);const s=new T;let p=!1,c=[],u=[],A=0,h=!1;const f=new T;return{group:t,position:s,setPixelRatio(C){a.uniforms.uPixelRatio.value=C,l.mat.uniforms.uPixelRatio.value=C,r.mat.uniforms.uPixelRatio.value=C},update(C,b,o,v,g,x){const m=Math.min(1,Math.max(0,g)),d=m*m*(3-2*m),V=new T().lerpVectors(v,o,d);if(p&&o.distanceTo(f)>2.2&&(c.length>6&&(u=c,A=0),c=[],h=!0),f.copy(o),p?s.lerp(V,1-Math.exp(-5.5*b)):(s.copy(V),p=!0),h&&s.distanceTo(V)<.35&&(h=!1),x>.01&&m>.98&&!h){const j=c[c.length-1];(!j||j.distanceTo(s)>.06)&&(c.push(s.clone()),c.length>no&&c.shift(),l.write(c))}x<.01&&c.length&&(c=[],u=[],l.geo.setDrawRange(0,0),r.geo.setDrawRange(0,0)),A+=b,u.length&&A<b*1.5&&r.write(u),e.attributes.position.setXYZ(0,s.x,s.y,s.z),e.attributes.position.needsUpdate=!0,a.uniforms.uOn.value=Math.min(1,g*2.5),a.uniforms.uTime.value=C,l.mat.uniforms.uOn.value=x,r.mat.uniforms.uOn.value=x*.55*Math.max(.35,1-A/40)},dispose(){e.dispose(),a.dispose(),l.geo.dispose(),l.mat.dispose(),r.geo.dispose(),r.mat.dispose()}}}const Ua=`
${qe}
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
}`,Ka=`
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
}`;function Ya(t,e){const a=[],n=[],l=[];Wo.forEach((c,u)=>{const A=qo(c,40);let h=0;const f=[0];for(let o=1;o<A.length;o++)h+=Math.hypot(A[o][0]-A[o-1][0],A[o][2]-A[o-1][2]),f.push(h);const C=Math.max(2,Math.round(h/.22));let b=0;for(let o=0;o<C;o++){const v=o/(C-1)*h;for(;b<f.length-2&&f[b+1]<v;)b++;const g=(v-f[b])/Math.max(f[b+1]-f[b],1e-6),x=A[b],m=A[b+1];a.push(x[0]+(m[0]-x[0])*g,x[1]+(m[1]-x[1])*g,x[2]+(m[2]-x[2])*g),n.push(u),l.push(o/(C-1))}});const r=new X;r.setAttribute("position",new P(new Float32Array(a),3)),r.setAttribute("aRoute",new P(new Float32Array(n),1)),r.setAttribute("aS",new P(new Float32Array(l),1));const s=new K({vertexShader:Ua,fragmentShader:Ka,transparent:!0,depthWrite:!1,blending:$,uniforms:{...t,uRide:{value:e?1:0},uPixelRatio:{value:1},uRoutes:{value:0},uLit:{value:0},uColor:{value:R(i["flame-color"])},uHot:{value:R(i["flame-core-color"])}}}),p=new ne(r,s);return p.frustumCulled=!1,p.renderOrder=2,{object:p,setPixelRatio(c){s.uniforms.uPixelRatio.value=c},update(c,u){s.uniforms.uRoutes.value=c,s.uniforms.uLit.value=u,p.visible=c>.005},dispose(){r.dispose(),s.dispose()}}}const Jt=i.world,Za=`
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
}`,Xa=`
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
}`,$a=`
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
}`,Ja=`
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
}`,Qa=`
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
}`,ei=`
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
}`;function Mt(t,e,a,n,l=0){const r=new X;r.setAttribute("position",new P(new Float32Array(t*3),3)),r.setAttribute("aA",new P(new Float32Array(t),1));const s=new K({vertexShader:Za,fragmentShader:e,transparent:!0,depthWrite:!1,blending:$,uniforms:{uPixelRatio:{value:1},uSize:{value:n},uMin:{value:l},...a}}),p=new ne(r,s);return p.frustumCulled=!1,{p,geo:r,mat:s}}function ti(){const t=[],e=[],a=[],n=[],l=be(12648430);for(let s=0;s<6;s++){const p=Jt.crystals[s],c=Jt["crystal-height"][s],u=.42+l()*.18,A=.18,h=(l()-.5)*.12,f=l()*Math.PI,C=Array.from({length:6},(g,x)=>{const m=f+x/6*Math.PI*2;return[Math.cos(m)*u,A*c,Math.sin(m)*u]}),b=[h*c,c,h*c*.5],o=[0,0,0],v=(g,x,m)=>{const d=[x[0]-g[0],x[1]-g[1],x[2]-g[2]],V=[m[0]-g[0],m[1]-g[1],m[2]-g[2]],j=new T(d[1]*V[2]-d[2]*V[1],d[2]*V[0]-d[0]*V[2],d[0]*V[1]-d[1]*V[0]).normalize();for(const N of[g,x,m])t.push(p[0]+N[0],p[1]+N[1],p[2]+N[2]),e.push(j.x,j.y,j.z),a.push(s),n.push(N[1]/c)};for(let g=0;g<6;g++){const x=C[g],m=C[(g+1)%6];v(x,b,m),v(x,m,o)}}const r=new X;return r.setAttribute("position",new P(new Float32Array(t),3)),r.setAttribute("normal",new P(new Float32Array(e),3)),r.setAttribute("aTier",new P(new Float32Array(a),1)),r.setAttribute("aH",new P(new Float32Array(n),1)),r}function oi(t){const e=new Oe,a=R(i["flame-color"]),n=R(i["flame-core-color"]),l=Mt(1,Xa,{uColor:{value:a},uCore:{value:n},uOn:{value:1}},3.2,26);l.geo.attributes.position.setXYZ(0,t.x,t.y,t.z),l.p.renderOrder=7;const r=300,s=Mt(r,$a,{uColor:{value:R(i["operator-light-suppress"])},uHot:{value:n},uOn:{value:0},uPulse:{value:0},uHead:{value:0}},3.2,1.5),p=.26,c=(g,x)=>{const m=Math.cos(g)*x,d=Math.sin(g)*x;return new T(Re.center[0]+m,Re.center[1]+d*Math.sin(p),Re.center[2]+d*Math.cos(p))};for(let g=0;g<r;g++){const x=c(g/r*Math.PI*2,Re.radius);s.geo.attributes.position.setXYZ(g,x.x,x.y,x.z),s.geo.attributes.aA.setX(g,g/r)}const u=Mt(1,Ja,{uCold:{value:R(i["operator-light-suppress"])},uHot:{value:R(i["operator-light-collapse"])},uOn:{value:0},uHeat:{value:1}},12,10),A=ti(),h=new K({vertexShader:Qa,fragmentShader:ei,transparent:!0,depthWrite:!1,blending:$,uniforms:{uGrow:{value:[0,0,0,0,0,0]},uTier:{value:[R(i["flame-core-color"]),R(i["flame-color"]),R(i["operator-light-collapse"])]},uCore:{value:n},uOn:{value:0},uTime:{value:0}}}),f=new ge(A,h);f.frustumCulled=!1,f.renderOrder=3,e.add(l.p,s.p,u.p,f);const C=new T;let b=0,o=1,v=0;return{group:e,agentPos:C,setPixelRatio(g){for(const x of[l.mat,s.mat,u.mat])x.uniforms.uPixelRatio.value=g},update(g,x,m){l.mat.uniforms.uOn.value=Math.min(1.3,m.flame)*(.55+.45*(1-m.converge*.5));const d=Math.max(0,Math.min(1,m.rewrite-1));d>.5&&b<=.5&&(v=0,o=1),b=d,v=Math.min(1,v+x*.09),o=Math.max(0,o-x*.12);const V=g*.55,j=Re.radius*(1+v*.55+Math.sin(g*1.7)*.04*v);C.copy(c(V,j)),C.y+=v*.9,u.geo.attributes.position.setXYZ(0,C.x,C.y,C.z),u.geo.attributes.position.needsUpdate=!0,u.mat.uniforms.uOn.value=m.orbit,u.mat.uniforms.uHeat.value=Math.max(o,d),s.mat.uniforms.uOn.value=m.orbit,s.mat.uniforms.uPulse.value=d,s.mat.uniforms.uHead.value=(V/(Math.PI*2)%1+1)%1,s.p.visible=u.p.visible=m.orbit>.005;const N=h.uniforms.uGrow.value;for(let H=0;H<6;H++){const te=Math.max(0,Math.min(1,m.lift*6-H));N[H]=te*te*(3-2*te)*(m.crystals>0?1:0)}h.uniforms.uOn.value=m.crystals*(1-m.converge),h.uniforms.uTime.value=g,f.visible=m.crystals>.005},crystalTop:jo,dispose(){for(const g of[l,s,u])g.geo.dispose(),g.mat.dispose();A.dispose(),h.dispose()}}}const ai=`// The forge pass (after tone mapping) + the hacking layer's raster (2026-10-31): the picture sits behind
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
`,se=oe.signal;class ii{composer;bloom;forge;constructor(e,a,n){const l=new Qt(4,4,{type:Po});this.composer=new Ro(e,l),this.composer.addPass(new To(a,n)),this.bloom=new Fo(new ze(4,4),Z["bloom-strength"]*Ie("bloom-gain"),Z["bloom-radius"],Z["bloom-threshold"]),this.composer.addPass(this.bloom),this.composer.addPass(new zo),this.forge=new Oo(new K({vertexShader:ao,fragmentShader:ai,uniforms:{tDiffuse:{value:null},uRes:{value:new ze(4,4)},uTime:{value:0},uHeat:{value:0},uBlur:{value:0},uGrain:{value:Math.max(Ie("grain"),se.grain)},uVignette:{value:Math.max(Ie("vignette"),se.vignette)},uSat:{value:Ie("ember-saturation")},uFlare:{value:0},uTear:{value:-1},uTearColor:{value:new St(se["tear-color"])},uDive:{value:0},uZoom:{value:0},uLift:{value:0},uCenter:{value:new ze(.5,.5)},uDiveColor:{value:new St(Z["dive-color"])},uScan:{value:se["scan-strength"]},uScanPx:{value:se["scan-px"]},uBarrel:{value:se.barrel},uCA:{value:se["ca-px"]},uLevel:{value:se.level},uGamma:{value:se.gamma},uWarm:{value:1},uCrush:{value:se.crush},uFringe:{value:se.fringe},uEdge:{value:se["edge-px"]}}})),this.composer.addPass(this.forge)}setSize(e,a,n){this.composer.setPixelRatio(n),this.composer.setSize(e,a),this.bloom.resolution.set(e*n/2,a*n/2),this.forge.uniforms.uRes.value.set(e*n,a*n),this.forge.uniforms.uScanPx.value=se["scan-px"]*n}setBloomEnabled(e){this.bloom.enabled=e}update(e){const a=Math.min(Math.abs(e.velocity),8),n=this.forge.uniforms;n.uTime.value=e.time,n.uHeat.value=(Z["heat-shimmer"]+a*Z["heat-shimmer-velocity-gain"])*Ie("heat-shimmer-gain")*e.heat,n.uBlur.value=a*Z["heat-shimmer-velocity-gain"],n.uFlare.value=e.flare,n.uTear.value=e.tear,n.uWarm.value=e.warm,n.uLift.value=e.lift,n.uDive.value=e.dive,n.uZoom.value=Math.max(e.dive*e.dive*Z["dive-zoom"],e.warp*Z["warp-zoom"]),n.uCenter.value.set(e.center[0],e.center[1])}render(){this.composer.render()}dispose(){this.composer.dispose(),this.bloom.dispose()}}class ni{level=0;frameMs=i["frame-budget-ms"];exhausted=!1;strikes=0;samples=[];lastChange=0;levels;locked;constructor(e,a){const n=typeof location<"u"?parseFloat(new URLSearchParams(location.search).get("rs")??""):NaN,l=Number.isFinite(n)?Math.min(1,Math.max(.4,n)):1,r=Math.min(e,i["max-pixel-ratio"])*l,s=i["void-resolution"];this.levels=[{pixelRatio:r,bloom:!0,voidScale:s,cloud:1},{pixelRatio:Math.min(r,1),bloom:!0,voidScale:s,cloud:1},{pixelRatio:Math.min(r,1),bloom:!1,voidScale:s,cloud:1},{pixelRatio:Math.min(r,1),bloom:!1,voidScale:s/2,cloud:1},{pixelRatio:Math.min(r,1),bloom:!1,voidScale:s/2,cloud:.5}],a==="low"&&(this.level=this.levels.length-1),this.locked=a==="low"||a==="high"}get current(){return this.levels[this.level]}median(){const e=[...this.samples].sort((a,n)=>a-n);return e[Math.floor(e.length/2)]}sample(e,a){if(e<=0||e>1e3)return!1;const n=i["governor-window-frames"];if(this.samples.push(e),this.samples.length>n&&this.samples.shift(),this.samples.length<n)return!1;const l=this.median();if(this.frameMs=l,this.locked||a-this.lastChange<2e3)return!1;const r=i["frame-budget-ms"],s=this.levels.length-1;if(this.level===s&&l>r*1.6)return this.strikes++,this.lastChange=a,this.samples.length=0,this.strikes>=2&&!this.exhausted?(this.exhausted=!0,!0):!1;if(l>r*1.15&&this.level<s)this.level++;else if(l<r*.7&&this.level>0&&a-this.lastChange>12e3)this.level--;else return!1;return this.lastChange=a,this.samples.length=0,!0}}const ri=`// The collapse: one white-hot point that pulses once.
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
`,li=`uniform float uSize; uniform float uPixelRatio; uniform float uPulse;
void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * mv;
gl_PointSize = min(uSize * uPixelRatio * (1.0 + uPulse * 0.6) * (6.0 / max(-mv.z, 0.1)) * 2.5, 40.0 * uPixelRatio); }`,ui=22,si=14,ci=1.6,fi=8;async function hi(t){const{canvas:e,state:a}=t,n=new ko({canvas:e,antialias:!1,alpha:!1,powerPreference:"high-performance",stencil:!1});n.toneMapping=Lo,n.setClearColor(R(oe.color.bg),1);const l=new eo,r=new Ho(a.fov,1,.05,200);l.add(new _o(R(i["rim-light-a"]),R(i["void-deep"]),.25));const s=new jt(R(i["rim-light-a"]),.9);s.position.set(-4,3,-4);const p=new jt(R(i["rim-light-b"]),.8);p.position.set(4,2,-3),l.add(s,p);const c=new Zo;l.background=c.target.texture;const u=Jo();l.add(u.points);const A=Qo();l.add(A.group);const h=oa();l.add(h.group);const f=new T(0,h.centerY,0),C=new Vo(R(i["key-light"]),6,9,1.4);C.position.copy(f),l.add(C);const b=ra();l.add(b.group);const o=ma();l.add(...o.objects);const v=ha();l.add(v.points);const g=xa();l.add(g.points);const x=Ma();l.add(x.group);const m=new T,d=Ra(),V=L.field==="wave"?Oa(d):null,j=L.field==="space"?Ba(d):null,N=V??j;l.add(N.object);const H=Ya(d,L.field==="wave");l.add(H.object);const te=Na();l.add(te.group);const B=oi(f);l.add(B.group);const U=new T;let I=-1,J=-1;const Q=new X;Q.setAttribute("position",new P(new Float32Array(3),3));const S=new K({vertexShader:li,fragmentShader:ri,transparent:!0,depthWrite:!1,blending:$,uniforms:{uColor:{value:R(i["operator-light-collapse"])},uOn:{value:0},uPulse:{value:0},uSize:{value:i["landing-size"]},uPixelRatio:{value:1}}}),F=new ne(Q,S);F.frustumCulled=!1,F.renderOrder=3,l.add(F);const w=new ii(n,l,r),O=new ni(window.devicePixelRatio||1,L.quality);let W=0,z=0;function ae(){const y=O.current;n.setPixelRatio(y.pixelRatio),n.setSize(W,z,!1),c.scale=y.voidScale,c.setSize(W*y.pixelRatio,z*y.pixelRatio),w.setSize(W,z,y.pixelRatio),w.setBloomEnabled(y.bloom),u.setFraction(y.cloud*(L.field==="wave"?.55:1)),N.setFraction(y.cloud),V?.setPixelRatio(y.pixelRatio,z),j?.setPixelRatio(y.pixelRatio),H.setPixelRatio(y.pixelRatio),te.setPixelRatio(y.pixelRatio),B.setPixelRatio(y.pixelRatio),S.uniforms.uPixelRatio.value=y.pixelRatio,o.setPixelRatio(y.pixelRatio),v.setPixelRatio(y.pixelRatio),v.setFraction(y.cloud),g.setPixelRatio(y.pixelRatio),g.setFraction(Math.max(.35,y.cloud))}function q(){W=e.clientWidth||window.innerWidth,z=e.clientHeight||window.innerHeight,r.aspect=W/Math.max(z,1),r.updateProjectionMatrix(),ae()}q(),window.addEventListener("resize",q),t.onProgress?.("shaders",.3),await n.compileAsync(l,r),t.onProgress?.("shaders",1);const Y={x:0,y:0,sx:0,sy:0},le=new Eo,_=new Do(new T(0,1,0),0),me=new T,nt=new T;let rt=-10,lt=0;const Pt=new ze,Rt=y=>(Pt.set(y.clientX/window.innerWidth*2-1,-(y.clientY/window.innerHeight)*2+1),le.setFromCamera(Pt,r),!le.ray.intersectPlane(_,me)||me.distanceTo(r.position)>60?!1:(nt.copy(me),!0)),Tt=y=>{Y.x=y.clientX/window.innerWidth*2-1,Y.y=y.clientY/window.innerHeight*2-1,y.pointerType!=="touch"&&!L.reducedMotion&&Rt(y)&&(rt=G)},Ft=y=>{L.reducedMotion||!xe||y.target?.closest("a, button, input, select, textarea, label, [data-owns-keys], .menu, .gate, .hud")||Rt(y)&&(rt=G,d.uPulseC.value.copy(nt),d.uPulseCol.value.set(i["flame-core-color"]),d.uPulseV.value=i.world["pulse-speed"],I=0,ee=Math.max(ee,.5))};window.addEventListener("pointerdown",Ft,{passive:!0}),window.addEventListener("pointermove",Tt,{passive:!0});const fe=new T(a.camX,a.camY,a.camZ),Ce=new T(a.lookX,a.lookY,a.lookZ),Ae=new T,je=new T,ke=new T,Ne=new T,ut=new T,ro=new T(0,1,0),st=new T,ct=new T,ft=new T,vt=new T,Ue=new T,we=i.clusters.map(y=>new T(...y.pos));let Le=a.fov;const mt=new T,dt=new T,zt=new T;let Ke=0,G=0,Me=0,xe=!0,ee=0,pt=30,He=0,lo=0;const Ye=new Uint8Array(4096*4),uo=()=>{const y=n.getContext(),ie=Math.min(y.drawingBufferWidth,4096),D=y.drawingBufferHeight;let M=0,de=0;for(const Je of[.2,.35,.5,.65,.8]){y.readPixels(0,Math.round(D*Je),ie,1,y.RGBA,y.UNSIGNED_BYTE,Ye);for(let ye=0;ye<ie*4;ye+=16)M+=.2126*Ye[ye]+.7152*Ye[ye+1]+.0722*Ye[ye+2],de++}pt=de?M/de:pt};let ht=0,Ot=0,gt=-1,Ze=0,kt=0,_e=0,Xe=!1,$e=0,Lt=0,Ht=-10,wt=!1,xt=0,pe=0;const so=["amplify","suppress","mix","collapse"],_t={amplify:0,suppress:0,mix:0,collapse:0},co=Kt("boot").flame,Vt={v:t.awake?1:co},Et={v:t.awake||L.posterCapture?1:.32},yt=new Set,fo=7.3;function vo(y){if(y.landOn>.5)return Ue.set(y.landX,y.landY,y.landZ);if(y.collapse<.001)return null;const ie=[y.w0,y.w1,y.w2,y.w3,y.w4,y.w5,y.w6],D=Math.max(...ie);let M=0;return Ue.set(0,0,0),ie.forEach((de,Je)=>{de>=oe.composer.collapse["keep-ratio"]*D&&(Ue.addScaledVector(we[Je],de),M+=de)}),M>0?Ue.multiplyScalar(1/M):null}function Dt(y,ie){if(!xe)return;const D=Math.min(ie,100)/1e3;G=L.posterCapture?fo:G+D,Me++,O.sample(ie,performance.now())&&(O.exhausted?t.onStruggle?.():ae());const M=a;L.posterCapture&&Object.assign(M,Kt("hero"),No("hero-open")),Ae.set(M.camX,M.camY,M.camZ),je.set(M.lookX,M.lookY,M.lookZ),Y.sx=Ee(Y.sx,L.posterCapture||L.reducedMotion?0:Y.x,3,D),Y.sy=Ee(Y.sy,L.posterCapture||L.reducedMotion?0:Y.y,3,D),ke.subVectors(je,Ae).normalize(),Ne.crossVectors(ke,ro).normalize(),ut.crossVectors(Ne,ke).normalize();const de=Z["pointer-parallax"];if(Ae.addScaledVector(Ne,Y.sx*de).addScaledVector(ut,-Y.sy*de*.6),!L.posterCapture&&!L.reducedMotion){const k=oe.scene["camera-drift"];Ae.addScaledVector(Ne,Math.sin(G*.13)*k).addScaledVector(ut,Math.sin(G*.21)*k*.45)}if(Ae.distanceTo(fe)>80||Me<3||L.posterCapture)fe.copy(Ae),Ce.copy(je),Le=M.fov,mt.set(0,0,0),dt.set(0,0,0),Ke=0;else{const k=Z["camera-spring"],E=Math.min(D,1/20);for(let ve=Math.max(1,Math.round(D/E));ve>0;ve--)mt.addScaledVector(zt.subVectors(Ae,fe),k*k*E).multiplyScalar(1-2*k*E),fe.addScaledVector(mt,E),dt.addScaledVector(zt.subVectors(je,Ce),k*k*E).multiplyScalar(1-2*k*E),Ce.addScaledVector(dt,E),Ke=(Ke+(M.fov-Le)*k*k*E)*(1-2*k*E),Le+=Ke*E}r.position.copy(fe),r.lookAt(Ce),he.on=!L.posterCapture,he.camX=fe.x,he.camY=fe.y,he.camZ=fe.z,he.lookX=Ce.x,he.lookY=Ce.y,he.lookZ=Ce.z,he.fov=Le,Math.abs(r.fov-Le)>.001&&(r.fov=Le,r.updateProjectionMatrix());for(const k of so){const E=M[k];E>.35&&_t[k]<=.35&&!L.reducedMotion&&Me>3&&(ee=Math.max(ee,.45),_e=1),_t[k]=E}if(_e=Math.max(0,_e-D*.9),pe=Math.max(0,pe-D/4.5),pe>.01){const k=(ui-pt)/si,E=k>0?ci:fi;He=Math.min(1,Math.max(0,He+k*E*D))}d.uGlow.value=pe*(.35+.65*He),d.uGlowN.value=pe*He,ee=Math.max(0,ee-D/(Yt(Z.slow)/1e3));const ye=r.position.distanceTo(f),De=ee*Math.min(1,Math.max(.25,(ye-3)/9)),Se=M.flame*Vt.v*(1+De*(Z["flare-flame"]-1)),Gt=M.dive>.02?1:Math.min(1,Math.max(.12,(ye-2.2)/4.5)),Bt=h.update(G,Se*Gt,r,De*Gt);C.intensity=7.5*Se*Bt*(1+De*.8),d.uFireI.value=Math.min(2.6,Se*Bt*(1+De*.35)+pe*.25),A.group.position.y=Math.sin(G*.4)*Z["brazier-drift"]*.3,A.group.rotation.y=Math.sin(G*.13)*Z["brazier-drift"],A.update(G,Se,M.rewrite);const Ve=c.material.uniforms;st.copy(f).project(r),Ve.uFlame.value.set(st.x*.5+.5,st.y*.5+.5),Ve.uFlameI.value=Se,Ve.uExposure.value=M.exposure;const mo=Math.atan2(ke.x,-ke.z);Ve.uOffset.value.set(mo*1.2+fe.x*.03,Math.asin(Math.max(-1,Math.min(1,ke.y)))*1.2+fe.y*.02),(Me%2===1||Me<3)&&c.render(n,G);const ce=vo(M);if(u.update(G,M,O.current.pixelRatio,z),ce&&M.landOn<.5){const k=u.material.uniforms;k.uLand.value.copy(ce),k.uLandOn.value=1}ct.copy(we[Math.round(M.amplifyTarget)]??we[0]),ft.copy(we[Math.round(M.mixA)]??we[0]),vt.copy(we[Math.round(M.mixB)]??we[0]),b.update({flame:f,amp:M.amplify,ampTarget:ct,mix:M.mix,mixA:ft,mixB:vt,camera:r,time:G}),o.update(G,M),v.update(G,Se,fe);let Ge=0;ce&&M.collapse>.05?(m.copy(ce),Ge=M.collapse):M.mix>.05?(m.copy(ft).add(vt).multiplyScalar(.5),Ge=M.mix*.8):M.amplify>.05&&(m.copy(ct),Ge=M.amplify),g.update(G,Se,Math.max(_e,ee*.6),Ge>0?m:null,Math.min(1,Ge)),Ta(d,M,G,ce),$e=Ee($e,Xe?1:0,Xe?1.6:3,D),$e>d.uLik.value.z+.01&&d.uLik.value.set(Lt,Ht,$e,2.3),xt=Ee(xt,wt?1:0,2.5,D),d.uStray.value=Math.max(M.stray,xt);{const k=x.k;let E=-1;k.forEach((ue,Be)=>{ue>.02&&(E<0||ue>k[E])&&(E=Be)});const ve=d.uTl.value;for(let ue=0;ue<ve.length;ue++)ve[ue].set(0,0,0);if(E>=0){const ue=Te(E,0,0);d.uLik.value.z<k[E]*.3&&d.uLik.value.set(ue[0],ue[2],k[E]*.3,4.4),it[E].nodes.slice(0,ve.length).forEach((Be,po)=>{const It=Te(E,Be.lx,Be.lz);ve[po].set(It[0],It[2],k[E]*(Be.dim?.45:.9))})}}if(lt=Ee(lt,G-rt<2.5?1:0,3,D),d.uCursor.value.lerp(nt,1-Math.exp(-8*D)),d.uCursorOn.value=lt,J>=0&&(J=J>=1?-1:J+D/(oe.signal["tear-ms"]/1e3)),I>=0&&(I=I>8?-1:I+D),d.uPulseT.value=I,ce)U.copy(ce);else{U.set(0,0,0);const k=[M.w0,M.w1,M.w2,M.w3,M.w4,M.w5,M.w6],E=k.reduce((ve,ue)=>ve+ue,0)||1;k.forEach((ve,ue)=>U.addScaledVector(we[ue],ve/E))}if(te.update(G,D,U,f,M.prompt,M.trail),j?.setVector(te.position,Math.min(1,M.prompt*2)*(1-M.converge)),H.update(M.routes*(1-M.converge),M.route),B.update(G,D,M),x.update(G,D,M.delivery??-1)&&!L.reducedMotion){const k=Te(Math.round(M.delivery),0,0);d.uPulseC.value.set(k[0],0,k[2]),d.uPulseCol.value.set(i["flame-color"]),d.uPulseV.value=i.world["pulse-speed"],I=0,ee=Math.max(ee,.35)}M.collapse>.95&&kt<=.95&&!L.reducedMotion&&(Ze=1),kt=M.collapse,Ze=Math.max(0,Ze-D/(Z["composer-landing-pulse-ms"]/1e3)),S.uniforms.uOn.value=ce?Math.min(1,M.collapse*1.2):0,S.uniforms.uPulse.value=Math.sin(Ze*Math.PI),ce&&Q.attributes.position.setXYZ(0,ce.x,ce.y,ce.z),Q.attributes.position.needsUpdate=!0,ht=Ee(ht,G<gt?Ot:0,G<gt?6:2.5,D),n.toneMappingExposure=M.exposure,w.update({time:G,velocity:L.posterCapture?0:Uo.value,heat:M.heat,flare:De,tear:J,dive:L.reducedMotion||L.posterCapture?0:M.dive,warp:ht,center:[Ve.uFlame.value.x,Ve.uFlame.value.y],warm:Et.v,lift:L.reducedMotion?0:Math.min(1,pe/.85)*He}),w.render(),pe>.01&&++lo%3===0&&uo();for(const k of yt)k(D,G);Me===2&&t.onProgress?.("first-frame",1),L.posterCapture&&Me===40&&(document.documentElement.dataset.posterReady="1")}return Qe.ticker.add(Dt),e.addEventListener("webglcontextlost",y=>{y.preventDefault(),xe=!1,t.onLost?.()}),{canvas:e,setActive(y){xe=y},get qualityLevel(){return O.level},get qualityLevels(){return O.levels.length},get frameMs(){return O.frameMs},onFrame(y){return yt.add(y),()=>yt.delete(y)},pulse(y,ie,D){L.reducedMotion||(d.uPulseC.value.set(...y),d.uPulseCol.value.set(ie),d.uPulseV.value=D??i.world["pulse-speed"],I=0)},tear(){L.reducedMotion||!xe||(J=0,ee=Math.max(ee,.45),_e=Math.max(_e,.5))},crestAt(y,ie){Xe=y!==null&&!L.reducedMotion,y!==null&&(Lt=y,Ht=ie??-10)},stray(y){wt=y&&!L.reducedMotion},delivery(){return x},handover(){L.reducedMotion||!xe||(d.uPulseC.value.set(0,0,0),d.uPulseCol.value.set(i["flame-color"]),d.uPulseV.value=i.world["pulse-speed"]*1.8,I=0,pe=.85,He=0,ee=Math.max(ee,.4),Xe=!1,wt=!1)},flare(y=1){L.reducedMotion||(ee=Math.max(ee,Math.min(1,y)))},warp(y,ie){L.reducedMotion||!xe||(Ot=Math.max(0,Math.min(1,y)),gt=G+ie/1e3)},ignite(){L.reducedMotion||!xe||(ee=1,d.uPulseC.value.set(0,0,0),d.uPulseCol.value.set(i["flame-core-color"]),d.uPulseV.value=i.world["ignite-speed"],I=0)},wake(){Qe.fromTo(Et,{v:.32},{v:1,duration:oe.signal["warm-ms"]/1e3,ease:"power2.out"}),Qe.to(Vt,{v:1,duration:(oe.motion["gate-exit-ms"]+Yt(oe.motion.cine))/1e3,ease:"power2.out"}),ee=1,d.uPulseC.value.set(0,0,0),d.uPulseCol.value.set(i["flame-core-color"]),d.uPulseV.value=i.world["ignite-speed"],I=0},dispose(){he.on=!1,Qe.ticker.remove(Dt),window.removeEventListener("resize",q),window.removeEventListener("pointermove",Tt),window.removeEventListener("pointerdown",Ft),c.dispose(),u.dispose(),A.dispose(),h.dispose(),b.dispose(),o.dispose(),v.dispose(),g.dispose(),x.dispose(),N.dispose(),H.dispose(),te.dispose(),B.dispose(),Q.dispose(),S.dispose(),w.dispose(),n.dispose()}}}export{hi as createRenderer};
