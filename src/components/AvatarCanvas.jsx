import React, { useRef, useMemo, useEffect, Suspense, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
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

   → EYE ROTATION IS NOT ACHIEVABLE. There is no eye submesh to target, no
     bone to rotate, no morph target to drive, and the eyes are baked into a
     single continuous UV island of the body texture — a UV-offset shift or
     vertex displacement would smear the surrounding face geometry.
     Real eye motion requires re-rigging the asset (split eye spheres + bones).

   → The material is UNLIT (black albedo, full emissive). Every directional /
     point / hemisphere light in the old rig contributed exactly nothing.
     Interactivity is therefore delivered in the shader: a cursor-driven
     fresnel rim term and a section-aware colour grade injected into
     `totalEmissiveRadiance`, plus spring-damped rigid-body motion.
   ═══════════════════════════════════════════════════════════════════════ */

const MODEL_URL = '/models/avatar.glb';
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

const RIM_UNIFORM_DEFAULTS = () => ({
    uRimColor: { value: new THREE.Color('#8b93ff') },
    uRimAmount: { value: 0.55 },
    uRimPower: { value: 2.6 },
    uLightDir: { value: new THREE.Vector3(0, 0, 1) },
    uTint: { value: new THREE.Color('#ffffff') },
    uTintAmount: { value: 0 },
    uEyeOffset: { value: new THREE.Vector2(0, 0) },
});

const injectRimShader = (material, uniforms) => {
    material.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, uniforms);

        shader.fragmentShader = shader.fragmentShader
            .replace(
                '#include <common>',
                `#include <common>
                 uniform vec3  uRimColor;
                 uniform float uRimAmount;
                 uniform float uRimPower;
                 uniform vec3  uLightDir;
                 uniform vec3  uTint;
                 uniform float uTintAmount;
                 uniform vec2  uEyeOffset;`
            )
            .replace(
                '#include <emissivemap_fragment>',
                `// Shader Pupil UV Tracking (Route 3)
                 vec2 pupilUv = vEmissiveMapUv;
                 // Target eye UV areas
                 if ((pupilUv.x > 0.25 && pupilUv.x < 0.42 && pupilUv.y > 0.90) ||
                     (pupilUv.x > 0.85 && pupilUv.x < 0.98 && pupilUv.y > 0.90)) {
                     pupilUv += uEyeOffset * vec2(0.015, -0.015);
                 }
                 vec4 emissiveColor = texture2D( emissiveMap, pupilUv );
                 totalEmissiveRadiance *= emissiveColor.rgb;

                 // Section colour grade — subtle, never washes the photogrammetry out.
                 totalEmissiveRadiance *= mix( vec3( 1.0 ), uTint, uTintAmount );

                 // Silhouette fresnel.
                 float rimFresnel = pow( 1.0 - saturate( abs( normal.z ) ), uRimPower );

                 // Directional mask.
                 float rimFacing = saturate( dot( normal, normalize( uLightDir ) ) );
                 rimFacing = rimFacing * rimFacing;

                 totalEmissiveRadiance += uRimColor * rimFresnel * rimFacing * uRimAmount * ${RIM_HDR_GAIN.toFixed(1)};`
            );
    };
    material.customProgramCacheKey = () => 'avatar-rim-v2';
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
    const eyeLRef = useRef(null);
    const eyeRRef = useRef(null);
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
    useEffect(() => {
        const mats = [];
        eyeLRef.current = scene.getObjectByName('Eye_L');
        eyeRRef.current = scene.getObjectByName('Eye_R');
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
            injectRimShader(mat, uniforms);
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

        /* ── Eye rotation tracking ────────────────────────────────────────── */
        const eyeL = eyeLRef.current;
        const eyeR = eyeRRef.current;
        if (eyeL && eyeR) {
            const eyeTargetY = reducedMotion ? 0 : mx * 0.40;
            const eyeTargetX = reducedMotion ? 0 : -my * 0.28;
            eyeL.rotation.y = THREE.MathUtils.damp(eyeL.rotation.y, eyeTargetY, 8, delta);
            eyeL.rotation.x = THREE.MathUtils.damp(eyeL.rotation.x, eyeTargetX, 8, delta);
            eyeR.rotation.y = THREE.MathUtils.damp(eyeR.rotation.y, eyeTargetY, 8, delta);
            eyeR.rotation.x = THREE.MathUtils.damp(eyeR.rotation.x, eyeTargetX, 8, delta);
        }

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
        uniforms.uEyeOffset.value.x = THREE.MathUtils.damp(
            uniforms.uEyeOffset.value.x,
            reducedMotion ? 0 : mx,
            8,
            delta
        );
        uniforms.uEyeOffset.value.y = THREE.MathUtils.damp(
            uniforms.uEyeOffset.value.y,
            reducedMotion ? 0 : my,
            8,
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

    /* Pointer, scroll inertia, and ambient layers share one display-timed
       callback. Update order and coefficients match the former three loops,
       but the browser now schedules one callback instead of three. */
    const gridRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        let lastScrollY = window.scrollY;
        let raf;
        const TILE = 34; // must match --grid-tile in index.css

        const onMove = (event) => {
            pointerTarget.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointerTarget.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        const onScroll = () => {
            scrollVelocity.current = window.scrollY - lastScrollY;
            lastScrollY = window.scrollY;
        };

        const tick = () => {
            pointer.current.x += (pointerTarget.current.x - pointer.current.x) * 0.08;
            pointer.current.y += (pointerTarget.current.y - pointer.current.y) * 0.08;
            scrollVelocity.current *= 0.9;

            if (reducedMotion) {
                raf = requestAnimationFrame(tick);
                return;
            }

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

        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });
        raf = requestAnimationFrame(tick);
        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(raf);
        };
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
                {/* The material is unlit (emissive-only); a single ambient light is
                    kept purely so the scene stays valid if the asset is ever
                    swapped for a PBR-shaded one. */}
                <ambientLight intensity={1} />
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
