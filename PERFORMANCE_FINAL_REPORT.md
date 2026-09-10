# Performance Final Report

## 1. Bottom Line

The primary avoidable costs were duplicate animation scheduling, React reconciliation on every pointer event, redundant scroll observation, and rebuilding the static page tree during theme/section updates. The 3D scene was also a major fixed GPU/network cost: it renders 1,000,017 triangles in 20 draw calls every frame and ships a 10,487,552-byte GLB, but it was not leaking or being recreated.

The retained changes reduce avatar-wrapper RAF dispatches by 33.3%, pointer scripting by 9.6% in the isolated five-run comparison, and theme-toggle scripting by 18.3% in the final end-to-end comparison. At 6x CPU slowdown, clean-navigation LCP improved 6.1%, FCP improved 4.4%, TBT improved 12.7%, and the longest task improved 17.7%. Repeated theme toggles improved p95 frame time 12.1%, p99 27.7%, INP 22.0%, and TBT 13.7%.

The result is not a universal FPS increase. The ordered 6x sustained run was worse (57.9 versus 73.6 FPS), and repeated theme transitions still average 28.3 FPS at 6x because preserved page-wide color transitions are style/paint heavy. Normal 1920x1080 operation holds the 120 Hz test cadence in every scenario. No animation, transition, model detail, camera behavior, lighting, material, post-processing pass, DPR setting, or interaction was removed or reduced.

## 2. Before vs After

The main table uses the five-run 1366x768, 6x CPU-throttled clean-navigation scenario unless a row says otherwise. This keeps load and runtime numbers from unlike scenarios out of the same comparison.

| Metric | Baseline | Optimized | Change | Better/Worse |
| --- | ---: | ---: | ---: | --- |
| Lighthouse Performance (5-run mean, 4x) | 72.0 | 71.4 | -0.6 pt | Slightly worse / neutral |
| LCP | 2,103.2 ms | 1,974.4 ms | -6.1% | Better |
| FCP | 795.2 ms | 760.0 ms | -4.4% | Better |
| TBT | 1,204.0 ms | 1,051.4 ms | -12.7% | Better |
| Main-thread busy time | 17,276.4 ms | 17,310.0 ms | +0.2% | Neutral |
| Long Tasks | 10.4 | 10.6 | +1.9% | Neutral/slightly worse |
| Longest Long Task | 480.0 ms | 394.8 ms | -17.7% | Better |
| Average FPS | 103.40 | 99.48 | -3.8% | Worse |
| p95 frame time | 11.76 ms | 16.62 ms | +41.3% | Worse |
| p99 frame time | 21.74 ms | 26.66 ms | +22.6% | Worse |
| Janky frames (>33.3 ms) | 0.726% | 0.642% | -11.6% | Better |
| JS transferred | 365,380 B | 367,409 B | +0.6% | Worse |
| Total transferred | 10,966,382 B | 10,967,663 B | +0.01% | Neutral |
| Model bytes | 10,487,552 B | 10,487,552 B | 0 | Same |
| Embedded texture bytes | 3,195,802 B | 3,195,802 B | 0 | Same |
| Draw calls/frame | 20 | 20 | 0 | Same |
| Triangles/frame | 1,000,017 | 1,000,017 | 0 | Same |
| JS heap, 60-second 1x endpoint | 17.04 MB | 10.16 MB | -40.4% observed | Better, GC-sensitive |

Lighthouse itself was effectively flat: FCP improved from 1,037.4 to 993.2 ms and Speed Index from 1,547.0 to 1,506.4 ms, while LCP was neutral (1,454.0 to 1,458.2 ms), TBT regressed from 464.4 to 485.1 ms, and main-thread work regressed from 8,574.7 to 9,970.8 ms. The five final reports contain no run warnings or runtime errors. Lighthouse is retained as one signal, not used as proof of the runtime optimizations.

### Attributable optimization results

| Pass | Comparison | Baseline | Optimized | Result |
| --- | --- | ---: | ---: | --- |
| OPT-01 | Idle RAF callbacks, 6x | 708.8/s | 472.6/s | -33.3% |
| OPT-01 | Idle main-thread busy, 6x | 15,007 ms | 14,670 ms | -2.2% |
| OPT-01 | Idle p99, 6x | 15.00 ms | 11.84 ms | -21.1% |
| OPT-02 | Pointer script time, isolated 6x | 6,630 ms | 5,994 ms | -9.6% |
| OPT-04 | Theme script time, final 6x | 3,532 ms | 2,886 ms | -18.3% |
| OPT-04 | Theme p95 / p99, final 6x | 164.98 / 265.00 ms | 145.06 / 191.66 ms | -12.1% / -27.7% |
| OPT-04 | Theme INP, final 6x | 363.2 ms | 283.2 ms | -22.0% |
| OPT-04 | Theme TBT, final 6x | 7,918 ms | 6,833 ms | -13.7% |
| OPT-05 | Clean-load requests | 13.2 | 12.2 | -1 request |

## 3. What Was Actually Slow

### P0 - Preserved WebGL workload under prolonged throttling

- **Finding:** the page continuously renders a million-triangle, full-viewport, post-processed WebGL scene.
- **Evidence:** exactly 20 draw calls and 1,000,017 triangles per rendered frame in every idle, scroll, interaction, return, and sustained sample. The 6x sustained scenario averaged 57.9 FPS with a 33.3 ms p95 and 49.9 ms p99 after optimization.
- **Affected code:** `src/components/AvatarCanvas.jsx`, especially `FullscreenAvatarCanvasInner` and the React Three Fiber scene.
- **Root cause:** fixed model complexity plus full-resolution DPR up to 1.75, 23 textures, 20 framebuffers, lighting, bloom, and chromatic aberration. This is GPU and compositing work, not a leak.
- **Resolution:** remove duplicate wrapper scheduling while preserving all rendering inputs. Polygon count, textures, antialiasing, lighting, shadows, post-processing, DPR, camera, and model animation remain unchanged.
- **Remaining risk:** high on genuinely weak integrated GPUs; GPU throttling was unavailable, so no simulated GPU result is claimed.

### P1 - Whole-page theme-transition style and paint cost

- **Finding:** repeated theme toggles remain the worst main-thread scenario.
- **Evidence:** optimized 6x runs spend 10.33 seconds of 20 seconds in style recalculation, with 119.8 long tasks and 28.3 FPS. Script time, p95/p99, INP, and TBT improved, but average FPS fell from 31.8 to 28.3 and jank rose from 15.5% to 19.2% in the ordered final set.
- **Affected code:** `src/App.jsx` and the CSS custom-property transition rules in `src/index.css`.
- **Root cause:** intentional theme changes affect many painted descendants while WebGL continues rendering behind them.
- **Resolution:** memoize static React content so theme updates do not also rebuild it. The CSS transition remains exactly intact.

### P1 - Pointer-driven React work

- **Finding:** the custom cursor originally updated React state for every mouse movement and reattached listeners after visibility changed.
- **Evidence:** 6x isolated pointer scripting fell 9.6%, from 6.63 to 5.99 seconds, after removing per-event React renders.
- **Affected code:** `src/components/CustomCursor.jsx`.
- **Root cause:** high-frequency state-object allocation, reconciliation, and Framer retargeting on the same event.
- **Resolution:** stable Framer MotionValues and one listener lifetime; the original 100 ms linear dot and 150 ms ease-out ring transitions are preserved.

### P2 - Duplicate animation and scroll bookkeeping

- **Finding:** three wrapper RAF loops ran beside the WebGL/Framer loops; five section observers and one unused scroll calculation also ran.
- **Evidence:** OPT-01 reduced RAF callback rate 33.3% and idle busy time 2.2%. The observer consolidation did not produce a repeatable wall-time win and is therefore logged as neutral.
- **Affected code:** `src/components/AvatarCanvas.jsx` and `src/App.jsx`.
- **Resolution:** one ordered wrapper RAF and one observer for all sections; unused scroll progress removed.

### P2 - Large initial asset and JavaScript payload

- **Finding:** the GLB dominates the transfer, and the WebGL chunk dominates JS.
- **Evidence:** model 10,487,552 bytes; embedded WebP 3,195,802 bytes; WebGL chunk 965.11 kB decoded / 258.67 kB gzip; total page transfer about 10.97 MB in the custom harness and 12.46 MB in Lighthouse.
- **Resolution:** no model/texture reduction was accepted because equivalent appearance could not be proved. One duplicate font stylesheet request was removed.

## 4. What Changed

### OPT-01 - One avatar-wrapper animation loop

**Before:** pointer smoothing, scroll-velocity decay, and grid/glow transforms each scheduled an infinite RAF callback.

**Why expensive:** three callbacks woke the main thread independently at every display refresh while React Three Fiber and Framer also scheduled animation work.

**After:** `FullscreenAvatarCanvasInner` performs the same operations in the same order from one RAF callback.

**Why faster:** two callback dispatches per refresh are eliminated without skipping frames or changing calculations.

**Visual impact:** none; constants (`0.08` smoothing and `0.9` decay), formulas, ordering, and cadence are unchanged.

**Measured impact:** RAF -33.3%, idle busy -2.2%, idle p99 -21.1%, return busy -2.1%, return p95 -21.5% in the pass-specific five-run test.

### OPT-02 - Cursor MotionValues instead of pointer React state

**Before:** each `mousemove` allocated a position object, scheduled a React state update, reconciled the cursor, and retargeted Framer animations. The effect depended on visibility and reattached four listeners after first movement.

**After:** stable MotionValues hold x/y/opacity/scale; stable listeners retarget them directly. The ring background continues to change on the same hover targets.

**Why faster:** the pointer hot path no longer enters React reconciliation or recreates state objects/listeners.

**Visual impact:** dot/ring offsets, sizes, blend mode, colors, hover target rules, 100/150 ms timings, and easing are unchanged.

**Measured impact:** isolated pointer script -9.6%; average FPS +1.3% directional; p95 neutral. Final 6x pointer performance remained thermally variable and is not overstated.

### OPT-03 - One section observer, no dead scroll listener

**Before:** five `IntersectionObserver` instances watched one section each; a passive scroll handler calculated a progress value that no code read.

**After:** one observer watches all five sections and retains the same thresholds, root margin, ratio selection, and activation gate. The unused scroll listener is gone.

**Why faster:** less observer/listener bookkeeping and one fewer forced scroll-height read opportunity.

**Visual impact:** navigation highlight and scroll-trigger timing are unchanged.

**Measured impact:** no repeatable aggregate speedup; retained as a measured, low-risk redundancy removal.

### OPT-04 - Memoized static page content

**Before:** theme and current-section changes rebuilt every experience card, project card, expertise block, and footer React element.

**After:** the static `<main>` tree is `React.memo`-wrapped and receives only `stars`; fixed UI layers still receive theme/current-section updates and CSS variables still repaint the memoized content.

**Why faster:** already-expensive theme transitions do less JavaScript/reconciliation work.

**Visual impact:** no CSS rule or transition was changed.

**Measured impact:** final 6x theme script -18.3%, p95 -12.1%, p99 -27.7%, INP -22.0%, TBT -13.7%. Average FPS and jank were worse because style/paint still dominate; that regression is not hidden.

### OPT-05 - Correct font loading

**Before:** a Space Grotesk-only stylesheet was preloaded, then a different combined Inter/Space Grotesk/JetBrains Mono stylesheet was requested for use.

**After:** the mismatched preload is removed; both preconnects and the real combined stylesheet remain.

**Why faster:** avoids a request that cannot satisfy the applied stylesheet.

**Visual impact:** none; the applied font request and typography are unchanged.

**Measured impact:** one request and about 730 bytes removed per clean load. No LCP/FCP gain is attributed to this pass.

## 5. Why the Optimizations Work

- **CPU/main thread:** fewer RAF callback dispatches, no per-pointer React reconciliation, less observer bookkeeping, and smaller theme-update React trees reduce scheduling and script work.
- **Rendering pipeline:** transforms remain compositor-friendly, but the implementation does not claim that every transition avoids paint. Theme changes still require substantial style/paint work.
- **GPU:** draw calls, triangle count, shader/material appearance, textures, framebuffer count, resolution, antialiasing, and post-processing are unchanged. The optimization removes CPU-side scheduling around the scene rather than making the scene visually cheaper.
- **Network:** the duplicate font request is removed. The model and texture payload deliberately remain unchanged because a fidelity-preserving compressed replacement was not validated.
- **Memory/resources:** 60-second and return-to-scene tests consistently ended with 6 active buffers, 23 textures, 7 programs, 20 framebuffers, 6 renderbuffers, and 7 VAOs. Counts did not grow across cycles.

## 6. Animation and Visual Verification

Eleven post-build captures cover desktop 1920x1080, laptop 1366x768, and mobile 390x844: hero at 3 and 5 seconds, desktop/laptop hover, and project scroll states. They were manually compared with the corresponding baseline captures.

| Gate | Result | Evidence |
| --- | --- | --- |
| Desktop static/layout | PASS | hero, hover, and project captures |
| Laptop static/layout | PASS | hero, hover, and project captures |
| Responsive/mobile | PASS | hero at two timestamps and project state |
| 3D model/material/lighting | PASS | same GLB/texture, 20 calls, 1,000,017 triangles, matching captures |
| Model and camera motion | PASS | multiple timestamps and scripted scroll/return; source transforms unchanged |
| Cursor hover | PASS | desktop and laptop hover captures; timing/easing constants unchanged |
| Navigation/scroll effects | PASS | automated full-page scroll and return scenarios |
| Animation timing/easing | PASS | all existing values retained; no FPS cap introduced |

An automated pixel-difference threshold is intentionally not reported. The star field, continuously moving 3D model, WebGL antialiasing, and capture/load timing make same-timestamp screenshots nondeterministic enough that a raw pixel percentage would be misleading. Differences were investigated manually, and motion equivalence was additionally verified from unchanged timing, easing, camera, pose, shader, material, and post-processing code. No benchmark-only production code remains.

## 7. Low-End Laptop Results

GPU throttling is unavailable in Chrome DevTools Protocol, so these are real CPU-throttled results on the same NVIDIA/ANGLE D3D11 hardware. They approximate a weak CPU, not an integrated GPU; no GPU-throttled number is fabricated.

### Five-run 6x clean navigation

| Metric | Baseline | Optimized | Change |
| --- | ---: | ---: | ---: |
| LCP | 2,103.2 ms | 1,974.4 ms | -6.1% |
| FCP | 795.2 ms | 760.0 ms | -4.4% |
| TBT | 1,204.0 ms | 1,051.4 ms | -12.7% |
| Longest task | 480.0 ms | 394.8 ms | -17.7% |
| Average FPS | 103.40 | 99.48 | -3.8% |
| p95 / p99 | 11.76 / 21.74 ms | 16.62 / 26.66 ms | worse |
| Janky frames | 0.726% | 0.642% | -11.6% |

### Five-run 6x theme-toggle stress

| Metric | Baseline | Optimized | Change |
| --- | ---: | ---: | ---: |
| Script time | 3,532 ms | 2,886 ms | -18.3% |
| INP | 363.2 ms | 283.2 ms | -22.0% |
| TBT | 7,918 ms | 6,833 ms | -13.7% |
| p95 / p99 | 164.98 / 265.00 ms | 145.06 / 191.66 ms | -12.1% / -27.7% |
| Average FPS | 31.80 | 28.27 | -11.1% |
| Janky frames | 15.51% | 19.16% | worse |

### Ordered 60-second sustained session

| CPU | Baseline FPS | Optimized FPS | Baseline p95/p99 | Optimized p95/p99 | Result |
| --- | ---: | ---: | ---: | ---: | --- |
| 1x | 119.33 | 119.58 | 8.4 / 8.5 ms | 8.4 / 8.5 ms | Equivalent |
| 4x | 109.60 | 99.76 | 16.7 / 16.8 ms | 16.8 / 25.1 ms | Worse |
| 6x | 73.65 | 57.86 | 25.0 / 33.4 ms | 33.3 / 49.9 ms | Worse |

The sustained test is deliberately reported even though it regressed. It was one run per throttle level, baseline and optimized were captured on different ordered sessions, and thermal/GPU state visibly affected later runs. The direction cannot be attributed solely to source changes: optimized 6x script time improved 5.8% and RAF callbacks fell 43.9%, while style time grew 11.0%. The safe conclusion is that unnecessary JavaScript work was reduced, but the preserved scene plus theme/style workload still fails the desired smoothness margin in prolonged 6x conditions.

## 8. Remaining Bottlenecks

1. **The unchanged 3D workload:** one million triangles every rendered frame, 23 textures, 20 framebuffers, and continuous post-processing remain expensive on weak GPUs.
2. **Theme paint/style work:** the intentionally global animated theme is the worst low-end interaction. Removing or shortening it would violate the acceptance constraint.
3. **Model transfer:** the 10.49 MB GLB dominates initial bytes; its embedded texture is 3.20 MB. No replacement was accepted without equivalence proof.
4. **JavaScript payload:** WebGL is 258.67 kB gzip and Motion is 40.83 kB gzip. Cursor MotionValues increased initial JS transfer by about 2.0 kB relative to baseline while reducing runtime script work.
5. **No real weak-GPU validation:** CPU throttling cannot simulate integrated-GPU bandwidth, fill rate, or driver overhead. Testing on the target lower-spec laptop remains the best next validation step.

## 9. Files Changed

Production changes made by this pass:

- `src/components/AvatarCanvas.jsx` - merged three wrapper RAF loops while preserving math/order.
- `src/components/CustomCursor.jsx` - replaced per-mouse React state with stable MotionValues/listeners.
- `src/App.jsx` - consolidated section observers, removed unused scroll tracking, memoized static content.
- `src/index.css` - retained cursor compositing hints and ring transition behavior for the new stable cursor path.
- `index.html` - removed the mismatched font stylesheet preload.
- `package.json` - added reusable performance and visual-capture commands.

Audit infrastructure and documentation:

- `scripts/performance/benchmark.mjs`
- `scripts/performance/browser-instrumentation.js`
- `scripts/performance/cdp-client.mjs`
- `scripts/performance/capture-visuals.mjs`
- `scripts/performance/README.md`
- `PERFORMANCE_BASELINE.md`
- `PERFORMANCE_OPTIMIZATION_LOG.md`
- `PERFORMANCE_FINAL_REPORT.md`
- `performance/results/` and `performance/artifacts/`

Pre-existing user modifications and model experiments were preserved. `public/stars.json` was already modified before this pass and was refreshed by the repository's required prebuild task; it is not counted as a performance optimization.

## 10. Artifacts and Acceptance Gates

- Baseline: `PERFORMANCE_BASELINE.md`
- Per-pass log: `PERFORMANCE_OPTIMIZATION_LOG.md`
- Final report: `PERFORMANCE_FINAL_REPORT.md`
- Harness instructions: `scripts/performance/README.md`
- Baseline raw data: `performance/results/baseline*` and `performance/results/lighthouse-baseline`
- Final raw data: `performance/results/final-retained-valid`, `final-retained-initial-valid`, `final-retained-clicks-valid`, `final-retained-sustained-valid`, `final-desktop-valid`, and `lighthouse-final-retained`
- Visual baseline: `performance/artifacts/baseline`
- Final visual evidence: `performance/artifacts/final-verified-postbuild`

| Acceptance gate | Result |
| --- | --- |
| Production build | PASS (`vite build`, 2,482 modules) |
| New build errors | PASS |
| Navigation / responsive layout / interactive elements | PASS |
| 3D interaction and return lifecycle | PASS |
| Animations / transitions / timing / hover / scroll preserved | PASS |
| Desktop / laptop / mobile / 3D visual comparison | PASS (manual + source invariants) |
| Measurable bottleneck improvement | PASS for RAF, script, p95/p99 theme tails, INP, TBT, LCP/FCP |
| Universal low-end FPS improvement | FAIL; prolonged 4x/6x and theme average FPS remain worse |
| GPU-throttled result | N/A; unsupported by the test setup |

## Reproduction

```powershell
npm run build
npm run preview -- --host 127.0.0.1
npm run perf:benchmark -- --label local --runs 5 --duration 20 --warmup 8 --cpu 1,4,6 --viewport 1366x768 --scenarios initial,idle,scroll,interaction,return
npm run perf:benchmark -- --label sustained --runs 1 --duration 60 --warmup 8 --cpu 1,4,6 --viewport 1366x768 --scenarios sustained
npm run perf:visual -- local
```

Environment: Chrome 152.0.7977.83, Windows, ANGLE D3D11 on NVIDIA GeForce RTX 5070 Ti Laptop GPU, device scale factor 1. CPU slowdown was applied with CDP. GPU slowdown was not available.
