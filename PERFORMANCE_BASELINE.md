# Performance Baseline

Captured: 2026-09-09  
Primary environment: locally served production build  
Secondary environment: Vite development server

## Phase 0 record

```text
BASELINE_COMMIT=49c5f943b4e8eabbd8f5f90ee5101b7778c7b31a
OPTIMIZATION_BRANCH=codex/performance-optimization
BUILD_COMMAND=npm run build
LOCAL_RUN_COMMAND=npm run dev -- --host 127.0.0.1 --port 3000
PRODUCTION_BUILD_COMMAND=npm run build; npm run preview -- --host 127.0.0.1 --port 4173
DEPLOY_COMMAND_NOT_RUN=npm run deploy (gh-pages -d dist)
```

The starting working tree was not clean. The pre-existing modified/untracked files were preserved and treated as part of the visual baseline, including `src/components/AvatarCanvas.jsx`, portfolio data, the split-eye model experiments, and related scripts. No deployment command was run.

The configured production build passed before optimization. Vite transformed 2,482 modules. The build emitted:

| Chunk | Decoded | Gzip |
| --- | ---: | ---: |
| WebGL | 965.11 kB | 258.67 kB |
| React | 146.20 kB | 47.55 kB |
| Framer Motion | 117.03 kB | 38.97 kB |
| App entry | 47.39 kB | 15.04 kB |
| Avatar component | 8.73 kB | 3.66 kB |
| CSS | 33.61 kB | 7.64 kB |

## Stack and delivery

- Framework/build: React 18.2, Vite 5.4, Tailwind CSS 3.4.
- Motion: Framer Motion 11 plus CSS keyframes/transitions.
- 3D: Three.js 0.169, React Three Fiber 8.18, Drei 9.122.
- Post-processing: `@react-three/postprocessing` / `postprocessing` with mipmapped bloom, chromatic aberration, and ACES tone mapping.
- Model: `/models/avatar.glb`, meshopt-compressed and quantized, with an embedded WebP texture.
- Production deployment: `gh-pages -d dist`; intentionally not executed.

## Test method

Chrome 152.0.7977.83 was launched through the Chrome DevTools Protocol. CPU throttling was real DevTools throttling (`Emulation.setCPUThrottlingRate`), not a simulated score adjustment.

```text
Primary viewport: 1366x768
Secondary viewport: 1920x1080
Device pixel ratio: fixed at 1 for repeatability
Display cadence observed by headless Chrome: 120 Hz
Warm-up: 5 seconds for steady-state scenarios
Scenario duration: 20 seconds
Runs: 5 per primary scenario/rate
CPU: 1x, 4x, 6x at 1366x768; 1x at 1920x1080
Sustained scenario: 60 seconds at 1x, 4x, and 6x
```

The benchmark records PerformanceObserver entries, CDP Performance-domain counters, Navigation/Resource Timing, JS heap/DOM metrics, event-listener accounting, and WebGL draw/resource calls injected before application code. Instrumentation is external and does not ship in the production bundle.

GPU throttling was not available and was not fabricated. The measured GPU is an NVIDIA GeForce RTX 5070 Ti Laptop GPU through ANGLE/D3D11. Results therefore quantify CPU sensitivity reliably but do not reproduce an integrated-GPU fill-rate ceiling.

Jank is defined as a frame interval over 33.3 ms. Per-run counts over 16.7 ms, 33.3 ms, and 50 ms are retained. Because the host refresh cadence is 120 Hz (8.33 ms), a 16.7 ms interval by itself is a missed 120 Hz refresh but still fits a 60 Hz budget.

## Baseline summary

### Independent Lighthouse load audit

Five locally served production audits at 1366x768, real 4x CPU slowdown, and no artificial network delay:

| Metric | Five-run mean |
| --- | ---: |
| Lighthouse Performance | 72 |
| FCP | 1,037 ms |
| LCP | 1,454 ms |
| Total Blocking Time | 464 ms |
| Speed Index | 1,547 ms |
| CLS | 0.000 |
| Main-thread work | 8,575 ms |
| JavaScript boot-up work | 3,584 ms |
| Long tasks | 11 |
| Longest long task | 538 ms |
| Total byte weight | 12.46 MB |
| Unused-JS estimate | 138.10 kB |

Lighthouse main-thread breakdown in a representative run: 3,614 ms script evaluation, 3,330 ms other work, 1,332 ms style/layout, 486 ms rendering, and 24 ms garbage collection.

### Initial load, production build (20 seconds from navigation)

| CPU | Avg FPS | p95 | p99 | Main-thread busy | Long tasks | Long-task total | TBT | FCP | LCP |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1x | 118.41 | 8.44 ms | 8.50 ms | 3,355 ms | 0.6 | 106 ms | 76 ms | 204 ms | 321 ms |
| 4x | 112.62 | 8.46 ms | 11.90 ms | 10,327 ms | 6.6 | 789 ms | 459 ms | 500 ms | 1,662 ms |
| 6x | 103.40 | 11.76 ms | 21.74 ms | 17,276 ms | 10.4 | 1,724 ms | 1,204 ms | 795 ms | 2,103 ms |

The custom navigation timing uses the local server and is intentionally not substituted for real Internet TTFB. Local TTFB is not decision-useful here.

### Steady 1366x768 scenarios at 6x CPU

| Scenario | Avg FPS | 1% low | p95 | p99 | Jank | Busy / 20 s | Script | Style recalc | Layout |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Idle | 118.16 | 71.65 | 8.48 ms | 15.00 ms | 0.05% | 15,007 ms | 4,647 ms | 2,055 ms | 1.9 ms |
| Full-page scroll | 115.66 | 59.88 | 8.50 ms | 16.70 ms | 0.14% | 16,381 ms | 5,732 ms | 2,203 ms | 33.9 ms |
| Pointer/hover interaction | 82.70 | 39.87 | 16.80 ms | 25.08 ms | 0.41% | 19,646 ms | 6,352 ms | 3,535 ms | 6.7 ms |
| Scroll away/return | 110.02 | 51.78 | 14.98 ms | 20.04 ms | 0.54% | 16,068 ms | 6,018 ms | 1,770 ms | 46.0 ms |

### Theme-toggle interaction

The theme button was clicked once per second, exercising the unchanged 600-700 ms color transitions. This is the only scenario with an INP-compatible trusted click.

| CPU | Avg FPS | p95 | p99 | Jank | Main-thread busy / 20 s | Style recalc | Long tasks | TBT | Lab INP |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1x | 104.78 | 16.70 ms | 20.06 ms | 0.07% | 13,781 ms | 9,960 ms | 0.2 | 0 ms | 58 ms |
| 4x | 49.37 | 86.58 ms | 133.32 ms | 15.98% | 18,507 ms | 9,981 ms | 129.2 | 3,555 ms | 307 ms |
| 6x | 31.80 | 164.98 ms | 265.00 ms | 15.51% | 20,484 ms | 9,977 ms | 94.2 | 7,918 ms | 363 ms |

The five-run range widened in later click runs, consistent with sustained thermal/context pressure. The means and every raw run are retained; no single best run is used.

### Sustained 60-second session

The sustained scenario combines continuous pointer movement and four full-page scroll cycles.

| CPU | Avg FPS | p95 | p99 | Jank | Busy / 60 s | Script | Style recalc | Long tasks | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1x | 119.33 | 8.40 ms | 8.50 ms | 0.07% | 14,118 ms | 3,694 ms | 3,604 ms | 0 | 0 ms |
| 4x | 109.60 | 16.70 ms | 16.80 ms | 0.11% | 48,385 ms | 14,015 ms | 11,576 ms | 1 | 78 ms |
| 6x | 73.65 | 25.00 ms | 33.40 ms | 1.90% | 58,698 ms | 18,706 ms | 12,150 ms | 3 | 232 ms |

### Network and JavaScript

| Metric | Baseline |
| --- | ---: |
| Initial transferred bytes (custom top-of-page run) | 10.97 MB |
| Initial decoded resource bytes | 11.92 MB |
| Lighthouse total byte weight | 12.46 MB |
| Initial JavaScript transferred | 365.38 kB |
| Total JavaScript decoded | 1,284.46 kB |
| JavaScript requests | 5 |
| Model transfer | 10,487,852 bytes |
| Model body size | 10,487,552 bytes |
| Embedded WebP texture | 3,195,802 bytes |
| Lighthouse font transfer | 154.29 kB across 4 font requests |
| Lighthouse image transfer | 1.44 MB across 8 image requests |

The model already uses `EXT_meshopt_compression`, `KHR_mesh_quantization`, and `EXT_texture_webp`; a simplistic recompression pass is not justified.

### Memory, DOM, listeners, and WebGL

| Metric | Baseline |
| --- | ---: |
| Stabilized JS heap after initial 20 s, 6x | 20.71 MB |
| JS heap after sustained 60 s, 6x | 17.49 MB |
| DOM nodes | 694 |
| Active scroll listeners | 4 |
| Active pointermove listeners | 4 |
| Active mousemove listeners | 3 |
| WebGL draw calls / rendered frame | 20 |
| Triangles / rendered frame | 1,000,017 |
| Model vertices | 767,460 |
| Model triangles | 999,998 |
| Active WebGL buffers | 6 |
| Active WebGL textures | 23 |
| Active WebGL programs | 7-8 |
| Active WebGL framebuffers | 20 |
| Active WebGL renderbuffers | 6 |

Resource counts stayed stable during the scroll-away/return and sustained scenarios. No duplicated canvas, accumulating event handler, renderer recreation, or within-page GPU resource leak was observed.

Average idle RAF callback volume is about 709 callbacks/second at 6x and about 720 callbacks/second at 1x, or roughly six callbacks per 120 Hz display refresh. During scripted scroll it rises to about 799 callbacks/second because scrolling adds more scheduled work.

Paint and composite durations are not separately exposed by the stable CDP Performance metric set used here. Lighthouse's representative combined Rendering category was 486 ms. Separate paint/composite figures are reported as N/A rather than inferred.

## Ranked bottlenecks

### P0 - Theme transition invalidates and interpolates a broad set of surfaces

**Finding:** Repeated theme transitions are the worst measured low-end interaction.

**Evidence:** At 6x, the theme scenario falls to 31.80 FPS, 164.98 ms p95, 265 ms p99, 15.51% janky frames, 7,918 ms TBT, and 363 ms lab INP. Style recalculation consumes about 9,977 ms of a 20-second run. The 4x result is 49.37 FPS and 86.58 ms p95.

**Affected files:** `src/index.css`, `src/App.jsx`, `src/components/AvatarCanvas.jsx`.

**Affected code:** Root theme variables and the broad transition selector in `src/index.css`; `useTheme()` and the full `App` render path; theme-dependent stage elements.

**Measured cost:** Compared with 6x idle, theme toggling adds roughly 7.4 seconds of style recalculation and fills the main thread for essentially the whole sample.

**Likely root cause:** A root class change changes many inherited custom properties while many links, buttons, glass panels, tags, and timeline nodes independently interpolate theme-dependent properties. App state also re-renders the full page subtree on every toggle.

**Proposed fix:** First isolate static React content from theme-state renders and remove transition targets that do not actually change. Preserve the exact CSS durations/easing for visible properties. Do not replace the transition with a global snapshot fade unless motion comparison proves equivalence.

**Expected benefit:** Lower script/reconciliation work and potentially lower style work during theme changes, especially at 4x/6x.

**Risk of visual regression:** Medium to high. Timing and interpolation must be checked at multiple timestamps. Any visible change will be reverted.

**Validation:** Five repeated trusted-click runs at 1x/4x/6x; screenshots during dark-to-light and light-to-dark transitions; source-level duration/easing comparison.

### P1 - Pointer path performs React work for every mouse event

**Finding:** Pointer/hover motion is the largest sustained CPU-specific slowdown.

**Evidence:** At 6x, pointer interaction averages 82.70 FPS versus 118.16 FPS idle. Main-thread busy time rises by 4,639 ms (+30.9%), script by 1,704 ms (+36.7%), and style recalculation by 1,480 ms (+72.0%) in the same 20-second window.

**Affected file:** `src/components/CustomCursor.jsx`.

**Affected component/function:** `CustomCursor`, especially `updateMousePosition()` and the two state-driven Framer `animate` objects.

**Measured cost:** 35.46 FPS lost at 6x relative to idle; p95 doubles from 8.48 ms to 16.80 ms.

**Likely root cause:** `setMousePosition({x, y})` allocates a new object and causes a React render on every `mousemove`. That rebuilds two animation target objects and reconciles both cursor elements. The visibility state is also an effect dependency, causing listener detach/reattach when visibility first changes.

**Proposed fix:** Move x/y into Framer motion values and start equivalent 0.10 s linear / 0.15 s ease-out tweens imperatively, leaving React state only for infrequent visibility/hover changes or moving those to motion values as well.

**Expected benefit:** Remove high-frequency React rendering and object creation while preserving cursor positions, duration, easing, scale, and blend appearance.

**Risk of visual regression:** Medium. Tween interruption behavior must match the current Framer transition semantics.

**Validation:** Five 6x pointer runs, cursor trajectory samples, hover screenshots, and source-level transition equality.

### P1 - One-million-triangle scene plus full-resolution post-processing is a high fixed GPU workload

**Finding:** The 3D scene is a major GPU risk, but not the sole or primary measured CPU bottleneck.

**Evidence:** Every rendered frame issues 20 WebGL calls and approximately 1,000,017 triangles. The model itself contains 999,998 triangles and 767,460 vertices. The composer owns 20 framebuffers and 23 textures at a full 1366x768 or 1920x1080 canvas. Live DPR can rise to 1.75, increasing pixel work substantially. The high-end RTX 5070 Ti sustains 120 Hz after warm-up; a weak integrated GPU was not available.

**Affected file:** `src/components/AvatarCanvas.jsx`.

**Affected components:** `AvatarModel`, `Canvas`, and `EffectComposer` with Bloom, ChromaticAberration, and ToneMapping.

**Measured cost:** GPU time is unavailable, so no millisecond cost is fabricated. Draw/triangle/resource load is directly measured.

**Likely root cause:** High geometric throughput plus full-screen half-float post-processing and mipmapped bloom. This is intentional visual work, not necessarily waste.

**Proposed fix:** Preserve geometry, texture, antialiasing, bloom, chromatic aberration, tone mapping, camera, and DPR. Optimize surrounding CPU orchestration first. Only change composer architecture if A/B screenshots and motion captures prove equivalence.

**Expected benefit:** CPU-side improvements help weak CPUs; GPU-bound integrated systems may remain limited.

**Risk of visual regression:** High for any renderer/post-process change.

**Validation:** Draw calls and triangles must remain unchanged unless a pass-merging implementation produces perceptually equivalent output; static and motion comparisons are mandatory.

### P1 - Multiple independent continuous RAF loops duplicate scheduling

**Finding:** The avatar wrapper runs three custom infinite RAF loops in addition to React Three Fiber, Framer Motion, and the benchmark sampler.

**Evidence:** Idle records roughly six callbacks per 120 Hz refresh. Source inspection shows separate pointer smoothing, scroll decay, and ambient DOM transform loops.

**Affected file:** `src/components/AvatarCanvas.jsx`.

**Affected code:** The three `useEffect()` blocks in `FullscreenAvatarCanvasInner` that each call `requestAnimationFrame` recursively.

**Measured cost:** Exact isolated milliseconds are not yet attributed. Aggregate 6x idle task time is 15,007 ms/20 s with about 709 RAF callbacks/second.

**Likely root cause:** Three callbacks repeatedly wake the main thread and perform independent closure/ref work at the same display cadence.

**Proposed fix:** Consolidate the three callbacks into one loop without changing any smoothing coefficient, scroll decay, transform formula, or frame cadence.

**Expected benefit:** Remove two callbacks per refresh and reduce scheduler/closure overhead; approximately one-third fewer application-owned continuous RAF callbacks.

**Risk of visual regression:** Low if update order and formulas remain identical.

**Validation:** RAF callback count, 6x idle/scroll/return metrics, and transform/motion screenshots.

### P2 - Per-frame invariant Three.js calculations and color-string parsing

**Finding:** The model loop recomputes invariant camera framing and parses section color strings every frame.

**Evidence:** Source inspection shows `Math.tan(camera.fov / 2)`, fixed camera-depth math, and `tmpColor.set(pose.rim)` / `tmpColor.set(pose.tint)` inside `useFrame()`.

**Affected file:** `src/components/AvatarCanvas.jsx`.

**Affected component:** `AvatarModel`.

**Measured cost:** Not isolated; included in the 4,647 ms 6x idle script time. No standalone claim will be made unless a targeted rerun moves the metric.

**Likely root cause:** Values that change only on viewport or section changes are recalculated/parsed at display cadence.

**Proposed fix:** Precompute `THREE.Color` targets and cache camera framing terms, invalidating only on camera/viewport changes. Preserve identical numeric outputs.

**Expected benefit:** Small recurring script reduction and fewer parsing operations.

**Risk of visual regression:** Low with numeric-equivalence checks.

**Validation:** 6x idle benchmark and transform/color screenshots.

### P2 - Scroll-section tracking performs unused and duplicated work

**Finding:** App-level scroll progress is updated into a ref but never consumed, and five IntersectionObserver instances track five sections where one observer is sufficient.

**Evidence:** `useScrollSection()` registers a scroll listener solely to update the unused `scrollProgress` ref and constructs one observer per section. Four scroll listeners are active overall.

**Affected file:** `src/App.jsx`.

**Affected hook:** Local `useScrollSection()`.

**Measured cost:** 6x full-page scroll adds 1,374 ms main-thread work and 1,084 ms script relative to idle, though only a portion is attributable to this hook.

**Likely root cause:** Redundant event callbacks and observer instances.

**Proposed fix:** Remove the unused progress listener and use one IntersectionObserver with the same thresholds, root margin, ratio map, and section-selection rule.

**Expected benefit:** Lower scroll callback and observer overhead with identical active-section behavior.

**Risk of visual regression:** Low.

**Validation:** Nav-active state sampled throughout the same scroll trajectory plus five 6x scroll/return runs.

### P3 - Mismatched font preload creates an extra request

**Finding:** `index.html` preloads a Space Grotesk-only stylesheet but applies a different combined Google Fonts stylesheet.

**Evidence:** Network traces show three stylesheet requests; the unmatched preload body is 468 bytes plus request overhead and cannot satisfy the actual stylesheet request.

**Affected file:** `index.html`.

**Affected code:** The `rel="preload"` Google Fonts link.

**Measured cost:** One redundant request; approximately 768 transferred bytes in the custom trace.

**Likely root cause:** The font request changed after the preload URL was added.

**Proposed fix:** Remove the unmatched preload or make it exactly match the applied stylesheet. Preserve font families, axes, display policy, and appearance.

**Expected benefit:** One fewer request and no wasted preload slot.

**Risk of visual regression:** None if the applied stylesheet remains unchanged.

**Validation:** Network request diff and unchanged typography screenshot.

## Visual baseline

Baseline screenshots are stored in `performance/artifacts/baseline/` for:

- Desktop 1920x1080 hero at 1.5 s and 5 s.
- Desktop hero hover and Projects transition.
- Laptop 1366x768 hero, hover, and Skills transition.
- Mobile 390x844 hero and scrolled content.

The source timing constants, keyframes, camera, section poses, shader parameters, model URL, Canvas DPR range, and post-processing settings are part of the acceptance baseline.

## Raw artifacts

- `performance/results/baseline/1366x768/`
- `performance/results/baseline/1920x1080/`
- `performance/results/baseline-initial/1366x768/`
- `performance/results/baseline-clicks/1366x768/`
- `performance/results/baseline-sustained/1366x768/`
- `performance/results/baseline-dev/1366x768/`
- `performance/results/lighthouse-baseline/`
- `performance/artifacts/baseline/`
- `scripts/performance/benchmark.mjs`

