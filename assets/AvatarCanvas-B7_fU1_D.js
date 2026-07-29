import{j as s}from"./motion-6bh6by0c.js";import{r}from"./react-CjXtRb-8.js";import{C as xe,E as ye,H as Ee,B as ge,a as Ae,b as Re,T as we,c as be,u as V,V as G,d as R,e as B,f as Te,F as Ie,g as Se,h as Ce,M as x}from"./webgl-D3OAreru.js";const ke={shaded:{url:"/models/avatar.glb",lit:!1},pbr:{url:"/models/avatar_pbr.glb",lit:!0}},Me="shaded",q=ke[Me].url,_e=Math.PI/180,Le=5.2,Fe=32,Be={about:{fill:.9,topMargin:.13,x:0,rotY:0,opacity:1,rim:"#8b93ff",rimAmount:.55,tint:"#ffffff",tintAmount:0},trajectory:{fill:.84,topMargin:.19,x:.54,rotY:-.28,opacity:1,rim:"#fbbf24",rimAmount:.5,tint:"#ffe3b0",tintAmount:.1},expertise:{fill:.82,topMargin:.21,x:-.54,rotY:.3,opacity:1,rim:"#22d3ee",rimAmount:.55,tint:"#c9ecff",tintAmount:.12},projects:{fill:.83,topMargin:.2,x:.52,rotY:-.24,opacity:1,rim:"#a78bfa",rimAmount:.55,tint:"#e4d9ff",tintAmount:.1},academic:{fill:.74,topMargin:.36,x:.44,rotY:-.14,opacity:1,rim:"#818cf8",rimAmount:.42,tint:"#ffffff",tintAmount:0}},k={fill:.75,topMargin:.28,x:0,rotY:0,rim:"#8b93ff",tint:"#ffffff",tintAmount:0},ze={about:{...k,opacity:.9,rimAmount:.5},trajectory:{...k,opacity:0,rimAmount:0},expertise:{...k,opacity:0,rimAmount:0},projects:{...k,opacity:0,rimAmount:0},academic:{...k,opacity:0,rimAmount:0}};class Ye extends r.Component{constructor(i){super(i),this.state={hasError:!1,attempt:0}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(i,c){console.warn("3D Avatar Canvas error (attempt",this.state.attempt+1,"):",i,c),this.state.attempt<2&&(V.clear(q),this.retryTimer=setTimeout(()=>{this.setState(t=>({hasError:!1,attempt:t.attempt+1}))},2500))}componentWillUnmount(){clearTimeout(this.retryTimer)}render(){return this.state.hasError?null:this.props.children}}const De=2.4,je=[[1900,500,80,50],[1897,675,100,115],[1995,1540,70,190]],Pe=je.map(([l,i,c,t],a)=>`
                 rimSupp = max( rimSupp, 1.0 - smoothstep( 0.8, 1.2,
                     length( ( rimTex - vec2( ${l.toFixed(1)}, ${i.toFixed(1)} ) )
                             / vec2( ${c.toFixed(1)}, ${t.toFixed(1)} ) ) ) );`).join(""),X=2048,z=(l,i)=>new G(l/X,i/X),re=(l,i,c)=>{const t=l*Math.PI/180,a=Math.cos(t),E=Math.sin(t);return new Ce(a/i,E/i,-E/c,a/c)},Oe=z(235.5,1715),$e=re(-16,37,18),Ue=z(259,1713),Ne=z(511.5,1727.5),Xe=re(90,37.5,15.5),Ve=z(511,1703),te=17,Ge=1,qe=.934,He=14,Ke=new R(.78,.645,.565),We=new R(.04,.019,.012),Ze=new R(.01,.005,.0035),Je=.9,Qe=new G(13,5),et=.94,tt=1.12,rt=()=>({uRimColor:{value:new R("#8b93ff")},uRimAmount:{value:.55},uRimPower:{value:2.6},uLightDir:{value:new B(0,0,1)},uTint:{value:new R("#ffffff")},uTintAmount:{value:0},uEyeLook:{value:new G(0,0)},uEyeTravel:{value:Qe.clone()},uEyeDecouple:{value:0},uEyeProcedural:{value:0},uEyeACenter:{value:Oe.clone()},uEyeAEllipse:{value:$e.clone()},uEyeAIris:{value:Ue.clone()},uEyeBCenter:{value:Ne.clone()},uEyeBEllipse:{value:Xe.clone()},uEyeBIris:{value:Ve.clone()},uEyeCore:{value:et},uEyeEdge:{value:tt},uBakedIrisRadius:{value:He},uEyeAIrisR:{value:te*Ge},uEyeBIrisR:{value:te*qe},uTexSize:{value:X},uScleraColor:{value:new R().copy(Ke)},uIrisColor:{value:new R().copy(We)},uPupilColor:{value:new R().copy(Ze)}}),at=(l,i,c)=>{const t="emissivemap_fragment",a="vEmissiveMapUv",w=`#ifdef USE_EMISSIVEMAP

                     // ── Orthonormal screen→UV basis ──────────────────────
                     // dFdx/dFdy give how UV changes per pixel of screen x/y.
                     // Gram-Schmidt makes the pair orthonormal so a unit gaze
                     // vector produces the same displacement in every
                     // direction, on either eye, at any head angle.
                     vec2 duvdx = dFdx( ${a} );
                     vec2 duvdy = dFdy( ${a} );
                     vec2 axisX = duvdx / max( length( duvdx ), 1e-8 );
                     vec2 perpY = duvdy - axisX * dot( duvdy, axisX );
                     vec2 axisY = length( perpY ) > 1e-7
                         ? normalize( perpY )
                         : vec2( -axisX.y, axisX.x );

                     vec4 sampledAlbedo = texture2D( emissiveMap, ${a} );

                     vec2 pTex = ${a} * uTexSize;
                     float restLum = dot( sampledAlbedo.rgb, vec3( 0.2126, 0.7152, 0.0722 ) );

                     // Shared screen-space gaze -> both eyes track together.
                     vec2 gazeTex = axisX * ( uEyeLook.x * uEyeTravel.x )
                                  + axisY * ( uEyeLook.y * uEyeTravel.y );

                     float mA, mB;
                     vec3 eyeA = avatarEye( pTex, uEyeACenter * uTexSize, uEyeAEllipse,
                                            uEyeAIris * uTexSize, gazeTex, axisX, axisY,
                                            restLum, uEyeAIrisR, mA );
                     vec3 eyeB = avatarEye( pTex, uEyeBCenter * uTexSize, uEyeBEllipse,
                                            uEyeBIris * uTexSize, gazeTex, axisX, axisY,
                                            restLum, uEyeBIrisR, mB );

                     sampledAlbedo.rgb = mix( mix( sampledAlbedo.rgb, eyeA, mA ), eyeB, mB );
                     totalEmissiveRadiance *= sampledAlbedo.rgb;
           totalEmissiveRadiance *= mix( vec3( 1.0 ), uTint, uTintAmount );

                 #endif`,p=`
                 // Silhouette fresnel. View-space normal.z is the view-alignment
                 // term, so 1 - |n.z| peaks exactly on the silhouette edge.
                 float rimFresnel = pow( 1.0 - saturate( abs( normal.z ) ), uRimPower );

                 // Directional mask: the rim only lights the side the cursor is on,
                 // which reads as a real light source orbiting the subject.
                 float rimFacing = saturate( dot( normal, normalize( uLightDir ) ) );
                 rimFacing = rimFacing * rimFacing;

                 // Concave pockets (nostrils, mouth interior) graze the view just
                 // like the silhouette does, so the fresnel alone would light
                 // them from inside. Kill the rim over the measured UV islands.
                 vec2 rimTex = ${a} * uTexSize;
                 float rimSupp = 0.0;${Pe}

                 // RIM_HDR_GAIN pushes the hottest sliver of the rim ABOVE 1.0.
                 // The baked body texture never exceeds 1.0, so a bloom pass
                 // thresholded at luminance 1.0 picks up the rim and nothing
                 // else — that is what makes the glow track the silhouette
                 // instead of haloing the whole face.
                 totalEmissiveRadiance += uRimColor * rimFresnel * rimFacing * uRimAmount
                                          * ( 1.0 - rimSupp ) * ${De.toFixed(1)};`;l.onBeforeCompile=u=>{Object.assign(u.uniforms,i);let m=u.fragmentShader.replace("#include <common>",`#include <common>
                 uniform vec3  uRimColor;
                 uniform float uRimAmount;
                 uniform float uRimPower;
                 uniform vec3  uLightDir;
                 uniform vec3  uTint;
                 uniform float uTintAmount;

                 uniform vec2  uEyeLook;
                 uniform vec2  uEyeTravel;
                 uniform float uEyeDecouple;
                 uniform float uEyeProcedural;
                 uniform vec2  uEyeACenter;
                 uniform vec4  uEyeAEllipse;
                 uniform vec2  uEyeAIris;
                 uniform vec2  uEyeBCenter;
                 uniform vec4  uEyeBEllipse;
                 uniform vec2  uEyeBIris;
                 uniform float uEyeCore;
                 uniform float uEyeEdge;
                 uniform float uBakedIrisRadius;
                 uniform float uEyeAIrisR;
                 uniform float uEyeBIrisR;
                 uniform float uTexSize;
                 uniform vec3  uScleraColor;
                 uniform vec3  uIrisColor;
                 uniform vec3  uPupilColor;

                 /* Draws one eye from scratch and returns how strongly it
                    should replace the baked texture at this fragment.
                    Everything is in TEXEL space, which is isotropic (the atlas
                    is square), so a circle drawn here is a circle on the face. */
                 vec3 avatarEye( vec2 pTex, vec2 cTex, vec4 ell, vec2 irisRestTex,
                                 vec2 gazeTex, vec2 aX, vec2 aY, float restLum,
                                 float uIrisRadius, out float mask ) {

                     vec2 d = pTex - cTex;
                     // length(M * d) == 1.0 exactly on the eyelid rim
                     float n = length( vec2( dot( ell.xy, d ), dot( ell.zw, d ) ) );

                     // Baked position at rest, aperture centre + gaze when
                     // decoupled. Lerping the POSITION is what keeps the
                     // signature cross-eye at rest and parallel gaze on move.
                     vec2 irisP = mix( irisRestTex, cTex + gazeTex, uEyeDecouple );

                     // ── Layer 1: clean sclera ───────────────────────────
                     // Contact occlusion toward the rim, deepened under the
                     // upper lid (aY is screen-up, so this stays correct as
                     // the head turns).
                     float ao = mix( 1.0, 0.68, smoothstep( 0.58, 1.06, n ) );
                     float upness = dot( normalize( d + vec2( 1e-6 ) ), aY );
                     ao *= mix( 1.0, 0.84,
                                smoothstep( 0.0, 0.9, upness ) * smoothstep( 0.30, 1.0, n ) );
                     vec3 col = uScleraColor * ao;

                     // ── Layer 2: circular iris ──────────────────────────
                     float r = length( pTex - irisP ) / uIrisRadius;
                     float aa = max( fwidth( r ), 1e-3 ) * 1.1;
                     vec3 iris = mix( uIrisColor * 1.50, uIrisColor * 0.75,
                                      smoothstep( 0.15, 1.0, r ) );
                     iris = mix( iris, uIrisColor * 0.35, smoothstep( 0.72, 1.0, r ) ); // limbal ring
                     iris = mix( uPupilColor, iris, smoothstep( 0.30, 0.42, r ) );      // pupil
                     float irisA = 1.0 - smoothstep( 1.0 - aa, 1.0 + aa, r );
                     col = mix( col, iris, irisA );

                     // Catchlight rides with the iris — on a bust this small it
                     // reads as part of the eye rather than as a reflection
                     // sliding off it.
                     vec2 hl = irisP + ( aX * -0.34 + aY * 0.34 ) * uIrisRadius;
                     float hA = 1.0 - smoothstep( 0.40, 1.0,
                                    length( pTex - hl ) / ( uIrisRadius * 0.30 ) );
                     col = mix( col, vec3( 0.86 ), hA * mix( 0.12, 1.0, irisA ) );

                     // Preserve the baked lash line: it is dark and lives
                     // OUTSIDE the baked iris, so a luminance guard keeps it
                     // while still letting the baked iris be painted over.
                     // The guard exists to keep the baked eyelash line, which
                     // lives at the RIM. Anything dark deeper inside the
                     // aperture is baked iris or its shadow — exactly the
                     // stains this refactor removes — so the guard is switched
                     // off there. Without the aperture term the guard preserves
                     // those stains too, and they reappear as dark specks
                     // floating in the clean sclera.
                     float bakedIris = 1.0 - smoothstep( uBakedIrisRadius * 1.02, uBakedIrisRadius * 1.45,
                                                         length( pTex - irisRestTex ) );
                     float interior = 1.0 - smoothstep( 0.55, 0.85, n );
                     float lidGuard = max( smoothstep( 0.05, 0.16, restLum ),
                                           max( bakedIris, interior ) );

                     // The baked iris is crossed hard, so its outer crescent
                     // sits at n ~ 1.05 — OUTSIDE the aperture ellipse. Masking
                     // by the aperture alone leaves that crescent unpainted and
                     // it reads as a dark jagged fringe beside the drawn iris.
                     // Union the aperture with a disc over the baked iris so it
                     // is always fully erased.
                     float aperture = 1.0 - smoothstep( uEyeCore, uEyeEdge, n );
                     float bakedCover = 1.0 - smoothstep( uBakedIrisRadius * 1.10, uBakedIrisRadius * 1.45,
                                                          length( pTex - irisRestTex ) );
                     mask = max( aperture, bakedCover ) * lidGuard * uEyeProcedural;
                     return col;
                 }`);m=m.replace(`#include <${t}>`,w),m=m.replace(w,`${w}${p}`),u.fragmentShader=m},l.customProgramCacheKey=()=>"avatar-eye-procedural-v11-shaded",l.needsUpdate=!0},ot=({pointer:l,scrollVelocity:i,currentSection:c,reducedMotion:t})=>{const{scene:a}=V(q),E=r.useRef(),b=r.useRef([]),o=r.useMemo(rt,[]),w=r.useRef({ry:0,rx:0,rz:0,vy:0,vx:0,vz:0}),p=r.useRef({x:0,y:1.1,vx:0,vy:0}),u=r.useRef(0),m=r.useRef({x:0,y:0,vx:0,vy:0}),y=r.useMemo(()=>new B(0,0,1),[]),I=r.useMemo(()=>new R,[]),T=r.useMemo(()=>{const h=new Te().setFromObject(a),A=h.getSize(new B),d=h.getCenter(new B),e=A.y||1;return{scale:1/e,offset:[-d.x/e,-h.max.y/e,-d.z/e],aspect:A.x/e}},[a]);return r.useLayoutEffect(()=>{const h=[];a.traverse(A=>{if(!A.isMesh||!A.material)return;const d=A.material;d.side=Ie,d.transparent=!0,d.depthWrite=!0,d.toneMapped=!1,at(d,o),h.push(d),A.frustumCulled=!1}),b.current=h},[a,o]),Se((h,A)=>{const d=E.current;if(!d)return;const e=Math.min(A,1/30),ae=h.clock.elapsedTime,Y=h.camera,H=h.size.width<768?ze:Be,g=H[c]||H.about,S=Math.tan(Y.fov/2*_e)*Math.abs(Y.position.z),oe=S*Y.aspect;u.current=t?1:x.damp(u.current,1,1.6,e);const D=u.current,M=D*D*(3-2*D),C=g.fill*(S*2)*(.9+.1*M),se=S-g.topMargin*(S*2)-(1-M)*S*.55,ie=g.x*oe,_=l.current.x,L=l.current.y,j=t?0:x.clamp(i.current/(h.size.height*.22),-1,1),ne=t?0:_*.035*C,le=t?0:L*.018*C,ce=t?0:Math.sin(ae*.62)*.006*C,ue=j*.035*C;d.scale.setScalar(x.damp(d.scale.x,C,4,e));const v=p.current,K=34;v.vx+=(ie+ne-v.x)*K*e,v.vy+=(se+le+ce+ue-v.y)*K*e;const W=Math.exp(-7.4*e);v.vx*=W,v.vy*=W,v.x+=v.vx*e,v.y+=v.vy*e,d.position.set(v.x,v.y,0);const n=w.current,me=g.rotY+(t?0:_*.24)+(1-M)*.4,de=t?0:L*.11+j*.13,pe=-j*.1,P=42;n.vy+=(me-n.ry)*P*e,n.vx+=(de-n.rx)*P*e,n.vz+=(pe-n.rz)*P*e;const O=Math.exp(-8*e);n.vy*=O,n.vx*=O,n.vz*=O,n.ry+=n.vy*e,n.rx+=n.vx*e,n.rz+=n.vz*e,d.rotation.set(n.rx,n.ry,n.rz);const Z=b.current;for(let N=0;N<Z.length;N++){const F=Z[N];F.opacity=x.damp(F.opacity,g.opacity,3.5,e),F.transparent=F.opacity<.995}const f=m.current,fe=t?0:x.clamp(_*1.2,-1,1),he=t?0:x.clamp(L*.85,-1,1),J=130;f.vx+=(fe-f.x)*J*e,f.vy+=(he-f.y)*J*e;const Q=Math.exp(-15*e);f.vx*=Q,f.vy*=Q,f.x+=f.vx*e,f.y+=f.vy*e,o.uEyeLook.value.set(f.x,f.y);const ee=Math.min(1,Math.hypot(f.x,f.y)),$=x.clamp((ee-.03)/.28,0,1),ve=t?0:$*$*(3-2*$)*Je;o.uEyeDecouple.value=x.damp(o.uEyeDecouple.value,ve,3.5,e);const U=x.clamp((ee-.015)/.12,0,1);o.uEyeProcedural.value=x.damp(o.uEyeProcedural.value,t?0:U*U*(3-2*U),6,e),y.set(_,L*.7,.55).normalize(),o.uLightDir.value.lerp(y,1-Math.exp(-6*e)),o.uRimColor.value.lerp(I.set(g.rim),1-Math.exp(-3*e)),o.uTint.value.lerp(I.set(g.tint),1-Math.exp(-3*e)),o.uRimAmount.value=x.damp(o.uRimAmount.value,g.rimAmount*g.opacity*(1+(1-M)*1.2),3,e),o.uTintAmount.value=x.damp(o.uTintAmount.value,g.tintAmount,3,e)}),s.jsx("group",{ref:E,position:[0,1.1,0],scale:2.6,children:s.jsx("group",{scale:T.scale,position:T.offset,children:s.jsx("primitive",{object:a})})})};V.preload(q);const st=({currentSection:l,theme:i})=>{const c=r.useRef({x:0,y:0}),t=r.useRef({x:0,y:0}),a=r.useRef(0),E=r.useMemo(()=>typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,[]);r.useEffect(()=>{let p;const u=y=>{t.current.x=y.clientX/window.innerWidth*2-1,t.current.y=-(y.clientY/window.innerHeight)*2+1},m=()=>{c.current.x+=(t.current.x-c.current.x)*.08,c.current.y+=(t.current.y-c.current.y)*.08,p=requestAnimationFrame(m)};return window.addEventListener("pointermove",u,{passive:!0}),p=requestAnimationFrame(m),()=>{window.removeEventListener("pointermove",u),cancelAnimationFrame(p)}},[]),r.useEffect(()=>{let p=window.scrollY,u;const m=()=>{a.current=window.scrollY-p,p=window.scrollY},y=()=>{a.current*=.9,u=requestAnimationFrame(y)};return window.addEventListener("scroll",m,{passive:!0}),u=requestAnimationFrame(y),()=>{window.removeEventListener("scroll",m),cancelAnimationFrame(u)}},[]);const b=r.useRef(null),o=r.useRef(null);r.useEffect(()=>{if(E)return;let p;const u=34,m=()=>{const y=c.current.x,I=c.current.y;if(b.current){const T=window.scrollY*.06%u;b.current.style.transform=`translate3d(${(-y*16).toFixed(2)}px, ${(-I*16+T).toFixed(2)}px, 0)`}if(o.current){const T=(y*.5+.5)*window.innerWidth,h=(.5-I*.5)*window.innerHeight;o.current.style.transform=`translate3d(${(T-320).toFixed(1)}px, ${(h-320).toFixed(1)}px, 0)`}p=requestAnimationFrame(m)};return p=requestAnimationFrame(m),()=>cancelAnimationFrame(p)},[E]);const w=i==="dark";return s.jsxs("div",{className:"avatar-stage","aria-hidden":"true",children:[s.jsx("div",{className:"absolute inset-0 transition-colors duration-700",style:{backgroundColor:w?"#07070B":"#F5F2EB"}}),s.jsx("div",{ref:b,className:"ambient-grid"}),s.jsx("div",{ref:o,className:"cursor-glow"}),s.jsx("div",{className:"absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px]",children:s.jsx("div",{className:"bloom-breathe w-full h-full rounded-full transition-opacity duration-700",style:{background:w?"radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)":"radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)"}})}),s.jsx(Ye,{children:s.jsxs(xe,{camera:{position:[0,0,Le],fov:Fe,near:.1,far:40},className:"avatar-canvas",gl:{antialias:!0,alpha:!0,powerPreference:"high-performance"},dpr:[1,1.75],children:[s.jsx("ambientLight",{intensity:1}),s.jsx(r.Suspense,{fallback:null,children:s.jsx(ot,{pointer:c,scrollVelocity:a,currentSection:l,reducedMotion:E})}),s.jsxs(ye,{multisampling:2,frameBufferType:Ee,enableNormalPass:!1,children:[s.jsx(ge,{intensity:.85,luminanceThreshold:1,luminanceSmoothing:.28,radius:.62,mipmapBlur:!0}),s.jsx(Ae,{blendFunction:Re.NORMAL,offset:[5e-4,7e-4],radialModulation:!0,modulationOffset:.42}),s.jsx(we,{mode:be.ACES_FILMIC})]})]})})]})},ut=({currentSection:l="about",theme:i="dark"})=>s.jsx(st,{currentSection:l,theme:i});export{ut as default};
