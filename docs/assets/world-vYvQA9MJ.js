import{M as j,O as Lt,B as ee,F as _t,S as q,U as St,a as ie,W as it,H as rt,N as Gt,T as $t,b as g,V as C,A as Q,c as ve,d as He,e as Oe,G as De,f as O,g as Fe,L as Wt,P as Ke,h as Bt,i as ft,j as Dt,k as nt,l as lt,m as jt,n as Qt,Q as qt,D as Ct,o as Ut,p as ke,q as Be,r as Nt,s as Xt,t as Yt,u as Kt,I as Zt,v as Jt,w as ea,R as ta,x as aa}from"./flame-geometry-CZ6onwsG.js";import{g as sa}from"./index-DdEiTQuA.js";import{t as ct}from"./index-Cpl-AmPk.js";import"./base-CcLaH-W3.js";const dt={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class ut{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const oa=new Lt(-1,1,1,-1,0,1);class ia extends ee{constructor(){super(),this.setAttribute("position",new _t([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new _t([0,2,0,0,2,0],2))}}const ra=new ia;class Ht{constructor(e){this._mesh=new j(ra,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,oa)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Ot extends ut{constructor(e,r="tDiffuse"){super(),this.textureID=r,this.uniforms=null,this.material=null,e instanceof q?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=St.clone(e.uniforms),this.material=new q({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Ht(this.material)}render(e,r,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(r),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class kt extends ut{constructor(e,r){super(),this.scene=e,this.camera=r,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,r,n){const s=e.getContext(),o=e.state;o.buffers.color.setMask(!1),o.buffers.depth.setMask(!1),o.buffers.color.setLocked(!0),o.buffers.depth.setLocked(!0);let t,l;this.inverse?(t=0,l=1):(t=1,l=0),o.buffers.stencil.setTest(!0),o.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),o.buffers.stencil.setFunc(s.ALWAYS,t,4294967295),o.buffers.stencil.setClear(l),o.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(r),this.clear&&e.clear(),e.render(this.scene,this.camera),o.buffers.color.setLocked(!1),o.buffers.depth.setLocked(!1),o.buffers.color.setMask(!0),o.buffers.depth.setMask(!0),o.buffers.stencil.setLocked(!1),o.buffers.stencil.setFunc(s.EQUAL,1,4294967295),o.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),o.buffers.stencil.setLocked(!0)}}class na extends ut{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class la{constructor(e,r){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),r===void 0){const n=e.getSize(new ie);this._width=n.width,this._height=n.height,r=new it(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:rt}),r.texture.name="EffectComposer.rt1"}else this._width=r.width,this._height=r.height;this.renderTarget1=r,this.renderTarget2=r.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Ot(dt),this.copyPass.material.blending=Gt,this.timer=new $t}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,r){this.passes.splice(r,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const r=this.passes.indexOf(e);r!==-1&&this.passes.splice(r,1)}isLastEnabledPass(e){for(let r=e+1;r<this.passes.length;r++)if(this.passes[r].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const r=this.renderer.getRenderTarget();let n=!1;for(let s=0,o=this.passes.length;s<o;s++){const t=this.passes[s];if(t.enabled!==!1){if(t.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),t.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),t.needsSwap){if(n){const l=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(l.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(l.EQUAL,1,4294967295)}this.swapBuffers()}kt!==void 0&&(t instanceof kt?n=!0:t instanceof na&&(n=!1))}}this.renderer.setRenderTarget(r)}reset(e){if(e===void 0){const r=this.renderer.getSize(new ie);this._pixelRatio=this.renderer.getPixelRatio(),this._width=r.width,this._height=r.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,r){this._width=e,this._height=r;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let o=0;o<this.passes.length;o++)this.passes[o].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class ca extends ut{constructor(e,r,n=null,s=null,o=null){super(),this.scene=e,this.camera=r,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=o,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new g}render(e,r,n){const s=e.autoClear;e.autoClear=!1;let o,t;this.overrideMaterial!==null&&(t=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(o=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(o),this.overrideMaterial!==null&&(this.scene.overrideMaterial=t),e.autoClear=s}}const ua={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new g(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Ze extends ut{constructor(e,r=1,n,s){super(),this.strength=r,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new ie(e.x,e.y):new ie(256,256),this.clearColor=new g(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let o=Math.round(this.resolution.x/2),t=Math.round(this.resolution.y/2);this.renderTargetBright=new it(o,t,{type:rt,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const M=new it(o,t,{type:rt,depthBuffer:!1});M.texture.name="UnrealBloomPass.h"+h,M.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(M);const b=new it(o,t,{type:rt,depthBuffer:!1});b.texture.name="UnrealBloomPass.v"+h,b.texture.generateMipmaps=!1,this.renderTargetsVertical.push(b),o=Math.round(o/2),t=Math.round(t/2)}const l=ua;this.highPassUniforms=St.clone(l.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new q({uniforms:this.highPassUniforms,vertexShader:l.vertexShader,fragmentShader:l.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];o=Math.round(this.resolution.x/2),t=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new ie(1/o,1/t),o=Math.round(o/2),t=Math.round(t/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=r,this.compositeMaterial.uniforms.bloomRadius.value=.1;const f=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=f,this.bloomTintColors=[new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=St.clone(dt.uniforms),this.blendMaterial=new q({uniforms:this.copyUniforms,vertexShader:dt.vertexShader,fragmentShader:dt.fragmentShader,premultipliedAlpha:!0,blending:Q,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new g,this._oldClearAlpha=1,this._basic=new ve,this._fsQuad=new Ht(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,r){let n=Math.round(e/2),s=Math.round(r/2);this.renderTargetBright.setSize(n,s);for(let o=0;o<this.nMips;o++)this.renderTargetsHorizontal[o].setSize(n,s),this.renderTargetsVertical[o].setSize(n,s),this.separableBlurMaterials[o].uniforms.invSize.value=new ie(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,r,n,s,o){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const t=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),o&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let l=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=l.texture,this.separableBlurMaterials[c].uniforms.direction.value=Ze.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=Ze.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),l=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,o&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=t}_getSeparableBlurMaterial(e){const r=[],n=e/3;for(let t=0;t<e;t++)r.push(.39894*Math.exp(-.5*t*t/(n*n))/n);const s=[],o=[];for(let t=1;t<e;t+=2){const l=r[t],c=t+1<e?r[t+1]:0,f=l+c;s.push((t*l+(t+1)*c)/f),o.push(f)}return new q({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new ie(.5,.5)},direction:{value:new ie(.5,.5)},centerWeight:{value:r[0]},gaussianOffsets:{value:s},gaussianWeights:{value:o}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new q({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}Ze.BlurDirectionX=new ie(1,0);Ze.BlurDirectionY=new ie(0,1);const $=ct.color,H=640,ce=1040,Ne='"Bodoni Moda Variable", serif',wt='"Geist Mono Variable", monospace';function Ft(a,e){a.fillStyle=e,a.fillRect(0,0,H,ce);const r=a.createRadialGradient(H/2,ce*.35,10,H/2,ce*.35,ce*.7);r.addColorStop(0,$["ink-2"]),r.addColorStop(1,e),a.fillStyle=r,a.fillRect(0,0,H,ce),a.strokeStyle=$.brass,a.lineWidth=3,a.strokeRect(10,10,H-20,ce-20),a.strokeStyle=$["brass-dim"],a.lineWidth=1.5,a.strokeRect(30,30,H-60,ce-60);for(const[n,s]of[[30,30],[H-30,30],[30,ce-30],[H-30,ce-30]])a.fillStyle=$.brass,a.beginPath(),a.arc(n,s,5,0,Math.PI*2),a.fill()}function Pt(a,e,r){const n=e.split(" "),s=[];let o="";for(const t of n){const l=o?`${o} ${t}`:t;a.measureText(l).width>r&&o?(s.push(o),o=t):o=l}return o&&s.push(o),s}function ha(a,e,r,n,s){const o=s/64;a.save(),a.translate(r-s/2,n-s/2),a.scale(o,o),a.lineWidth=1.6,a.lineCap="round",a.lineJoin="round",e.querySelectorAll("path, circle").forEach(t=>{const l=t.classList.contains("dot"),c=t.classList.contains("faint");let f;if(t.tagName==="path")f=new Path2D(t.getAttribute("d"));else{f=new Path2D;const h=+t.getAttribute("r");f.arc(+t.getAttribute("cx"),+t.getAttribute("cy"),h,0,Math.PI*2)}l?(a.fillStyle=$.ember,a.fill(f)):(a.strokeStyle=c?$["brass-dim"]:$.brass,a.stroke(f))}),a.restore()}async function fa(){try{await Promise.all([document.fonts.load(`400 40px ${Ne}`),document.fonts.load(`italic 400 40px ${Ne}`),document.fonts.load(`500 20px ${wt}`)])}catch{}const a=Array.from(document.querySelectorAll(".arcana__deck .card")),e=[];for(const r of a)await new Promise(n=>setTimeout(n,0)),e.push((()=>{const n=h=>r.querySelector(h)?.textContent?.trim()??"",s=()=>{const h=document.createElement("canvas");return h.width=H*2,h.height=ce*2,h},o=s(),t=o.getContext("2d");t.scale(2,2),Ft(t,$.ink),t.textAlign="center",t.textBaseline="alphabetic",t.fillStyle=$.brass,t.font=`400 92px ${Ne}`,t.fillText(n(".card__numeral"),H/2,170),ha(t,r.querySelector(".card__glyph"),H/2,440,300),t.fillStyle=$.bone,t.font=`400 76px ${Ne}`,Pt(t,n(".card__name"),H-140).forEach((h,M,b)=>t.fillText(h,H/2,790-(b.length-1-M)*82)),t.fillStyle=$.muted,t.font=`500 22px ${wt}`,t.fillText(n(".card__shape").toUpperCase().split("").join(" "),H/2,870);const l=s(),c=l.getContext("2d");return c.scale(2,2),Ft(c,$["ink-2"]),c.textAlign="center",c.fillStyle=$.ember,c.fillRect(H/2-40,300,80,3),c.fillStyle=$.brass,c.font=`400 54px ${Ne}`,c.fillText(n(".card__numeral"),H/2,250),c.fillStyle=$.bone,c.font=`italic 400 50px ${Ne}`,Pt(c,n(".card__back p"),H-150).forEach((h,M)=>c.fillText(h,H/2,420+M*66)),c.fillStyle=$.muted,c.font=`500 22px ${wt}`,c.fillText(n(".card__name").toUpperCase(),H/2,ce-120),[o,l].map(h=>{const M=new He(h);return M.colorSpace=Oe,M.anisotropy=16,M})})());return e}const D=ct.color,pe=a=>Math.max(0,Math.min(1,a)),Xe=a=>a<.5?4*a*a*a:1-Math.pow(-2*a+2,3)/2,ue=[new C(.95,.35,.2),new C(-.55,.75,.4),new C(-.9,-.25,.45),new C(.2,-.55,.9),new C(.45,.6,-.75),new C(-.3,-.35,-.95)].map(a=>a.normalize()),bt=4.6,at=1,Rt=[.5,.62,.38,.27,.33,.22];function ma(){const a=ue[1],e=ue[5],r=new Fe().identity(),n=(s,o)=>{const t=r.elements,l=[s.x,s.y,s.z];for(let c=0;c<3;c++)for(let f=0;f<3;f++)t[c*3+f]+=o*l[f]*l[c]};return n(a,.75),n(e,-.8),r}const st=new Fe().set(1,.85,0,0,1,0,0,0,1),ot=(()=>{const a=Math.cos(.9),e=Math.sin(.9);return new Fe().set(a*1.15,-e*1.15,0,e*.7,a*.7,0,0,0,1.1)})(),mt=(a,e,r)=>{const n=new Fe;for(let s=0;s<9;s++)n.elements[s]=a.elements[s]+(e.elements[s]-a.elements[s])*r;return n},pt=new Fe().identity();function Ue(a,e,r=46,n=!1){r*=3;const o=72,t=document.createElement("canvas"),l=t.getContext("2d"),c=/[|⟩⟨ψ̂\[\]]/.test(a),f=n?`500 ${r}px "Geist Mono Variable", monospace`:c?`400 ${r}px "STIX Two Math", serif`:`italic 400 ${r}px "Bodoni Moda Variable", serif`;l.font=f;const h=Math.ceil(l.measureText(a).width)+o*2,M=Math.ceil(r*1.6);t.width=h,t.height=M,l.font=f,l.fillStyle=e,l.textBaseline="middle",l.fillText(a,o,M/2);const b=new He(t);b.colorSpace=Oe,b.anisotropy=16;const z=new nt(new lt({map:b,transparent:!0,depthWrite:!1,opacity:0}));return z.scale.set(h/M*.42,.42,1),z}const pa=`
  uniform mat3 uM; uniform float uO;
  varying float vA;
  void main() {
    vec3 p = uM * position;
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    gl_Position = projectionMatrix * mv;
    float r = length(position) / 9.;
    vA = uO * (1. - smoothstep(.7, 1.05, r)) * .8;
  }`,da="uniform vec3 uColor; varying float vA; void main(){ gl_FragColor = vec4(uColor * vA, vA); }",va=`
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
  }`,zt="varying vec3 vC; varying float vA; void main(){ float d = length(gl_PointCoord - .5); if (d > .5) discard; float a = smoothstep(.5, .1, d) * vA; gl_FragColor = vec4(vC * a, a); }",ga=`
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
  }`;async function wa(a,e,r){try{await document.fonts.load('400 40px "STIX Two Math"')}catch{}const n=u=>document.querySelector(`.film__lexicon [data-k="${u}"]`)?.textContent?.trim()??"",s=new De;s.position.set(0,.6,0),a.add(s);const o=[],t=1.6,l=e?4:5;for(let u=-l;u<=l;u++)for(let i=-l;i<=l;i++)(u+i)%2!==0&&!e||(o.push(-l*t,u*t,i*t,l*t,u*t,i*t),o.push(u*t,-l*t,i*t,u*t,l*t,i*t),o.push(u*t,i*t,-l*t,u*t,i*t,l*t));const c=new ee;c.setAttribute("position",new O(new Float32Array(o),3));const f=new q({vertexShader:pa,fragmentShader:da,transparent:!0,depthWrite:!1,blending:Q,uniforms:{uM:{value:new Fe},uO:{value:0},uColor:{value:new g(D.brass).lerp(new g(D.bone),.25).multiplyScalar(1.25)}}}),h=new Wt(c,f);h.frustumCulled=!1,s.add(h);const M=[];for(let u=-l;u<=l;u++)for(let i=-l;i<=l;i++)for(let x=-l;x<=l;x++)((u+i+x)%2===0||e)&&M.push(u*t,i*t,x*t);const b=new ee;b.setAttribute("position",new O(new Float32Array(M),3));const z=new q({transparent:!0,depthWrite:!1,blending:Q,uniforms:{uM:f.uniforms.uM,uO:{value:0},uDpr:{value:r},uColor:{value:new g(D.bone)}},vertexShader:`uniform mat3 uM; uniform float uO, uDpr; varying float vA;
      void main(){ vec3 p = uM * position; vec4 mv = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mv;
        gl_PointSize = clamp(uDpr * 30. / max(.3, -mv.z), 1., 5. * uDpr); vA = uO * (1. - smoothstep(.7, 1.05, length(position) / 9.)); }`,fragmentShader:"uniform vec3 uColor; varying float vA; void main(){ float d = length(gl_PointCoord - .5); if (d > .5) discard; gl_FragColor = vec4(uColor * vA, vA); }"}),N=new Ke(b,z);N.frustumCulled=!1,s.add(N);const he=new Bt({color:new g(D.brass),transparent:!0,opacity:0,depthWrite:!1}),re=ue.map(u=>{const i=new ee().setFromPoints([new C,u.clone().multiplyScalar(bt)]),x=new ft(i,he);return s.add(x),x}),Y=e?450:1100,G=Y*6,fe=new Float32Array(G*3),ne=new Float32Array(G*4);let te=9;const A=()=>(te=te*1664525+1013904223>>>0,te/4294967296);for(let u=0;u<6;u++)for(let i=0;i<Y;i++){const x=u*Y+i,d=ue[u].clone().multiplyScalar(bt),v=()=>Math.sqrt(-2*Math.log(A()+1e-9))*Math.cos(2*Math.PI*A());fe.set([d.x+v()*.32,d.y+v()*.32,d.z+v()*.32],x*3),ne.set([u,A(),0,0],x*4)}const m=new ee;m.setAttribute("position",new O(fe,3)),m.setAttribute("aInfo",new O(ne,4));const E=new q({vertexShader:va,fragmentShader:zt,transparent:!0,depthWrite:!1,blending:Q,uniforms:{uM:{value:new Fe},uO:{value:0},uDpr:{value:r},uTime:{value:0},uAmp:{value:Rt.slice()},uCollapse:{value:0},uBrass:{value:new g(D.brass)},uEmber:{value:new g(D.ember)},uBone:{value:new g(D.bone)},uMuted:{value:new g(D.muted)}}}),k=new Ke(m,E);k.frustumCulled=!1,s.add(k);const X=ue.map((u,i)=>{const x=Ue(n(`reading-${i+1}`),D.bone);return s.add(x),x}),Pe=Ue("|ψ⟩",D.ember,64);s.add(Pe);const le=u=>{const i=new De,x=new ve({color:new g(u).multiplyScalar(1.3),transparent:!0,opacity:0,depthWrite:!1}),d=new j(new jt(.035,.035,1,12),x);d.position.y=.5;const v=new j(new Qt(.13,.42,20),x);return v.position.y=1,i.add(d,v),s.add(i),{g:i,shaft:d,head:v,mat:x}},ye=le(D.ember),Me=le(D.bone),Re=le(D.holo.stops[0]),Ve=new C(0,1,0),Je=new qt,me=(u,i,x)=>{const d=Math.max(.001,i.length());u.g.quaternion.copy(Je.setFromUnitVectors(Ve,i.clone().normalize())),u.shaft.scale.set(1,Math.max(.01,d-.4),1),u.shaft.position.y=(d-.4)/2,u.head.position.y=d-.2,u.mat.opacity=x},ze=u=>new Bt({color:new g(u),transparent:!0,opacity:0,depthWrite:!1}),y=u=>{const i=new ee;i.setAttribute("position",new O(new Float32Array(195),3));const x=new ft(i,ze(u));return x.frustumCulled=!1,s.add(x),x},_=y(D.bone),V=y(D.holo.stops[0]),K=new ee().setFromPoints([new C,new C(1,0,0)]),U=new Dt({color:new g(D.ember).multiplyScalar(1.4),dashSize:.18,gapSize:.12,transparent:!0,opacity:0,depthWrite:!1}),F=new ft(K,U);s.add(F);const ae=Ue("[Â, B̂] |ψ⟩",D.ember,54);s.add(ae);const se=Ue("ÂB̂ |ψ⟩",D.bone,46);s.add(se);const ge=Ue("B̂Â |ψ⟩",D.holo.stops[0],46);s.add(ge);const Ie=new ee().setFromPoints([new C,new C(1,0,0)]),Se=new Dt({color:new g(D.bone),dashSize:.14,gapSize:.1,transparent:!0,opacity:0,depthWrite:!1}),Z=new ft(Ie,Se);s.add(Z);const J=e?150:260,Ee=new Float32Array(J*J*3);for(let u=0;u<J;u++)for(let i=0;i<J;i++)Ee.set([(u/(J-1)-.5)*19,-3.4,(i/(J-1)-.5)*19],(u*J+i)*3);const L=new ee;L.setAttribute("position",new O(Ee,3));const Te=new q({vertexShader:ga,fragmentShader:zt,transparent:!0,depthWrite:!1,blending:Q,uniforms:{uTime:{value:0},uO:{value:0},uDpr:{value:r},uS1:{value:[-2.6,-1]},uS2:{value:[2.6,1]},uBrass:{value:new g(D.brass)},uEmber:{value:new g(D.ember)},uBone:{value:new g(D.bone)}}}),We=new Ke(L,Te);We.frustumCulled=!1,a.add(We);const Le=Ue("Â",D.bone,80),Ge=Ue("B̂",D.bone,80);a.add(Le,Ge);const et=ma(),p=new C,S=new C;return{update(u,i,x){const d=i.space,v=Xe(pe(i.warpOp)),w=pe(i.comm);let T=mt(pt,et,v);w>0&&(T=mt(pt,new Fe().multiplyMatrices(st,ot),Xe(pe(w*1.6-.6))*.6)),f.uniforms.uM.value.copy(T),f.uniforms.uO.value=d*(.5+.5*Math.max(v,Math.min(1,w*2))),z.uniforms.uO.value=d*.7,N.visible=d>.002,E.uniforms.uM.value.copy(T),E.uniforms.uTime.value=u,E.uniforms.uO.value=d*i.readings,s.scale.setScalar(.35+.65*Xe(pe(d)));const W=E.uniforms.uAmp.value,I=Xe(pe(i.collapse));for(let P=0;P<6;P++){const tt=ue[P].clone().applyMatrix3(et).length();let Ce=Rt[P]*(1+(tt-1)*1.4*v);Ce=Ce*(1-I)+(P===at?1:0)*I,W[P]=Math.max(0,Math.min(1,Ce+Math.sin(u*1.3+P)*.04*(1-I))),re[P].visible=d>.01,S.copy(ue[P]).multiplyScalar(bt+.75).applyMatrix3(T),X[P].position.copy(S),X[P].material.opacity=d*i.readings*(.35+.65*W[P])*(P===at?1:1-I*.85)}he.opacity=d*i.readings*.35,p.set(0,0,0);for(let P=0;P<6;P++)p.addScaledVector(ue[P],W[P]);p.normalize().multiplyScalar(3.4).applyMatrix3(T),I>0&&p.lerp(ue[at].clone().multiplyScalar(3.8),I),me(ye,p,d*i.arrow*(1-w*.7)),Pe.position.copy(p).multiplyScalar(1.12),Pe.material.opacity=d*i.arrow*(1-w*.7);const $e=ue[at].clone().multiplyScalar(p.dot(ue[at]));Z.geometry.attributes.position.setXYZ(0,p.x,p.y,p.z),Z.geometry.attributes.position.setXYZ(1,$e.x,$e.y,$e.z),Z.geometry.attributes.position.needsUpdate=!0,Z.computeLineDistances(),Se.opacity=d*Math.sin(pe(i.collapse)*Math.PI)*.9;const Vt=new C(.6,.9,.4).normalize().multiplyScalar(4.2),vt=(P,tt,Ce)=>{const ht=pe(Ce*2),qe=pe(Ce*2-1);return Vt.clone().applyMatrix3(mt(pt,P,Xe(ht))).applyMatrix3(mt(pt,tt,Xe(qe)))},At=(P,tt,Ce)=>{const ht=P.geometry.attributes.position;for(let qe=0;qe<=64;qe++){const gt=vt(tt,Ce,qe/64*w);ht.setXYZ(qe,gt.x,gt.y,gt.z)}ht.needsUpdate=!0,P.material.opacity=d*Math.min(1,w*3)*.9};At(_,ot,st),At(V,st,ot);const je=vt(ot,st,w),Qe=vt(st,ot,w);me(Me,je,d*Math.min(1,w*3)),me(Re,Qe,d*Math.min(1,w*3)),se.position.copy(je).multiplyScalar(1.1).add(new C(-.9,.3,0)),ge.position.copy(Qe).multiplyScalar(1.1).add(new C(.9,.3,0)),se.material.opacity=ge.material.opacity=d*pe(w*3-1.8),F.geometry.attributes.position.setXYZ(0,je.x,je.y,je.z),F.geometry.attributes.position.setXYZ(1,Qe.x,Qe.y,Qe.z),F.geometry.attributes.position.needsUpdate=!0,F.computeLineDistances(),U.opacity=d*pe(w*4-3),ae.position.copy(je).add(Qe).multiplyScalar(.5).add(new C(0,-.7,0)),ae.material.opacity=U.opacity,Te.uniforms.uTime.value=u,Te.uniforms.uO.value=i.interf,We.visible=i.interf>.002,Le.position.set(-2.6,-2.3,-1),Ge.position.set(2.6,-2.3,1),Le.material.opacity=Ge.material.opacity=i.interf,h.visible=k.visible=d>.002}}}const B=ct.color,Ae=[-17,-14.5,-12,-9.5,-7],ba=-25,xa=-4.6,_e=5,ya=a=>()=>(a=a*1664525+1013904223>>>0,a/4294967296),It=(a,e)=>{const r=parseInt(a.slice(1),16);return`rgba(${r>>16},${r>>8&255},${r&255},${e})`},we=a=>a<.5?4*a*a*a:1-Math.pow(-2*a+2,3)/2,de=a=>Math.max(0,Math.min(1,a)),Ma=()=>({uH1:{value:new g(B.holo.stops[0])},uH2:{value:new g(B.holo.stops[1])},uH3:{value:new g(B.holo.stops[2])}}),Sa="vec3 holo(float g) { g = fract(g) * 2.; return g < 1. ? mix(uH1, uH2, g) : mix(uH2, uH3, g - 1.); }",Ta=`
  attribute vec4 aSeed; attribute vec3 aTarget;
  uniform float uTime, uStream, uDpr, uFocus, uAlt, uSize;
  uniform float uPX[5];
  uniform vec3 uMuted, uBrass, uEmber, uBone;
  varying vec3 vColor; varying float vAlpha;
  float hash(float n) { return fract(sin(n) * 43758.5453); }
  void main() {
    float s = fract(uTime * .055 + aSeed.x);
    float x = mix(${ba.toFixed(1)}, ${xa.toFixed(1)}, s / .86);
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
  }`,Ca=`
  varying vec3 vColor; varying float vAlpha;
  void main() { float d = length(gl_PointCoord - .5); if (d > .5) discard; float a = smoothstep(.5, 0., d) * vAlpha; gl_FragColor = vec4(vColor * a, a); }`;function Aa(a){const e=ya(19),r=new Float32Array(a*4),n=new Float32Array(a*3),s=Be.samples,[o,t]=Be.ringCenter;for(let c=0;c<a;c++){const f=Math.sqrt(-2*Math.log(e()+1e-9))*Math.cos(2*Math.PI*e()),h=Math.sqrt(-2*Math.log(e()+1e-9))*Math.cos(2*Math.PI*e());r.set([e(),f*.5,h*.5,e()],c*4);const M=s[Math.floor(e()*s.length)];n.set([(M[0]-o)/8,-(M[1]-t)/8,(e()-.5)*.4],c*3)}const l=new ee;return l.setAttribute("position",new O(n.slice(),3)),l.setAttribute("aSeed",new O(r,4)),l.setAttribute("aTarget",new O(n,3)),l}function _a(a,e,r){const o=document.createElement("canvas");o.width=512*2,o.height=680*2;const t=o.getContext("2d");t.scale(2,2);const l=t.createLinearGradient(0,0,512,680);l.addColorStop(0,It(B["ink-2"],.55)),l.addColorStop(1,It(B.ink,.25)),t.fillStyle=l,t.fillRect(0,0,512,680),t.strokeStyle=B.brass,t.lineWidth=4,t.strokeRect(8,8,496,664),t.strokeStyle=B["brass-dim"],t.lineWidth=2,t.strokeRect(26,26,460,628);for(let f=0;f<40;f++){const h=60+f*14;t.strokeStyle=B["brass-dim"],t.lineWidth=f%5?1:2,t.beginPath(),t.moveTo(40,h),t.lineTo(f%5?52:62,h),t.stroke()}t.textAlign="center",t.fillStyle=B.brass,t.font='400 64px "Bodoni Moda Variable", serif',t.fillText(a,512/2,150),t.fillStyle=B.ember,t.fillRect(512/2-36,190,72,3),t.fillStyle=B.bone,t.font=`400 ${e.length>10?70:84}px "Bodoni Moda Variable", serif`,t.fillText(e,512/2,380),t.fillStyle=B.muted,t.font='500 24px "Geist Mono Variable", monospace',t.fillText(r.toUpperCase().split("").join(" "),512/2,560);const c=new He(o);return c.colorSpace=Oe,c.anisotropy=16,c}function Ba(a){const r=document.createElement("canvas");r.width=r.height=512;const n=r.getContext("2d"),s=512/64;n.scale(s,s),n.lineWidth=1.8,n.lineCap="round",n.lineJoin="round",a.querySelectorAll("path, circle").forEach(t=>{let l;t.tagName==="path"?l=new Path2D(t.getAttribute("d")):(l=new Path2D,l.arc(+t.getAttribute("cx"),+t.getAttribute("cy"),+t.getAttribute("r"),0,Math.PI*2)),t.classList.contains("dot")?(n.fillStyle=B.ember,n.fill(l)):(n.strokeStyle=t.classList.contains("faint")?B["brass-dim"]:B.brass,n.stroke(l))});const o=new He(r);return o.colorSpace=Oe,o}function Da(){const a=document.createElement("canvas");a.width=a.height=64;const e=a.getContext("2d"),r=e.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,B.bone),r.addColorStop(.25,B.ember),r.addColorStop(1,"transparent"),e.fillStyle=r,e.fillRect(0,0,64,64);const n=new He(a);return n.colorSpace=Oe,n}function xt(a){return new q({transparent:!0,depthWrite:!1,blending:Q,side:Ct,uniforms:{uFill:{value:0},uO:{value:0},uT:{value:0},uColor:{value:new g(B.brass)},...Ma()},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`uniform float uFill, uO, uT; uniform vec3 uColor, uH1, uH2, uH3; varying vec2 vUv; ${Sa}
      void main(){
        ${a==="gauge"?"float on = step(vUv.x, uFill); vec3 c = mix(uColor * .25, uColor * 1.6, on); gl_FragColor = vec4(c * uO, uO * mix(.35, 1., on));":"vec3 c = holo(vUv.x + uT * .15) * 1.5; gl_FragColor = vec4(c * uO, uO);"}
      }`})}function ka(a,e,r,n){const s=Array.from(document.querySelectorAll(".film__plates li")).map(A=>A.textContent?.trim()??""),o=s[5]??"",t=["I","II","III","IV","V"],l=new q({vertexShader:Ta,fragmentShader:Ca,transparent:!0,depthWrite:!1,blending:Q,uniforms:{uTime:{value:0},uStream:{value:0},uDpr:{value:r},uFocus:{value:-1},uAlt:{value:0},uSize:{value:1.7},uPX:{value:Ae.slice()},uMuted:{value:new g(B.muted)},uBrass:{value:new g(B.brass)},uEmber:{value:new g(B.ember)},uBone:{value:new g(B.bone)}}}),c=new Ke(Aa(e?7e3:16e3),l);c.frustumCulled=!1,a.add(c);const f=s.slice(0,5).map((A,m)=>{const E=new ve({map:_a(t[m],A,o),transparent:!0,opacity:0,depthWrite:!1,side:Ct}),k=new j(new Ut(2.4,3.19),E),X=new De;return X.add(k),a.add(X),{g:X,mat:E,flash:0}}),h=xt("holo"),M=new j(new ke(1,.025,8,160),h);M.position.set(0,.6,0),a.add(M);const b=new j(new ke(1,.012,8,160),h);b.position.set(0,.6,0),a.add(b);const N=Array.from(document.querySelectorAll(".arcana__deck .card__glyph")).map(A=>{const m=new nt(new lt({map:Ba(A),transparent:!0,opacity:0,depthWrite:!1,blending:Q}));return a.add(m),m}),he=Da(),re=Array.from({length:12},()=>{const A=new nt(new lt({map:he,transparent:!0,opacity:0,depthWrite:!1,blending:Q}));return A.scale.setScalar(.45),a.add(A),A}),Y=new ve({color:new g(B.ember).multiplyScalar(2.2),transparent:!0,opacity:0,depthWrite:!1,blending:Q}),G=new j(new ke(2.2,.025,8,160),Y);G.rotation.x=Math.PI/2,a.add(G);const fe=[2.5,2.85,3.2].map((A,m)=>{const E=xt("gauge"),k=new j(new ke(A,.035,8,200),E);return k.position.set(.3,_e+.9,-2.6),a.add(k),{mesh:k,m:E,target:[.78,.86,.93][m]}}),ne=[1.45,1.85,2.25].map((A,m)=>{const E=xt("holo"),k=new j(new ke(A,.03,8,200),E);return a.add(k),{mesh:k,m:E,tilt:[.4,-.7,1.2][m],speed:[.5,-.35,.25][m]}}),te=new C;return{update(A,m,E){l.uniforms.uTime.value=A,l.uniforms.uStream.value=m.stream,l.uniforms.uFocus.value=m.plateFocus,l.uniforms.uAlt.value=m.alt,c.visible=m.stream>.001;const k=we(de(m.plateSwap)),X=Ae.slice();X[2]=Ae[2]+(Ae[4]-Ae[2])*k,X[4]=Ae[4]+(Ae[2]-Ae[4])*k;const Pe=l.uniforms.uPX.value;for(let y=0;y<5;y++)Pe[y]=X[y];f.forEach((y,_)=>{const V=_===2?Math.sin(k*Math.PI)*2.4:_===4?-Math.sin(k*Math.PI)*1.6:0,K=new C(X[_],.7+V,_===2||_===4?Math.sin(k*Math.PI)*(_===2?1.5:-1.5):0),U=we(de(m.stack*1.7-_*.17)),F=we(de(m.deliver)),ae=new C(-1.3+_*.65,_e-.6+_*.5,-_*.55),se=new C(.3,_e+1.6,-1.1),ge=ae.lerp(se,F);y.g.position.lerpVectors(K,ge,U),y.g.rotation.set(0,(1-U)*1.05+U*(-.32+Math.sin(A*.4+_)*.04),0),y.g.scale.setScalar(1-.36*U+.12*F*U);const Ie=Math.abs(_-m.plateFocus)<.5?1:0,Se=_===3?m.fault:0;y.flash=Math.max(0,y.flash-E*1.5),_===3&&m.fault>.95&&(y.flash=1);const Z=1+Ie*1.2+y.flash*.6*(1-m.fault)+we(de(m.deliver))*.5;y.mat.color.setRGB(Z,Z,Z).lerp(new g(B.ember).multiplyScalar(1.6+Math.sin(A*30)*.4),Se);const J=_===4?1:1-.75*we(de(m.deliver));y.mat.opacity=m.plates*J*(.92-.25*(1-Ie)*(m.plateFocus>=0?1:0))});const le=m.shockwave;h.uniforms.uO.value=le>0&&le<1?Math.pow(1-le,1.4):0,h.uniforms.uT.value=A,M.scale.setScalar(.4+le*11),b.scale.setScalar(.3+Math.max(0,le-.12)*13),M.lookAt(te.set(m.cam.x,m.cam.y,m.cam.z)),b.lookAt(te);const ye=we(de(m.pick)),Me=new C(.3,_e+.9,-.8),Re=new C(m.cam.x,m.cam.y,m.cam.z).sub(Me).normalize(),Ve=new C(0,1,0).cross(Re).normalize(),Je=Re.clone().cross(Ve).normalize();N.forEach((y,_)=>{const V=_/N.length*Math.PI*2+A*(1.4-ye*1.1),K=Me.clone().addScaledVector(Ve,Math.cos(V)*3.1).addScaledVector(Je,Math.sin(V)*3.1),U=_===0,F=new C(.3,_e+2.1+(m.stack>.5?1.3+we(de(m.deliver))*.6:0),-.8);y.position.copy(U?K.clone().lerp(F,ye):K),y.scale.setScalar(U?1.1+ye*.9:1.1),y.material.opacity=m.glyphs*(U?1:1-ye)});const me=n(1).clone().setY(.2),ze=new C(0,_e+1.2,0);re.forEach((y,_)=>{const V=(A*.42+_/re.length)%1,K=_%2===1,U=K?1-V:V,F=me.clone().lerp(ze,.5).add(new C(0,3.2,0)),ae=me.clone().lerp(F,U),se=F.clone().lerp(ze,U);y.position.copy(ae.lerp(se,U)),y.material.opacity=m.pulses*Math.sin(V*Math.PI),y.material.color.set(K?B.brass:B.bone)}),G.position.set(.3,_e-1.9+m.scan*4.6,-1.1),Y.opacity=Math.sin(de(m.scan)*Math.PI)*m.plates,fe.forEach(y=>{y.m.uniforms.uFill.value=m.gauges*y.target,y.m.uniforms.uO.value=.75*Math.min(1,m.gauges*4)*(1-we(de(m.deliver))),y.mesh.rotation.z=Math.PI/2}),ne.forEach((y,_)=>{y.mesh.position.set(.3,_e+1.6,-1.1);const V=we(de(m.verifyRings*1.4-_*.2));y.mesh.scale.setScalar(2.2-1.2*V),y.mesh.rotation.set(Math.PI/2+y.tilt*(1-V*.4),A*y.speed,y.tilt),y.m.uniforms.uO.value=V*.6,y.m.uniforms.uT.value=A+_})}}}const R=ct.color,xe=ct.effects,oe=xe.film,yt={cam:{x:0,y:.3,z:9.5,tx:0,ty:.6,tz:0,fov:oe["fov-deg"]},measure:0,band:0,bandY:.5,dive:0,armillary:0,ringTilt:0,ringSpin:.25,swap:0,scatter:0,dial:0,cards:0,cardFocus:0,stations:0,stationLit:0,holoArc:0,bloom:1,shock:0,glow:1,stream:0,plates:0,plateFocus:-1,plateSwap:0,alt:0,ghost:0,shockwave:0,glyphs:0,pick:0,pulses:0,stack:0,scan:0,fault:0,gauges:0,deliver:0,verifyRings:0,space:0,readings:0,arrow:0,warpOp:0,comm:0,interf:0,collapse:0,warp:0,drift:1,flame:1,pointer:new ie},Fa=`
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
  }`,Pa=`
  varying vec3 vColor; varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - .5);
    if (d > .5) discard;
    float a = smoothstep(.5, 0., d) * vAlpha;
    gl_FragColor = vec4(vColor * a, a);
  }`;function Ra(a,e){let r=1/0;for(let n=0;n<e.length-1;n++){const[s,o]=e[n],[t,l]=e[n+1],c=t-s,f=l-o,h=Math.max(0,Math.min(1,((a[0]-s)*c+(a[1]-o)*f)/(c*c+f*f||1)));r=Math.min(r,Math.hypot(a[0]-s-h*c,a[1]-o-h*f))}return r}const Tt=a=>()=>(a=a*1664525+1013904223>>>0,a/4294967296),Ye=a=>Math.sqrt(-2*Math.log(a()+1e-9))*Math.cos(2*Math.PI*a()),Mt=1/8;function za(a){const e=Tt(7),r=Be.wave.replace(/^M/,"").split(" L").map(b=>b.trim().split(" ").map(Number)),[n,s]=Be.dot,o=Be.samples.filter(b=>Ra(b,r)>1&&Math.hypot(b[0]-n,b[1]-s)>2.35),[t,l]=Be.ringCenter,c=new Float32Array(a*3),f=new Float32Array(a*3),h=new Float32Array(a*4);for(let b=0;b<a;b++){c[b*3]=Ye(e)*5.5,c[b*3+1]=Ye(e)*3.6,c[b*3+2]=Ye(e)*5+2.5;const z=e();let N=0,he,re,Y;if(z<.17){N=1;const G=e()<.6,fe=G?Be.rings[0]:Be.rings[1],ne=e()*Math.PI*2,te=(e()-.5)*(G?1.1:.45);he=t+Math.cos(ne)*(fe+te),re=l+Math.sin(ne)*(fe+te),Y=(e()-.5)*.5}else{N=z>.968?2:0;const G=o[Math.floor(e()*o.length)];he=G[0]+Ye(e)*.2,re=G[1]+Ye(e)*.2,Y=Ye(e)*2}f[b*3]=(he-t)*Mt,f[b*3+1]=-(re-l)*Mt,f[b*3+2]=Y*Mt,h[b*4]=e(),h[b*4+1]=N,h[b*4+2]=e()<xe["point-cloud"]["holo-share"]?1:0,h[b*4+3]=N===0?Math.min(1,Math.max(0,(57-re)/54)):0}const M=new ee;return M.setAttribute("position",new O(f.slice(),3)),M.setAttribute("aA",new O(c,3)),M.setAttribute("aB",new O(f,3)),M.setAttribute("aData",new O(h,4)),M}function Et(a,e="transparent"){const r=document.createElement("canvas");r.width=r.height=128;const n=r.getContext("2d"),s=n.createRadialGradient(64,64,0,64,64,64);s.addColorStop(0,a),s.addColorStop(1,e),n.fillStyle=s,n.fillRect(0,0,128,128);const o=new He(r);return o.colorSpace=Oe,o}const Ia=["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];function Ea(a,e){const n=document.createElement("canvas");n.width=n.height=2048;const s=n.getContext("2d"),o=2048/2/e,t=2048/2;s.strokeStyle=R.brass,s.fillStyle=R.brass;const l=(f,h)=>{s.lineWidth=h,s.beginPath(),s.arc(t,t,f*o,0,Math.PI*2),s.stroke()};l(e*.995,3),l(a*1.01,2),l(a+(e-a)*.62,1.2);for(let f=0;f<360;f++){const h=f/360*Math.PI*2,M=f%30===0?.55:f%5===0?.32:.16,b=e*.99,z=e-(e-a)*M;s.lineWidth=f%30===0?3:1.4,s.beginPath(),s.moveTo(t+Math.cos(h)*b*o,t+Math.sin(h)*b*o),s.lineTo(t+Math.cos(h)*z*o,t+Math.sin(h)*z*o),s.stroke()}s.font=`${Math.round((e-a)*o*.26)}px "Bodoni Moda Variable", serif`,s.textAlign="center",s.textBaseline="middle",Ia.forEach((f,h)=>{const M=h/12*Math.PI*2-Math.PI/2,b=a+(e-a)*.3;s.save(),s.translate(t+Math.cos(M)*b*o,t+Math.sin(M)*b*o),s.rotate(M+Math.PI/2),s.fillText(f,0,0),s.restore()});const c=new He(n);return c.colorSpace=Oe,c.anisotropy=4,c}const Wa={uniforms:{tDiffuse:{value:null},uTime:{value:0},uShock:{value:0},uAberration:{value:oe.aberration},uGrain:{value:oe.grain},uVignette:{value:oe.vignette}},vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
    uniform sampler2D tDiffuse; uniform float uTime, uShock, uAberration, uGrain, uVignette; varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main() {
      vec2 d = vUv - .5;
      float k = uAberration + uShock;
      vec3 col = vec3(texture2D(tDiffuse, vUv + d * k).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - d * k).b);
      col *= 1. - uVignette * smoothstep(.25, .85, length(d * vec2(1.15, 1.)));
      col += (hash(vUv * 1000. + fract(uTime * 7.)) - .5) * uGrain * (.35 + .65 * smoothstep(0., .25, dot(col, vec3(.333))));
      gl_FragColor = vec4(col, 1.);
    }`},be=()=>new Promise(a=>setTimeout(a,0));async function La(a,e){const r=new Nt({antialias:!1,powerPreference:"high-performance"}),n=Math.min(window.devicePixelRatio||1,e?xe["point-cloud"]["dpr-cap-mobile"]:xe["point-cloud"]["dpr-cap"]);r.setPixelRatio(n),r.setClearColor(new g(R.void),1),a.append(r.domElement);const s=new Xt;s.fog=new Yt(new g(R.void).getHex(),.018);const o=new Kt(yt.cam.fov,1,.05,400),t=new C;await be();const l=new q({vertexShader:Fa,fragmentShader:Pa,transparent:!0,depthWrite:!1,blending:Q,uniforms:{uMeasure:{value:0},uTime:{value:0},uSize:{value:xe["point-cloud"]["size-px"]},uDpr:{value:n},uBand:{value:0},uBandY:{value:.5},uDive:{value:0},uGhost:{value:0},uAlt:{value:0},uFocus:{value:10},uFlameO:{value:1},uEmber:{value:new g(R.ember)},uEmberDeep:{value:new g(R["ember-deep"])},uBrass:{value:new g(R.brass)},uBone:{value:new g(R.bone)},uMuted:{value:new g(R.muted)},uH1:{value:new g(R.holo.stops[0])},uH2:{value:new g(R.holo.stops[1])},uH3:{value:new g(R.holo.stops[2])}}}),c=new Ke(za(e?xe["point-cloud"]["points-mobile"]:xe["point-cloud"]["points-desktop"]),l);c.frustumCulled=!1,s.add(c);const f=new nt(new lt({map:Et(R["ember-deep"]),blending:Q,transparent:!0,depthWrite:!1}));f.scale.set(9,11,1),f.position.set(0,.9,-.5),s.add(f),await be();{const p=Tt(3),S=e?1600:4e3,u=new Float32Array(S*3),i=new Float32Array(S*4);for(let w=0;w<S;w++){const T=p()*2-1,W=p()*Math.PI*2,I=45+p()*60,$e=Math.sqrt(1-T*T);u[w*3]=Math.cos(W)*$e*I,u[w*3+1]=T*I,u[w*3+2]=Math.sin(W)*$e*I,i[w*4]=p(),i[w*4+1]=p()<.7?2:1,i[w*4+3]=0}const x=new ee;x.setAttribute("position",new O(u,3)),x.setAttribute("aA",new O(u,3)),x.setAttribute("aB",new O(u,3)),x.setAttribute("aData",new O(i,4));const d=l.clone();d.uniforms.uMeasure.value=1,d.uniforms.uSize.value=4.5;const v=new Ke(x,d);v.frustumCulled=!1,s.add(v)}await be();const h=new g(R.brass),M=[],b=new De;s.add(b);const z=e?[4.2,5.2,6.4]:[4,4.7,5.4,6.2,7.1],N=[[1.1,.2,0],[.3,.9,.2],[-.6,-.3,.5],[1.45,0,.3],[.15,-1.2,-.2]],he=z.map((p,S)=>new C(Math.cos(S*2.1)*6,Math.sin(S*1.7)*4,-Math.abs(Math.sin(S))*5)),re=z.map((p,S)=>{const u=new De,i=new ve({color:h,transparent:!0,opacity:0,depthWrite:!1});M.push(i);const x=new j(new ke(p,S===z.length-1?.022:.014,6,320),i);if(u.add(x),S===z.length-1||S===1){const d=S===1?72:144,v=new Zt(new Jt(.012,.12,.012),i,d),w=new ea;for(let T=0;T<d;T++){const W=T/d*Math.PI*2,I=T%6===0?1.8:1;w.position.set(Math.cos(W)*(p-.06*I),Math.sin(W)*(p-.06*I),0),w.rotation.set(0,0,W+Math.PI/2),w.scale.set(1,I,1),w.updateMatrix(),v.setMatrixAt(T,w.matrix)}u.add(v)}return b.add(u),{pivot:u,rad:p,tilt:N[S%N.length],speed:(S%2?-1:1)*(.07+S*.025)}});await be();const Y=new ve({map:Ea(7.7,8.9),color:new g(1,1,1).multiplyScalar(.8),transparent:!0,opacity:0,side:Ct,depthWrite:!1}),G=new j(new ta(7.7,8.9,256,1),Y);G.rotation.x=-1.18,G.position.y=-.6,s.add(G),await be();const fe=oe["orbit-radius"],ne=new De;s.add(ne);const te=await fa(),A=te.map(([p,S],u)=>{const i=new De,x=new De,d=u/te.length*Math.PI*2;i.position.set(Math.sin(d)*fe,0,Math.cos(d)*fe),i.rotation.y=d;const v=new ve({map:p,transparent:!0,opacity:0,depthWrite:!1}),w=new ve({map:S,transparent:!0,opacity:0,depthWrite:!1}),T=new Ut(2.2,3.575),W=new j(T,v),I=new j(T,w);return I.rotation.y=Math.PI,x.add(W,I),i.add(x),ne.add(i),{flipper:x,fm:v,bm:w,flip:0}});await be();const m=oe["rite-radius"],E=new j(new ke(m,.018,6,360),new ve({color:h,transparent:!0,opacity:0,depthWrite:!1}));E.rotation.x=Math.PI/2,s.add(E);const k=p=>-Math.PI/2+.35+p*.42,X=p=>new C(Math.cos(k(p))*m,0,-Math.sin(k(p))*m),Pe=Et(R.bone),le=Array.from({length:6},(p,S)=>{const u=new j(new aa(.08,16,12),new ve({color:h.clone(),transparent:!0,opacity:0})),i=new nt(new lt({map:Pe,color:h.clone(),blending:Q,transparent:!0,opacity:0,depthWrite:!1}));i.scale.set(1.1,1.1,1);const x=X(S);return u.position.copy(x),i.position.copy(x),s.add(u,i),{core:u,s:i}}),ye=k(5)-k(4),Me=new q({transparent:!0,depthWrite:!1,blending:Q,uniforms:{uT:{value:0},uO:{value:0},uH1:{value:new g(R.holo.stops[0])},uH2:{value:new g(R.holo.stops[1])},uH3:{value:new g(R.holo.stops[2])}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }",fragmentShader:`uniform float uT, uO; uniform vec3 uH1, uH2, uH3; varying vec2 vUv;
      void main(){ float g = fract(vUv.x + uT * .2) * 2.; vec3 c = g < 1. ? mix(uH1, uH2, g) : mix(uH2, uH3, g - 1.); gl_FragColor = vec4(c * uO * 1.6, uO); }`}),Re=new j(new ke(m,.045,8,64,ye),Me);Re.rotation.set(Math.PI/2,0,k(4)),s.add(Re),await be(),await be();const Ve=ka(s,e,n,X);await be();const Je=await wa(s,e,n);s.add(o);const me=e?500:1400,ze=new Float32Array(me*6),y=new Float32Array(me*8);{const p=Tt(23);for(let S=0;S<me;S++){const u=p()*Math.PI*2,i=1.2+Math.pow(p(),.6)*14,x=p(),d=p();for(let v=0;v<2;v++)ze.set([Math.cos(u)*i,Math.sin(u)*i,0],S*6+v*3),y.set([x,v,d,0],S*8+v*4)}}const _=new ee;_.setAttribute("position",new O(ze,3)),_.setAttribute("aS",new O(y,4));const V=new q({transparent:!0,depthWrite:!1,depthTest:!1,blending:Q,uniforms:{uT:{value:0},uW:{value:0},uBone:{value:new g(R.bone)},uBrass:{value:new g(R.brass)},uH:{value:new g(R.holo.stops[0])}},vertexShader:`attribute vec4 aS; uniform float uT, uW; uniform vec3 uBone, uBrass, uH; varying vec3 vC; varying float vA;
      void main(){ float z = -2. - mod(aS.x * 120. - uT * 60. * (.4 + uW), 120.);
        vec3 p = vec3(position.xy, z + aS.y * uW * 9.);
        gl_Position = projectionMatrix * vec4(p, 1.);
        vC = aS.z < .7 ? uBone : aS.z < .92 ? uBrass : uH; vA = uW * (1. - smoothstep(60., 120., -z)) * (.3 + .7 * aS.y); }`,fragmentShader:"varying vec3 vC; varying float vA; void main(){ gl_FragColor = vec4(vC * vA, vA); }"}),K=new Wt(_,V);K.frustumCulled=!1,o.add(K);const U=new it(2,2,{type:rt,samples:oe.msaa}),F=new la(r,U);F.addPass(new ca(s,o));const ae=new Ze(new ie(256,256),oe["bloom-strength"],oe["bloom-radius"],oe["bloom-threshold"]);F.addPass(ae);const se=new Ot(Wa);F.addPass(se),new URLSearchParams(location.search).has("debug")&&(window.__film={bloom:ae,film:se,composer:F,scene:s,params:yt,flame:c,glow:f});const ge=()=>{const p=a.clientWidth,S=a.clientHeight;r.setSize(p,S,!1),F.setSize(p,S),ae.resolution.set(p*(e?.5:1),S*(e?.5:1)),o.aspect=p/S,o.updateProjectionMatrix()};ge();const Ie=new ResizeObserver(ge);Ie.observe(a);let Se=0,Z=!1,J=!1,Ee=performance.now(),L=0,Te=1/60,We=0;const Le=p=>{if(Se=requestAnimationFrame(Le),!Z)return;const S=(p-Ee)/1e3,u=Math.min(.05,S);if(Ee=p,L+=u,Te=Te*.95+S*.05,We+=S,We>1.2){const v=e?xe["point-cloud"]["dpr-cap-mobile"]:xe["point-cloud"]["dpr-cap"],w=r.getPixelRatio(),T=Te>1/40?Math.max(Math.min(1,devicePixelRatio||1),w-.25):Te<1/75?Math.min(Math.min(devicePixelRatio||1,v),w+.25):w;T!==w&&(r.setPixelRatio(T),F.setPixelRatio(T),ge(),l.uniforms.uDpr.value=T),We=0}const i=yt,x=i.drift;o.position.set(i.cam.x+i.pointer.x*.35+Math.sin(L*.11)*.55*x,i.cam.y-i.pointer.y*.22+Math.sin(L*.07)*.28*x,i.cam.z+Math.cos(L*.09)*.45*x),t.set(i.cam.tx,i.cam.ty,i.cam.tz),o.lookAt(t),Math.abs(o.fov-i.cam.fov)>.01&&(o.fov=i.cam.fov,o.updateProjectionMatrix());const d=l.uniforms;d.uTime.value=L,d.uMeasure.value=i.measure,d.uBand.value=i.band,d.uBandY.value=i.bandY,d.uDive.value=i.dive,f.material.opacity=.18*i.measure*i.glow*(1-i.dive),re.forEach((v,w)=>{const T=1-i.ringTilt;v.pivot.rotation.set(v.tilt[0]*T+L*v.speed*i.ringSpin*T,v.tilt[1]*T+L*v.speed*.6*i.ringSpin,v.tilt[2]*T);const W=w===1?1+(z[2]/z[1]-1)*i.swap:w===2?1+(z[1]/z[2]-1)*i.swap:1,I=(1-i.scatter*.6)*W;v.pivot.scale.setScalar(I),v.pivot.position.copy(he[w]).multiplyScalar(i.scatter),M[w].opacity=i.armillary*(.55+.25*(w%2))}),G.rotation.z=L*.02,Y.opacity=i.dial*.75,ne.rotation.y=-(i.cardFocus/A.length)*Math.PI*2+L*.01*(1-i.cards),A.forEach((v,w)=>{v.flipper.rotation.y=v.flip*Math.PI;const T=A.length,W=((w-i.cardFocus)%T+T)%T,I=1-Math.min(1,Math.min(W,T-W)/.9);v.fm.opacity=v.bm.opacity=i.cards*(.1+.9*Math.max(0,I))}),E.material.opacity=i.stations*.7,le.forEach((v,w)=>{const T=Math.max(0,Math.min(1,i.stationLit-w)),W=h.clone().lerp(new g(R.ember),T);v.core.material.color.copy(W),v.core.material.opacity=i.stations,v.s.material.color.copy(W),v.s.material.opacity=i.stations*(.15+.45*T),v.s.scale.setScalar(.35+T*.3+Math.sin(L*3+w)*.04*T)}),Me.uniforms.uT.value=L,Me.uniforms.uO.value=i.holoArc,d.uGhost.value=i.ghost,d.uAlt.value=i.alt,d.uFlameO.value=i.flame,Ve.update(L,i,u),Je.update(L,i,o.position),d.uFocus.value=o.position.distanceTo(t),V.uniforms.uT.value=L,V.uniforms.uW.value=i.warp,K.visible=i.warp>.002,se.uniforms.uTime.value=L,se.uniforms.uShock.value=i.shock*oe.shock,ae.strength=oe["bloom-strength"]*i.bloom,F.render()},Ge=()=>{Z=J&&document.visibilityState==="visible",Ee=performance.now()};document.addEventListener("visibilitychange",Ge);const et=[];s.traverse(p=>{p.visible||(et.push(p),p.visible=!0)});try{await r.compileAsync(s,o)}catch{r.compile(s,o)}return et.forEach(p=>p.visible=!1),F.render(),{play(){J||(J=!0,Z=document.visibilityState==="visible",Ee=performance.now(),Se=requestAnimationFrame(Le))},flipCard(p,S){A.forEach((u,i)=>sa.to(u,{flip:i===p&&S?1:0,duration:1.1,ease:"power3.inOut"}))},dispose(){cancelAnimationFrame(Se),Ie.disconnect(),document.removeEventListener("visibilitychange",Ge),s.traverse(p=>{const S=p;S.geometry?.dispose();const u=S.material;u?.map?.dispose(),u?.dispose?.()}),F.dispose(),r.dispose(),r.domElement.remove()}}}export{La as createWorld,yt as params};
