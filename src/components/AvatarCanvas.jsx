import React, { useRef, useMemo, useEffect, useLayoutEffect, Suspense, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import {
    EffectComposer,
    Bloom,
    ChromaticAberration,
    ToneMapping,
} from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════
   GLB INSPECTION RESULT  (public/models/avatar.glb)
   ───────────────────────────────────────────────────────────────────────
   nodes:      1 ("model")          skins/bones: 0      animations: 0
   meshes:     1 primitive          morph targets: 0
   attributes: POSITION, NORMAL, TEXCOORD_0   (no joints, no eye submesh)
   material:   baseColorFactor [0,0,0,1], metallic 0,
               emissiveFactor [1,1,1] + emissiveTexture "shaded" (webp)
   bounds:     1.605 (w) x 1.904 (h) x 1.045 (d), origin at the neck base

   → EYE *ROTATION* IS NOT ACHIEVABLE — no eye submesh, no bone, no morph
     target. Geometric slicing was rejected too: the eye is a continuous
     surface with the lids, so displacing a vertex island tears the mesh, and
     photogrammetry gives a flat-ish eye rather than a sphere to rotate.

     Eye MOTION is achieved instead by displacing the texture lookup so the
     painted iris slides across the painted sclera. See PROCEDURAL EYE
     TRACKING below for the measured UV regions and why the offset basis
     comes from screen-space derivatives.

   → The material is UNLIT (black albedo, full emissive). Every directional /
     point / hemisphere light in the old rig contributed exactly nothing.
     Interactivity is therefore delivered in the shader: a cursor-driven
     fresnel rim term and a section-aware colour grade injected into
     `totalEmissiveRadiance`, plus spring-damped rigid-body motion.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── MODEL VARIANT ────────────────────────────────────────────────────────
   'shaded' — unlit baked-lighting bust (10 MB, meshopt + webp). Ships today.
   'pbr'    — same 781k-vert geometry with baseColor + normal +
              metallicRoughness maps, relit with three real lights + HDRI IBL.
              VERIFIED WORKING, including eye tracking, but NOT shipped:
              the source GLB is 55 MB uncompressed (781k verts, 3x 2048 PNG)
              versus 10 MB for the meshopt+webp shaded build, and relighting a
              photogrammetry albedo that already carries baked AO pushes the
              skin orange and glossy. Shipping it needs a decimate + meshopt +
              webp/KTX2 pass and a material tuning pass first.
              To re-run the comparison:
                cp ~/Downloads/base_basic_pbr.glb public/models/avatar_pbr.glb
                set VARIANT = 'pbr' */
const MODEL_VARIANTS = {
    shaded: { url: '/models/avatar.glb', lit: false },
    pbr: { url: '/models/avatar_pbr.glb', lit: true },
};
const VARIANT = 'shaded';
const MODEL_URL = MODEL_VARIANTS[VARIANT].url;
const MODEL_LIT = MODEL_VARIANTS[VARIANT].lit;

const DEG2RAD = Math.PI / 180;

/* Camera is FIXED. All framing is solved against it so the head can never
   drift out of frame — see solveFraming(). */
const CAM_Z = 5.2;
const CAM_FOV = 32;

/* ── Per-section framing & grade ───────────────────────────────────────────
   fill      : model height as a fraction of the *visible viewport height*
   topMargin : gap between the top of the head and the top edge of the
               browser window, as a fraction of the visible viewport height.
               This is the guarantee that the head is never cropped.
   x         : horizontal centre as a fraction of the visible half-width.

   INVARIANT: fill + topMargin > 1.0 in every pose, so the chest always
   bleeds off the bottom edge (no floating, severed torso) while the head
   keeps a generous, explicit gap at the top.

   OPACITY IS PINNED TO 1.0 ON DESKTOP. The model is an UNLIT baked-texture
   mesh; alpha-blending it over the cream background desaturates every pixel
   toward the backdrop, which turned the torso muddy grey rather than making
   it recede. Section 05 exits by dropping and shrinking instead — the model
   translates down and back, which reads as depth without touching colour.
   ────────────────────────────────────────────────────────────────────── */
const SECTION_POSES = {
    about: {
        fill: 0.90, topMargin: 0.13, x: 0.00, rotY: 0.00, opacity: 1.0,
        rim: '#8b93ff', rimAmount: 0.55, tint: '#ffffff', tintAmount: 0.00,
    },
    trajectory: {
        fill: 0.84, topMargin: 0.19, x: 0.54, rotY: -0.28, opacity: 1.0,
        rim: '#fbbf24', rimAmount: 0.50, tint: '#ffe3b0', tintAmount: 0.10,
    },
    expertise: {
        fill: 0.82, topMargin: 0.21, x: -0.54, rotY: 0.30, opacity: 1.0,
        rim: '#22d3ee', rimAmount: 0.55, tint: '#c9ecff', tintAmount: 0.12,
    },
    projects: {
        fill: 0.83, topMargin: 0.20, x: 0.52, rotY: -0.24, opacity: 1.0,
        rim: '#a78bfa', rimAmount: 0.55, tint: '#e4d9ff', tintAmount: 0.10,
    },
    academic: {
        // Recedes by sinking + shrinking, at full opacity.
        fill: 0.74, topMargin: 0.36, x: 0.44, rotY: -0.14, opacity: 1.0,
        rim: '#818cf8', rimAmount: 0.42, tint: '#ffffff', tintAmount: 0.00,
    },
};

/* Mobile: the avatar is a hero-only flourish — content owns the rest. */
/* fill + topMargin still sums past 1.0 so the chest exits the bottom edge
   rather than floating as a severed bust. */
const MOBILE_BASE = { fill: 0.75, topMargin: 0.28, x: 0.0, rotY: 0, rim: '#8b93ff', tint: '#ffffff', tintAmount: 0 };
const MOBILE_POSES = {
    about: { ...MOBILE_BASE, opacity: 0.9, rimAmount: 0.5 },
    trajectory: { ...MOBILE_BASE, opacity: 0, rimAmount: 0 },
    expertise: { ...MOBILE_BASE, opacity: 0, rimAmount: 0 },
    projects: { ...MOBILE_BASE, opacity: 0, rimAmount: 0 },
    academic: { ...MOBILE_BASE, opacity: 0, rimAmount: 0 },
};

/* ═══════════════════════════════════════════════════════════
   ERROR BOUNDARY
   ═══════════════════════════════════════════════════════════ */
class CanvasErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.warn('3D Avatar Canvas WebGL Warning:', error, errorInfo);
    }
    render() {
        return this.state.hasError ? null : this.props.children;
    }
}

/* ═══════════════════════════════════════════════════════════
   SHADER INJECTION — cursor rim light + section grade
   ═══════════════════════════════════════════════════════════ */
/* Peak rim radiance = uRimAmount (≤ 0.55) × RIM_HDR_GAIN ≈ 1.3, i.e. just
   over the bloom threshold. Raising this widens the glow; lowering it below
   ~1.8 makes the rim stop blooming entirely. */
const RIM_HDR_GAIN = 2.4;

/* ═══════════════════════════════════════════════════════════════════════
   PROCEDURAL EYE TRACKING
   ───────────────────────────────────────────────────────────────────────
   The mesh has no eye submesh, no bone and no morph target, so the eyes
   cannot be rotated. What the asset DOES have is a lucky UV layout: both
   eyes land in a single contiguous island in the lower-left of the 2048²
   atlas, and the irises are painted onto a flat-ish surface (photogrammetry
   does not model an eyeball as a sphere). So the iris can be MOVED ACROSS
   THE SCLERA by offsetting the texture lookup inside a soft elliptical mask.

   Values below were measured, not guessed: sclera pixels were isolated in
   the diffuse map by (value > 0.80 && saturation < 0.20), clustered into two
   groups, and the iris located as the dark core inside each cluster.

       EYE A  sclera centre px (233.7, 1713.7)  halfspan (26.5, 18.0)
              iris   centre px (255.4, 1713.5)
       EYE B  sclera centre px (512.3, 1734.3)  halfspan (15.5, 25.0)
              iris   centre px (511.3, 1718.2)

   Four things to note:

   • glTF UV origin is TOP-left and GLTFLoader sets flipY = false, so
     v = py / 2048 directly (NOT 1 - py/2048).

   • The two eyes sit at ~90° to each other in the atlas — eye A is wide and
     short, eye B is narrow and tall. A fixed UV-space direction would send
     one iris sideways and the other vertically. The shader therefore derives
     its offset basis from dFdx/dFdy of the UV, i.e. from the actual
     screen→UV mapping, which is correct per-eye AND automatically follows
     the head as it rotates. The basis is Gram-Schmidt orthonormalised, so a
     skewed UV island cannot shear the gaze into an ellipse.

   • THE DISPLACEMENT MUST NOT BE MULTIPLIED BY THE MASK. Sampling at
     `uv - shift * mask(uv)` is a spatially varying displacement field, i.e.
     a WARP with local Jacobian I - d(shift·mask)/duv. Any part of the iris
     sitting in the mask's falloff gets squashed along the gradient — that is
     exactly what stretched the pupils into ovals. The shift is now constant
     per eye, and the mask instead cross-fades between two RIGIDLY sampled
     lookups. A rigid translation has Jacobian I, so the pupil stays a
     perfect circle at every offset.

   • uEyeLook = (0,0) reproduces the baked texture BIT-FOR-BIT: eyeShift is
     zero, so both lookups collapse to the same texel and the mix is a no-op.
     That is what preserves the model's signature cross-eyed rest pose. Gaze
     is purely a delta from it, and because both eyes receive the SAME
     screen-space translation, their relative convergence — the cross-eye — is
     invariant under tracking.
   ═══════════════════════════════════════════════════════════════════════ */
const TEX = 2048;
const px2uv = (x, y) => new THREE.Vector2(x / TEX, y / TEX);

/* Masks are CIRCULAR in texel space (the atlas is square, so equal texel
   radius = equal UV radius). An axis-aligned ellipse would have imposed the
   sclera's own aspect on the blend and reintroduced directional bias.
   Centred on each iris at rest, so the iris is always deep inside the core. */
const EYE_A_IRIS = px2uv(255.4, 1713.5);
const EYE_B_IRIS = px2uv(511.3, 1718.2);

/* Iris radius measured from the dark-pixel count: sqrt(259/pi) ≈ 9.1 texels.
   CORE must satisfy  core >= irisRadius + travel  so the whole iris disc sits
   in the flat (mix == 1) region at full deflection — that is the guarantee of
   a rigid, circle-preserving translation. */
const EYE_TRAVEL_TEXELS = 8;
const EYE_CORE_TEXELS = 18; // 9.1 + 8 = 17.1, rounded up
const EYE_EDGE_TEXELS = 30; // cross-fade band, lands on low-frequency skin
const EYE_TRAVEL = EYE_TRAVEL_TEXELS / TEX;

const RIM_UNIFORM_DEFAULTS = () => ({
    uRimColor: { value: new THREE.Color('#8b93ff') },
    uRimAmount: { value: 0.55 },
    uRimPower: { value: 2.6 },
    uLightDir: { value: new THREE.Vector3(0, 0, 1) },
    uTint: { value: new THREE.Color('#ffffff') },
    uTintAmount: { value: 0 },
    // Delta from the baked cross-eyed rest pose, NOT an absolute gaze.
    uEyeLook: { value: new THREE.Vector2(0, 0) },
    uEyeTravel: { value: EYE_TRAVEL },
    uEyeACenter: { value: EYE_A_IRIS.clone() },
    uEyeBCenter: { value: EYE_B_IRIS.clone() },
    uEyeCore: { value: EYE_CORE_TEXELS },
    uEyeEdge: { value: EYE_EDGE_TEXELS },
    uTexSize: { value: TEX },
});

const injectRimShader = (material, uniforms, lit) => {
    /* Which chunk performs the albedo lookup differs per variant:
         shaded → <emissivemap_fragment> / vEmissiveMapUv / emissiveMap
         pbr    → <map_fragment>         / vMapUv         / map
       Normal and roughness maps are deliberately NOT displaced: we want the
       painted iris to slide across the sclera, not the surface itself. */
    const albedoChunk = lit ? 'map_fragment' : 'emissivemap_fragment';
    const albedoUv = lit ? 'vMapUv' : 'vEmissiveMapUv';
    const albedoDefine = lit ? 'USE_MAP' : 'USE_EMISSIVEMAP';
    const albedoSampler = lit ? 'map' : 'emissiveMap';
    /* On the unlit variant the texture IS the lit result, so it lands in
       emissive. On PBR it is true albedo and must go through the BRDF. The
       section grade rides along with whichever one carries the colour. */
    const albedoApply = lit
        ? `diffuseColor *= sampledAlbedo;
           diffuseColor.rgb *= mix( vec3( 1.0 ), uTint, uTintAmount );`
        : `totalEmissiveRadiance *= sampledAlbedo.rgb;
           totalEmissiveRadiance *= mix( vec3( 1.0 ), uTint, uTintAmount );`;

    const EYE_BLOCK = `#ifdef ${albedoDefine}

                     // ── Orthonormal screen→UV basis (the mapping matrix) ──
                     // dFdx/dFdy give how UV changes per pixel of screen x/y.
                     // Gram-Schmidt makes the pair orthonormal so a unit gaze
                     // vector produces the SAME texel displacement in every
                     // direction: no anisotropy, no shear.
                     vec2 duvdx = dFdx( ${albedoUv} );
                     vec2 duvdy = dFdy( ${albedoUv} );
                     vec2 axisX = duvdx / max( length( duvdx ), 1e-8 );
                     vec2 perpY = duvdy - axisX * dot( duvdy, axisX );
                     vec2 axisY = length( perpY ) > 1e-7
                         ? normalize( perpY )
                         : vec2( -axisX.y, axisX.x );

                     // CONSTANT per fragment — deliberately NOT scaled by the
                     // mask. See the header: a mask-scaled shift is a warp and
                     // ovals the pupil.
                     vec2 eyeShift = ( uEyeLook.x * axisX + uEyeLook.y * axisY )
                                     * uEyeTravel;

                     float eyeInfluence = max(
                         eyeMask( ${albedoUv}, uEyeACenter ),
                         eyeMask( ${albedoUv}, uEyeBCenter )
                     );

                     // Two RIGID lookups, cross-faded. Inside the core the
                     // result is a pure translation (Jacobian = I, circle
                     // preserved); the blend happens out on featureless skin.
                     // At uEyeLook = 0 both fetches coincide -> baked pose.
                     vec4 albedoRest = texture2D( ${albedoSampler}, ${albedoUv} );
                     vec4 albedoLook = texture2D( ${albedoSampler}, ${albedoUv} - eyeShift );
                     vec4 sampledAlbedo = mix( albedoRest, albedoLook, eyeInfluence );
                     ${albedoApply}

                 #endif`;

    /* The rim needs `normal`, which only exists after <normal_fragment_begin>.
       <map_fragment> runs BEFORE that, so the rim can never be appended to the
       albedo block on the PBR path — it is always anchored to
       <emissivemap_fragment>, which sits after the normal chunks in
       meshphysical_frag for both variants. */
    const RIM_BLOCK = `
                 // Silhouette fresnel. View-space normal.z is the view-alignment
                 // term, so 1 - |n.z| peaks exactly on the silhouette edge.
                 float rimFresnel = pow( 1.0 - saturate( abs( normal.z ) ), uRimPower );

                 // Directional mask: the rim only lights the side the cursor is on,
                 // which reads as a real light source orbiting the subject.
                 float rimFacing = saturate( dot( normal, normalize( uLightDir ) ) );
                 rimFacing = rimFacing * rimFacing;

                 // RIM_HDR_GAIN pushes the hottest sliver of the rim ABOVE 1.0.
                 // The baked body texture never exceeds 1.0, so a bloom pass
                 // thresholded at luminance 1.0 picks up the rim and nothing
                 // else — that is what makes the glow track the silhouette
                 // instead of haloing the whole face.
                 totalEmissiveRadiance += uRimColor * rimFresnel * rimFacing * uRimAmount * ${RIM_HDR_GAIN.toFixed(1)};`;

    material.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, uniforms);

        let frag = shader.fragmentShader.replace(
            '#include <common>',
            `#include <common>
                 uniform vec3  uRimColor;
                 uniform float uRimAmount;
                 uniform float uRimPower;
                 uniform vec3  uLightDir;
                 uniform vec3  uTint;
                 uniform float uTintAmount;
                 uniform vec2  uEyeLook;
                 uniform float uEyeTravel;
                 uniform vec2  uEyeACenter;
                 uniform vec2  uEyeBCenter;
                 uniform float uEyeCore;
                 uniform float uEyeEdge;
                 uniform float uTexSize;

                 // Isotropic falloff measured in TEXELS: 1.0 inside the core,
                 // 0.0 past the edge. Circular by construction — no aspect bias.
                 float eyeMask( vec2 uv, vec2 c ) {
                     float d = length( ( uv - c ) * uTexSize );
                     return 1.0 - smoothstep( uEyeCore, uEyeEdge, d );
                 }`
        );

        // Varyings are read-only in the fragment stage, so the albedo chunk is
        // replaced outright rather than appended to — that is the only place
        // the lookup coordinate can be displaced.
        frag = frag.replace(`#include <${albedoChunk}>`, EYE_BLOCK);

        frag = lit
            ? frag.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>${RIM_BLOCK}`)
            : frag.replace(EYE_BLOCK, `${EYE_BLOCK}${RIM_BLOCK}`);

        shader.fragmentShader = frag;
    };
    material.customProgramCacheKey = () => `avatar-rim-eyes-v4-${lit ? 'pbr' : 'shaded'}`;
    material.needsUpdate = true;
};

/* ═══════════════════════════════════════════════════════════
   AVATAR MODEL
   ═══════════════════════════════════════════════════════════ */
const AvatarModel = ({ pointer, scrollVelocity, currentSection, reducedMotion }) => {
    const { scene } = useGLTF(MODEL_URL);
    const groupRef = useRef();
    const materialsRef = useRef([]);
    const uniforms = useMemo(RIM_UNIFORM_DEFAULTS, []);

    /* Spring state for rotation AND position — velocity-based so motion
       settles organically instead of the rigid, constant-rate lerp the
       previous build used. Position springs are deliberately under-damped so
       a section change arcs past its mark and eases back, killing the
       mechanical left-to-right "jump". */
    const spring = useRef({ ry: 0, rx: 0, rz: 0, vy: 0, vx: 0, vz: 0 });
    const posSpring = useRef({ x: 0, y: 1.1, vx: 0, vy: 0 });
    /* Eyes run a stiffer, lighter spring than the head so the gaze arrives
       first and the head follows — which is how people actually look at
       things, and what stops the two motions reading as one rigid unit. */
    const eyeSpring = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
    const lightDir = useMemo(() => new THREE.Vector3(0, 0, 1), []);
    const tmpColor = useMemo(() => new THREE.Color(), []);

    /* ── Normalise the model into a predictable posing space ──────────────
       After this, the mesh is exactly 1.0 unit tall, centred on X/Z, with the
       TOP OF THE HEAD at local y = 0. Framing maths then only has to place a
       single point (the crown) — which is what makes the "never cropped"
       guarantee hold at any viewport size. */
    const normalized = useMemo(() => {
        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const h = size.y || 1;
        return {
            scale: 1 / h,
            offset: [-center.x / h, -box.max.y / h, -center.z / h],
            aspect: size.x / h,
        };
    }, [scene]);

    /* Material setup: front faces only (the GLB ships doubleSided, which is
       what made the fading avatar look like a see-through skull — you were
       seeing the inside of the back of the head through the face). */
    /* useLayoutEffect, not useEffect: the material has to be patched BEFORE
       R3F's first rAF render. Patching afterwards compiles the stock program,
       then forces a rebuild, and WebGL logs "useProgram: program not valid"
       for the frames in between. */
    useLayoutEffect(() => {
        const mats = [];
        scene.traverse((child) => {
            if (!child.isMesh || !child.material) return;
            const mat = child.material;
            mat.side = THREE.FrontSide;
            mat.transparent = true;
            mat.depthWrite = true;
            // toneMapped OFF so the material writes raw linear HDR into the
            // half-float composer buffer — values above 1.0 have to survive
            // for the bloom threshold to be meaningful. ACES is re-applied at
            // the end of the chain by the <ToneMapping> effect, so the base
            // texture ends up looking exactly as it did before.
            mat.toneMapped = false;
            if (MODEL_LIT) {
                // Photogrammetry albedo already carries a little baked shading;
                // nudging roughness up stops the specular reading as plastic.
                mat.roughness = 0.82;
                mat.metalness = 0.0;
                mat.envMapIntensity = 1.15;
                if (mat.normalScale) mat.normalScale.set(0.85, 0.85);
            }
            injectRimShader(mat, uniforms, MODEL_LIT);
            mats.push(mat);
            child.frustumCulled = false;
        });
        materialsRef.current = mats;
    }, [scene, uniforms]);

    useFrame((state, rawDelta) => {
        const group = groupRef.current;
        if (!group) return;

        const delta = Math.min(rawDelta, 1 / 30); // clamp after tab-switch stalls
        const t = state.clock.elapsedTime;
        const camera = state.camera;

        const isMobile = state.size.width < 768;
        const poses = isMobile ? MOBILE_POSES : SECTION_POSES;
        const pose = poses[currentSection] || poses.about;

        /* ── FRAMING SOLVE (runs every frame → correct at any window size) ──
           halfH = half the world-space height visible at the model's depth. */
        const halfH = Math.tan((camera.fov / 2) * DEG2RAD) * Math.abs(camera.position.z);
        const halfW = halfH * camera.aspect;

        const targetScale = pose.fill * (halfH * 2);
        const targetTopY = halfH - pose.topMargin * (halfH * 2);
        const targetX = pose.x * halfW;

        const mx = pointer.current.x;
        const my = pointer.current.y;

        /* ── Scroll inertia ─────────────────────────────────────────────────
           Velocity is normalised against a quarter viewport-height per frame,
           so the response is identical on a 13" laptop and a 34" ultrawide.
           `sv` is a signed 0..1 "how hard are we moving" term. */
        const sv = reducedMotion
            ? 0
            : THREE.MathUtils.clamp(scrollVelocity.current / (state.size.height * 0.22), -1, 1);

        /* Subtle lean toward the cursor — expressed as a fraction of the
           model's own size so it scales with the framing. */
        const leanX = reducedMotion ? 0 : mx * 0.035 * targetScale;
        const leanY = reducedMotion ? 0 : my * 0.018 * targetScale;
        const breathe = reducedMotion ? 0 : Math.sin(t * 0.62) * 0.006 * targetScale;
        // The body drags a beat behind the page, like mass resisting the move.
        const scrollDrag = sv * 0.035 * targetScale;

        group.scale.setScalar(THREE.MathUtils.damp(group.scale.x, targetScale, 4, delta));

        /* ── Under-damped position spring ───────────────────────────────── */
        const p = posSpring.current;
        const posStiff = 34;
        const posDamp = 7.4; // < 2*sqrt(stiffness) → overshoots, then settles
        p.vx += (targetX + leanX - p.x) * posStiff * delta;
        p.vy += (targetTopY + leanY + breathe + scrollDrag - p.y) * posStiff * delta;
        const posDecay = Math.exp(-posDamp * delta);
        p.vx *= posDecay;
        p.vy *= posDecay;
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        group.position.set(p.x, p.y, 0);

        /* ── Spring-damped orientation ──────────────────────────────────── */
        const s = spring.current;
        const targetRY = pose.rotY + (reducedMotion ? 0 : mx * 0.24);
        // Pitch = cursor tilt + a forward/back lean into the scroll direction.
        const targetRX = reducedMotion ? 0 : my * 0.11 + sv * 0.13;
        // Roll = counter-rotation against the scroll, like a body being carried.
        const targetRZ = -sv * 0.10;

        const stiffness = 42;
        const damping = 8;
        s.vy += (targetRY - s.ry) * stiffness * delta;
        s.vx += (targetRX - s.rx) * stiffness * delta;
        s.vz += (targetRZ - s.rz) * stiffness * delta;
        const decay = Math.exp(-damping * delta);
        s.vy *= decay; s.vx *= decay; s.vz *= decay;
        s.ry += s.vy * delta; s.rx += s.vx * delta; s.rz += s.vz * delta;

        group.rotation.set(s.rx, s.ry, s.rz);

        /* ── Opacity ────────────────────────────────────────────────────── */
        const mats = materialsRef.current;
        for (let i = 0; i < mats.length; i++) {
            const mat = mats[i];
            mat.opacity = THREE.MathUtils.damp(mat.opacity, pose.opacity, 3.5, delta);
            // Only pay the transparent-sort cost when we are actually fading.
            mat.transparent = mat.opacity < 0.995;
        }

        /* ── Procedural eye tracking ───────────────────────────────────── */
        const eye = eyeSpring.current;
        const eyeTargetX = reducedMotion ? 0 : THREE.MathUtils.clamp(mx * 1.2, -1, 1);
        const eyeTargetY = reducedMotion ? 0 : THREE.MathUtils.clamp(my * 0.85, -1, 1);
        const eyeStiff = 130;
        const eyeDamp = 15;
        eye.vx += (eyeTargetX - eye.x) * eyeStiff * delta;
        eye.vy += (eyeTargetY - eye.y) * eyeStiff * delta;
        const eyeDecay = Math.exp(-eyeDamp * delta);
        eye.vx *= eyeDecay;
        eye.vy *= eyeDecay;
        eye.x += eye.vx * delta;
        eye.y += eye.vy * delta;
        uniforms.uEyeLook.value.set(eye.x, eye.y);

        /* ── Cursor-driven rim light ────────────────────────────────────── */
        lightDir.set(mx, my * 0.7, 0.55).normalize();
        uniforms.uLightDir.value.lerp(lightDir, 1 - Math.exp(-6 * delta));
        uniforms.uRimColor.value.lerp(tmpColor.set(pose.rim), 1 - Math.exp(-3 * delta));
        uniforms.uTint.value.lerp(tmpColor.set(pose.tint), 1 - Math.exp(-3 * delta));
        uniforms.uRimAmount.value = THREE.MathUtils.damp(
            uniforms.uRimAmount.value,
            pose.rimAmount * pose.opacity,
            3,
            delta
        );
        uniforms.uTintAmount.value = THREE.MathUtils.damp(
            uniforms.uTintAmount.value,
            pose.tintAmount,
            3,
            delta
        );
    });

    return (
        <group ref={groupRef} position={[0, 1.1, 0]} scale={2.6}>
            <group scale={normalized.scale} position={normalized.offset}>
                <primitive object={scene} />
            </group>
        </group>
    );
};

useGLTF.preload(MODEL_URL);

/* ═══════════════════════════════════════════════════════════
   FULLSCREEN CANVAS WRAPPER
   ═══════════════════════════════════════════════════════════ */
const FullscreenAvatarCanvasInner = ({ currentSection, theme }) => {
    const pointer = useRef({ x: 0, y: 0 });
    const pointerTarget = useRef({ x: 0, y: 0 });
    const scrollVelocity = useRef(0);
    const reducedMotion = useMemo(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        []
    );

    /* Pointer is smoothed here (rAF) rather than in useFrame so the raw event
       stream never produces a rigid, stepped response. */
    useEffect(() => {
        let raf;
        const onMove = (e) => {
            pointerTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointerTarget.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        const smooth = () => {
            pointer.current.x += (pointerTarget.current.x - pointer.current.x) * 0.08;
            pointer.current.y += (pointerTarget.current.y - pointer.current.y) * 0.08;
            raf = requestAnimationFrame(smooth);
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        raf = requestAnimationFrame(smooth);
        return () => {
            window.removeEventListener('pointermove', onMove);
            cancelAnimationFrame(raf);
        };
    }, []);

    useEffect(() => {
        let last = window.scrollY;
        let raf;
        const onScroll = () => {
            scrollVelocity.current = window.scrollY - last;
            last = window.scrollY;
        };
        const decay = () => {
            scrollVelocity.current *= 0.9;
            raf = requestAnimationFrame(decay);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        raf = requestAnimationFrame(decay);
        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(raf);
        };
    }, []);

    /* Ambient layers are driven imperatively on rAF. They only ever touch
       `transform`, so each stays on the compositor — no layout, no paint. */
    const gridRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        if (reducedMotion) return undefined;
        let raf;
        const TILE = 34; // must match --grid-tile in index.css
        const tick = () => {
            const gx = pointer.current.x;
            const gy = pointer.current.y;
            if (gridRef.current) {
                // Modulo the scroll parallax by the tile size so the matrix
                // drifts forever without the layer ever running out of dots.
                const drift = (window.scrollY * 0.06) % TILE;
                gridRef.current.style.transform =
                    `translate3d(${(-gx * 16).toFixed(2)}px, ${(-gy * 16 + drift).toFixed(2)}px, 0)`;
            }
            if (glowRef.current) {
                const cx = (gx * 0.5 + 0.5) * window.innerWidth;
                const cy = (0.5 - gy * 0.5) * window.innerHeight;
                glowRef.current.style.transform =
                    `translate3d(${(cx - 320).toFixed(1)}px, ${(cy - 320).toFixed(1)}px, 0)`;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [reducedMotion]);

    const isDark = theme === 'dark';

    return (
        <div className="avatar-stage" aria-hidden="true">
            {/* Base wash — matches --bg-main exactly in both themes */}
            <div
                className="absolute inset-0 transition-colors duration-700"
                style={{ backgroundColor: isDark ? '#07070B' : '#F5F2EB' }}
            />

            {/* Architectural dot matrix — parallaxes against pointer + scroll */}
            <div ref={gridRef} className="ambient-grid" />

            {/* Cursor-tracking ambient light */}
            <div ref={glowRef} className="cursor-glow" />

            {/* Static centre bloom */}
            <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full transition-opacity duration-700"
                style={{
                    background: isDark
                        ? 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)',
                }}
            />

            <Canvas
                camera={{ position: [0, 0, CAM_Z], fov: CAM_FOV, near: 0.1, far: 40 }}
                className="avatar-canvas"
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                dpr={[1, 1.75]}
            >
                {MODEL_LIT ? (
                    <>
                        {/* IBL does the heavy lifting on a PBR scan — it is what
                            produces believable skin falloff and the moving
                            specular in the eyes. The HDRI was already in the
                            repo, previously unused. */}
                        <Environment files="/hdri/potsdamer_platz_1k.hdr" />
                        <ambientLight intensity={0.25} />
                        <directionalLight position={[3, 4, 5]} intensity={2.2} castShadow />
                        <directionalLight position={[-4, 2, 2]} intensity={0.6} color="#b6c4ff" />
                        <directionalLight position={[0, 3, -4]} intensity={1.1} color="#ffd9b0" />
                    </>
                ) : (
                    /* The shaded material is unlit (emissive-only); this light
                       contributes nothing and is kept only so the scene stays
                       valid if the asset is swapped. */
                    <ambientLight intensity={1} />
                )}
                <Suspense fallback={null}>
                    <AvatarModel
                        pointer={pointer}
                        scrollVelocity={scrollVelocity}
                        currentSection={currentSection}
                        reducedMotion={reducedMotion}
                    />
                </Suspense>

                {/* ── POST PROCESSING ──────────────────────────────────────
                    HalfFloat buffer so the >1.0 rim survives into the bloom
                    pass. Order matters: bloom reads HDR, chromatic aberration
                    warps the composite, tone mapping lands it back in SDR. */}
                <EffectComposer
                    multisampling={2}
                    frameBufferType={THREE.HalfFloatType}
                    enableNormalPass={false}
                >
                    <Bloom
                        intensity={0.85}
                        luminanceThreshold={1.0}
                        luminanceSmoothing={0.28}
                        radius={0.62}
                        mipmapBlur
                    />
                    <ChromaticAberration
                        blendFunction={BlendFunction.NORMAL}
                        offset={[0.0005, 0.0007]}
                        // Keeps the optical centre perfectly clean and lets the
                        // fringing build only toward the edges of the frame.
                        radialModulation
                        modulationOffset={0.42}
                    />
                    <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
                </EffectComposer>
            </Canvas>
        </div>
    );
};

const FullscreenAvatarCanvas = ({ currentSection = 'about', theme = 'dark' }) => (
    <CanvasErrorBoundary>
        <FullscreenAvatarCanvasInner currentSection={currentSection} theme={theme} />
    </CanvasErrorBoundary>
);

export default FullscreenAvatarCanvas;
