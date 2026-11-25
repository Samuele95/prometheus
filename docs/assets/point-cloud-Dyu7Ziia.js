import{r as F,s as R,O as I,S as L,b as y,A as W,P as q,q as B,B as _,f as H}from"./flame-geometry-CZ6onwsG.js";import{t as E,s as k}from"./index-Cpl-AmPk.js";import"./base-CcLaH-W3.js";const C=E.effects["point-cloud"],S=E.color,j=`
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
  }`,G=`
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - .5);
    if (d > .5) discard;
    float a = smoothstep(.5, 0., d) * vAlpha;
    gl_FragColor = vec4(vColor * a, a);
  }`;function O(t,s){let h=1/0;for(let e=0;e<s.length-1;e++){const[f,v]=s[e],[l,b]=s[e+1],r=l-f,o=b-v,m=Math.max(0,Math.min(1,((t[0]-f)*r+(t[1]-v)*o)/(r*r+o*o||1)));h=Math.min(h,Math.hypot(t[0]-f-m*r,t[1]-v-m*o))}return h}function V(t){return t.replace(/^M/,"").split(" L").map(s=>s.trim().split(" ").map(Number))}function N(t){return()=>(t=t*1664525+1013904223>>>0,t/4294967296)}const D=t=>Math.sqrt(-2*Math.log(t()+1e-9))*Math.cos(2*Math.PI*t());function X(t,s,h){const e=N(7),f=V(B.wave),[v,l]=B.dot,b=B.samples.filter(a=>O(a,f)>.85&&Math.hypot(a[0]-v,a[1]-l)>2.2),r=3,o=57,m=new Float32Array(t*3),c=new Float32Array(t*3),p=new Float32Array(t*4),[P,T]=B.ringCenter;for(let a=0;a<t;a++){m[a*3]=D(e)*s*.2+s*.14,m[a*3+1]=D(e)*h*.22,m[a*3+2]=D(e)*220;const M=e();let x=0,A=0,w=0,n=0;if(M<.18){x=1;const i=e()<.6?B.rings[0]:B.rings[1],d=e()*Math.PI*2,u=(e()-.5)*(i===B.rings[0]?1.1:.45);A=P+Math.cos(d)*(i+u),w=T+Math.sin(d)*(i+u),n=(e()-.5)*.6}else{x=M>.965?2:0;for(let i=0;i<6;i++){const d=b[Math.floor(e()*b.length)],u=d[0]+D(e)*.22,z=d[1]+D(e)*.22;if(O([u,z],f)>.8&&Math.hypot(u-v,z-l)>2.15){A=u,w=z;break}A=d[0],w=d[1]}n=D(e)*2.2}c[a*3]=A-32,c[a*3+1]=-(w-32),c[a*3+2]=n,p[a*4]=e(),p[a*4+1]=x,p[a*4+2]=e()<C["holo-share"]?1:0,p[a*4+3]=x===0?Math.min(1,Math.max(0,(o-w)/(o-r))):0}const g=new _;return g.setAttribute("position",new H(c.slice(),3)),g.setAttribute("aA",new H(m,3)),g.setAttribute("aB",new H(c,3)),g.setAttribute("aData",new H(p,4)),g}function Q(t,s){const h=window.innerWidth<E.breakpoints.md,e=new F({antialias:!1,alpha:!0,powerPreference:"high-performance"}),f=Math.min(window.devicePixelRatio||1,h?C["dpr-cap-mobile"]:C["dpr-cap"]);e.setPixelRatio(f),e.setClearColor(0,0),t.prepend(e.domElement);const v=new R,l=new I(-1,1,1,-1,-2e3,2e3);l.position.z=1e3;const b=S.holo.stops,r=new L({vertexShader:j,fragmentShader:G,transparent:!0,depthWrite:!1,blending:W,uniforms:{uMeasure:{value:0},uTime:{value:0},uSize:{value:C["size-px"]},uDpr:{value:f},uScale:{value:8},uOffset:{value:[0,0]},uEmber:{value:new y(S.ember)},uEmberDeep:{value:new y(S["ember-deep"])},uBrass:{value:new y(S.brass)},uBone:{value:new y(S.bone)},uMuted:{value:new y(S.muted)},uH1:{value:new y(b[0])},uH2:{value:new y(b[1])},uH3:{value:new y(b[2])}}});let o=null;const m=()=>{const n=t.clientWidth,i=t.clientHeight;e.setSize(n,i,!1),l.left=-n/2,l.right=n/2,l.top=i/2,l.bottom=-i/2,l.updateProjectionMatrix();const d=t.getBoundingClientRect(),u=s.getBoundingClientRect(),z=u.width||Math.min(n,i)*.6;r.uniforms.uScale.value=z/64,r.uniforms.uOffset.value=[u.left+u.width/2-(d.left+n/2),-(u.top+u.height/2-(d.top+i/2))],o||(o=new q(X(h?C["points-mobile"]:C["points-desktop"],n,i),r),o.frustumCulled=!1,v.add(o))};m(),s.style.visibility="hidden",t.classList.add("is-live");let c=0,p=!0,P=!0;const T=performance.now(),g=E.motion.pointer["cloud-orbit-deg"]*Math.PI/180,a=n=>{if(c=0,!P||!p)return;const i=k.measure;r.uniforms.uTime.value=(n-T)/1e3,r.uniforms.uMeasure.value=i,o&&(o.rotation.y=k.pointer[0]*g*(1-i),o.rotation.x=-k.pointer[1]*g*.5*(1-i)),e.render(v,l),c=requestAnimationFrame(a)},M=()=>{!c&&P&&p&&(c=requestAnimationFrame(a))},x=new IntersectionObserver(([n])=>{p=n.isIntersecting,M()});x.observe(t);const A=()=>{P=document.visibilityState==="visible",M()};document.addEventListener("visibilitychange",A);const w=new ResizeObserver(()=>{m(),M()});return w.observe(t),M(),()=>{cancelAnimationFrame(c),x.disconnect(),w.disconnect(),document.removeEventListener("visibilitychange",A),o?.geometry.dispose(),r.dispose(),e.dispose(),e.domElement.remove(),s.style.visibility=""}}export{Q as mountPointCloud};
