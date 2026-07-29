# TECH_NOTES.md — Developer & Maintenance Guide

Technical notes for maintaining and extending this portfolio (V3). Written for
a future contributor (or future you) who needs to update content, recalibrate
the 3D avatar, or ship a release without re-deriving the design decisions
baked into the code.

---

## 1. Architecture Overview

```
index.html                     Theme bootstrap (pre-paint), font + GLB preloads
src/
  main.jsx                     React 18 entry
  App.jsx                      Page shell: nav, hero, sections, footer,
                               scroll progress, motion presets
  index.css                    Design tokens (CSS custom properties),
                               component classes, Tailwind layers
  components/
    AvatarCanvas.jsx           Fullscreen WebGL stage (R3F) + ambient layers
    TiltCard.jsx               Pointer-driven Vision-Pro tilt + sheen
    FloatingBadges.jsx         Hero-only floating status chips
    ExpertiseSection.jsx       Skill vault grid
    CustomCursor.jsx           Custom cursor dot
  data/
    portfolio.js               ALL site content (single source of truth)
  utils/formatText.jsx         **bold** markup → <strong> in content strings
```

### Layer model (z-order, bottom → top)

| Layer | z | Notes |
|---|---|---|
| `.avatar-stage` (WebGL + ambient grid/glow) | 0 | `position: fixed`, pointer-events: none |
| `<main>` content | 10 | Must never gain `opacity`/`filter`/`isolation` — any of those makes it a backdrop root and blanks every glass panel |
| Floating badges | 30 | Above content, below nav |
| Nav pill | 40 | |
| Scroll progress bar | 50 | |
| Noise overlay | 60 | `pointer-events: none` |

### Stack

- **React 18 + Vite 5** — SPA, no router in the page flow.
- **Three.js via @react-three/fiber + drei + postprocessing** — the avatar
  stage. Lazy-loaded (`React.lazy`) so the ~965 kB WebGL chunk never blocks
  first paint.
- **framer-motion** — entrance choreography, scroll-linked values
  (progress bar, hero backdrop parallax). Transform/opacity only.
- **Tailwind 3** — utilities plus a hand-written component layer in
  `index.css`. Design tokens are CSS custom properties on `:root` / `.dark`,
  so the theme switch is one class toggle.

### Theming

`index.html` applies the stored theme **before first paint** (inline script
reading `localStorage['portfolio-theme']`). React's `useTheme` then toggles
the `dark` class and `data-theme` on `<html>`. The WebGL stage wash and
`--bg-main` must stay identical (`#07070B` dark / `#F5F2EB` light) or a seam
appears where the canvas ends.

### Glassmorphism invariants (do not break these)

- Every `backdrop-filter` surface is promoted (`transform: translateZ(0)`)
  — unpromoted blur surfaces re-sample a stale tile of the fixed canvas.
- No `isolation`, `opacity < 1`, or `filter` on `<main>` or the stage.
- `TiltCard` owns its element's inline `transform`; never add a CSS
  `:hover { transform }` to a tilted surface — inline always wins.
- Tailwind arbitrary values need type hints for variables:
  `text-[length:var(--fs-hero)]`, NOT `text-[var(--fs-hero)]` (the latter
  silently parses as a *colour*).

---

## 2. Content Update Conventions

All copy lives in **`src/data/portfolio.js`**. No component edits are needed
for routine content changes.

### Work experience (`workExperiences.experience[]`)

```js
{
  role: "Software Engineer Intern",
  company: "Acme",
  companylogo: "/assets/images/acmeLOGO.png",   // in public/assets/images/
  date: "May 2026 – Aug 2026",
  location: "Remote",                            // optional
  url: "https://acme.com",                       // optional — links the @company line
  descBullets: [
    "Shipped **thing** that did X",              // **bold** is rendered via formatText
  ],
}
```

Order in the array = order on the page (top = most recent). Logos are white-
plated automatically; a missing/broken logo falls back to the company initial.

### Skills (`skillsSection.softwareSkills[]`)

Each group: `category`, `description`, `skills[]` (either strings or
`{ name, level }` — only `name` is rendered today). The icon and accent
colour per category come from `categoryConfig` in
`src/components/ExpertiseSection.jsx`; add a matching entry there when adding
a new category, or it falls back to the CPU icon + indigo.

### Projects (`bigProjects`)

- `featuredProjects[]` — big cards. `stack[]` renders as tags,
  `footerLink[]` as arrow links. The project named `"Agentic Awesome Skills"`
  automatically shows the live GitHub star count (see §4, star automation).
- `otherProjects[]` — compact grid cards; only `stack[0]` is shown.

### Education (`educationInfo.schools[]`)

`schoolName`, `logo`, `subHeader` (degree), `duration`, `descBullets[]`.

### Hero / identity

- Backdrop watermark + hero heading: `HeroSection` in `App.jsx` (hardcoded).
- Terminal identity card rows: `TerminalIdentityPanel` in `App.jsx`.
- Floating badges: the `badges` array in `FloatingBadges.jsx` — position is
  % of viewport; keep chips clear of the hero panel (starts ~42% viewport
  height) and give lower badges `openUp: true` so popovers escape upward.

---

## 3. 3D Avatar & Shader Maintenance

### The asset

`public/models/avatar.glb` — photogrammetry bust, **1 mesh, no rig, no
bones, no morph targets, no eye submesh**. Material is unlit: black albedo +
full-strength emissive texture (the 2048² baked "shaded" map, WebP inside the
GLB). Consequences:

- Lights in the scene do nothing on the shipped variant. All interactivity
  (rim light, section tint, eye tracking) is **injected into the shader**.
- Eye rotation is impossible; eyes are **synthesised in the fragment shader**
  (see below).

### Framing calibration (`SECTION_POSES`)

The camera is fixed (`CAM_Z = 5.2`, `CAM_FOV = 32`). Per-section poses are
solved every frame against the visible viewport, so framing holds at any
window size. Per pose:

- `fill` — model height as a fraction of viewport height.
- `topMargin` — guaranteed gap above the head (fraction of viewport height).
  **Invariant: `fill + topMargin > 1.0`** so the chest always bleeds off the
  bottom edge (never a floating severed bust).
- `x` — horizontal centre as a fraction of half-width (`±1` = edge).
- `rotY` — resting yaw; pointer adds up to ±0.24 rad on top.
- `opacity` — pinned to 1.0 on desktop *on purpose*: alpha-blending the unlit
  texture over the background desaturates it to grey. Section 05 recedes by
  sinking/shrinking instead.
- `rim` / `rimAmount` / `tint` / `tintAmount` — section colour grade.

Mobile (`< 768px`) uses `MOBILE_POSES`: avatar is hero-only, fades out after.

Motion is spring-based (`posSpring`, `spring`, `eyeSpring` refs) — position
springs are deliberately under-damped so section changes overshoot and
settle. The `intro` ref drives the load entrance (rise from below, scale
bloom, unwinding quarter-turn, one-shot rim flare).

### Shader injection (`injectRimShader`)

Patches the GLB's `MeshStandardMaterial` via `onBeforeCompile`:

- **Rim light**: silhouette fresnel × directional mask toward the cursor,
  added to `totalEmissiveRadiance`. `RIM_HDR_GAIN = 2.4` pushes the hottest
  sliver above luminance 1.0 — the Bloom pass is thresholded at exactly 1.0,
  which is why the glow tracks the silhouette instead of haloing the face.
  Materials set `toneMapped = false` so HDR survives into the composer
  (ACES is re-applied by the final `<ToneMapping>` effect).
- **Rim suppression**: concave pockets (nostrils, mouth) graze the view like
  the silhouette does, so the fresnel would light them from inside.
  `RIM_SUPPRESS_REGIONS` masks measured UV ellipses (texel coords in the
  2048 atlas). If the texture atlas ever changes, re-measure: extract the
  WebP from the GLB (first bufferView), crop, read coordinates.
- **Procedural eyes**: inside measured aperture ellipses the baked texture is
  *replaced* by a synthesised sclera + iris drawn at the tracked position.
  All the measured constants (`EYE_A_*`, `EYE_B_*`, travel budget, per-eye
  radius correction) are documented inline — they were read off the texture,
  not guessed; don't "tidy" them.
- Bump `customProgramCacheKey` (`avatar-eye-procedural-vN`) whenever the
  injected GLSL changes, or three may reuse the stale program.

Uniform updates happen per-frame in `useFrame` — springs for gaze, damped
lerps for rim colour/amount/tint. The eye "decouple" ramp converts the baked
cross-eyed rest pose into parallel conjugate gaze as the cursor moves.

### Variants: `shaded` (shipped) vs `pbr`

`MODEL_VARIANTS` in `AvatarCanvas.jsx`. To try the lit PBR variant:

```
cp ~/Downloads/base_basic_pbr.glb public/models/avatar_pbr.glb
# in AvatarCanvas.jsx:
const VARIANT = 'pbr';
```

The PBR path is verified working (real lights + HDRI at
`public/hdri/potsdamer_platz_1k.hdr`, eye tracking included) but is NOT
shipped: the source GLB is ~55 MB and relighting an albedo with baked AO
pushes the skin orange. Shipping it needs decimation + meshopt + KTX2/WebP
compression and a material tuning pass first.

### Resilience (leave in place)

- `index.html` preloads the 10 MB GLB at t=0 (it would otherwise start only
  after the lazy chunk executes).
- The lazy import self-heals a stale-deploy chunk 404 with one guarded
  reload.
- `CanvasErrorBoundary` wraps ONLY the `<Canvas>` (ambient stage survives a
  WebGL failure) and retries twice, clearing drei's cached rejected GLB load
  before each remount.

---

## 4. Performance & Build Guidelines

### Code splitting (vite.config.js)

Manual chunks: `react`, `motion`, `webgl`. Rules that matter:

- The `webgl` chunk (~965 kB) is **lazy by design** — never import three/R3F
  from any module that the entry statically reaches.
- Vite's `preload-helper` is pinned into the `react` chunk; if Rollup folds
  it into `webgl`, the entry statically imports all of three.js and the
  code-split is silently undone (this happened; the config comment explains).
- Content edits and 3D edits bust separate cache entries — keep it that way.

### Motion performance rules

- Animate **transform and opacity only** (compositor-friendly). The ambient
  grid/glow are driven imperatively on rAF and only touch `transform`.
- Scroll/pointer handlers are passive; scroll velocity decays on rAF.
- Every animation must respect `prefers-reduced-motion` — CSS is covered by
  the global kill block in `index.css`; new JS springs should check the
  `reducedMotion` flag like the existing ones.

### Asset optimisation

- Avatar GLB: meshopt-compressed geometry + WebP texture (10 MB, from a
  55 MB source). Any new 3D asset should go through the same pipeline
  (`gltf-transform` meshopt + WebP/KTX2).
- Images in `public/assets/images/` are plain files — keep logos small
  (they render at 40–48 px).
- GitHub stars are fetched **at build time** (`npm run update-stars` runs as
  `prebuild`, writing `public/stars.json`) — no client-side API calls.

### Build & deploy

```bash
npm run build      # prebuild refreshes stars.json, then vite build → dist/
npm run deploy     # gh-pages -d dist → pushes dist/ to the gh-pages branch
```

GitHub Pages serves the `gh-pages` branch. A hashed-chunk deploy invalidates
tabs opened before it — the app self-heals with one reload (see §3), but
expect one flash on the first visit after a release.

Release checklist:

1. `npx vite build` — zero errors/warnings expected.
2. Visual pass in BOTH themes: hero (avatar framed, badges clear of panels),
   each section pose, mobile width. Pixels catch what builds cannot —
   headless Chrome + CDP screenshots work fine for this.
3. `npm run deploy`.
4. Merge the working branch into `main` so source history matches the
   deployed site.

---

*Last updated: 2026-07-28 (V3 release).*
