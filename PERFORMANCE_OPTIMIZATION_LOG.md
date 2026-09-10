# Performance Optimization Log

All comparisons use the locally served production build. Unless noted, figures are five-run means at 1366x768 with real 6x DevTools CPU slowdown and 20-second scenarios.

| ID | Change | Why | Before | After | Improvement | Visual Risk | Validation |
| --- | --- | --- | ---: | ---: | ---: | --- | --- |
| OPT-01 | Consolidate three avatar-wrapper RAF loops into one | Avoid duplicate display-callback scheduling while keeping the same formulas/order | Idle RAF 708.8/s; busy 15,007 ms; p99 15.00 ms | Idle RAF 472.6/s; busy 14,670 ms; p99 11.84 ms | RAF -33.3%; busy -2.2%; p99 -21.1% | Low | PASS |
| OPT-02 | Move cursor coordinates from React state to Framer MotionValues | Avoid whole-component React reconciliation while preserving Framer tween semantics | FPS 82.90; script 6,630 ms | FPS 84.00; script 5,994 ms | Script -9.6%; FPS +1.3% (directional) | Low | PASS |
| OPT-03 | Consolidate section observation and remove unused scroll tracking | Five observers and a scroll listener maintained data that had one consumer or no consumer | FPS 112.33 scroll / 110.06 return | FPS 107.97 scroll / 104.37 return | No attributable speedup; retained for less redundant work | Low | PASS |
| OPT-04 | Memoize the static page-content tree | Theme and active-section updates reconciled every section and card | FPS 29.89; p99 256.62 ms; script 3,434 ms; INP 366.4 ms | FPS 31.51; p99 213.36 ms; script 2,989 ms; INP 273.6 ms | FPS +5.4%; p99 -16.9%; script -13.0%; INP -25.3% | Low | PASS |
| OPT-05 | Remove mismatched font stylesheet preload | The hint fetched a Space Grotesk-only stylesheet in addition to the real combined stylesheet | 13.2 requests; 10,966,382 B transferred | 12.2 requests; 10,965,652 B transferred | One request and ~730 B removed per clean load | None | PASS |

## OPT-01 - Avatar animation scheduling

**Before**

`FullscreenAvatarCanvasInner` owned three separate infinite `requestAnimationFrame` callbacks: pointer smoothing, scroll-velocity decay, and ambient grid/glow transforms.

**Why it was expensive**

Each loop woke the main thread independently on the same display cadence. Together with React Three Fiber and Framer Motion, the baseline executed about six RAF callbacks per 120 Hz refresh.

**After**

`src/components/AvatarCanvas.jsx` now updates pointer smoothing, scroll decay, and ambient transforms in one display callback. Event listeners, smoothing factor (`0.08`), decay factor (`0.9`), transform formulas, update order, and frame cadence are unchanged.

**Why it is faster**

The browser schedules two fewer callbacks per refresh, reducing callback dispatch/closure overhead and contention when input and scrolling are active.

**Visual impact**

None observed. The model, texture, camera, section poses, springs, materials, shader, DPR, antialiasing, bloom, chromatic aberration, tone mapping, CSS transforms, and all timing constants are unchanged. WebGL output remains 20 draw calls and 1,000,017 triangles per rendered frame.

**Measured impact**

- Idle RAF callbacks: 708.8/s -> 472.6/s (-33.3%).
- Idle main-thread busy time: 15,007 -> 14,670 ms (-2.2%).
- Idle p99 frame time: 15.00 -> 11.84 ms (-21.1%).
- Return-to-3D busy time: 16,068 -> 15,737 ms (-2.1%).
- Return-to-3D p95: 14.98 -> 11.76 ms (-21.5%).
- Pointer FPS: 82.70 -> 85.22 (+3.0%), but thermal variance worsened the aggregate p95; no p95 improvement is attributed to OPT-01.
- Scroll busy time was effectively unchanged (16,381 -> 16,381 ms); no scroll CPU improvement is claimed.

Raw results: `performance/results/opt-01/1366x768/`.

## OPT-02 - Custom cursor rendering path

**Before**

Every `mousemove` wrote a fresh `{x, y}` object into React state. React then reconciled `CustomCursor`, and Framer Motion retargeted two animations. Visibility and hover flags also lived in state, while the effect depended on visibility and consequently reattached all four event listeners after the first movement.

**Why it was expensive**

The benchmark generated pointer input at display cadence. Under 6x slowdown the baseline spent 6.63 seconds scripting in a 20-second scenario and p95 frames exceeded the 16.7 ms 60 Hz budget.

**After**

`src/components/CustomCursor.jsx` now keeps position, opacity, and scale in stable Framer `MotionValue` objects. Pointer and hover events retarget those values directly with the original 100 ms linear dot tween and 150 ms ease-out ring tween. React no longer receives per-pointer state updates, and the listeners remain attached once. Hover detection, offsets, sizes, colors, blend mode, and transition values are unchanged.

**Why it is faster**

Pointer events no longer allocate React state objects, schedule React renders, or reconcile the cursor component. Framer still owns interpolation and composited transforms, preserving its original scheduling behavior.

**Visual impact**

The cursor still appears on mouse entry, follows at the same offsets and durations, hides the dot and scales/fills the ring over links/buttons/clickable cards, and retains `mix-blend-difference`. Touch behavior is unchanged.

**Measured impact**

- Average FPS: 82.90 -> 84.00 (+1.3%; directional, not treated as a strong frame-rate claim).
- p95 frame time: 20.06 -> 20.10 ms (neutral).
- Main-thread busy time: 19,580 -> 19,522 ms (-0.3%).
- Script time: 6,630 -> 5,994 ms (-9.6%).
- Style recalculation: 3,434 -> 3,696 ms (+7.6%, worse).

This comparison uses five separate Chrome processes on each side. Raw results: `performance/results/opt-01-isolated-*/` and `performance/results/opt-02-isolated-*/`.

## OPT-03 - Scroll-section bookkeeping

**Before**

`useScrollSection` created one `IntersectionObserver` per section plus a passive `scroll` listener that continually calculated a `scrollProgress` ref never read anywhere.

**Why it was expensive**

The browser performed duplicate observer delivery/bookkeeping and one unnecessary division and DOM scroll-height read for each scroll event.

**After**

One observer now watches all five sections and keys the existing ratio map by `entry.target.id`; the dead scroll-progress listener and ref were removed. Thresholds, root margin, ratio selection, and the 0.12 activation gate are identical.

**Measured impact**

The five-run aggregate did not beat the earlier run set (scroll FPS 112.33 -> 107.97; return FPS 110.06 -> 104.37), with broad heat/order variance. This is recorded as a neutral redundancy removal, not a performance win. Raw results: `performance/results/opt-03/1366x768/`.

## OPT-04 - Static content reconciliation

**Before**

Every theme toggle and active-section update re-executed the entire page-content JSX tree, including all experience cards, project cards, expertise content, and footer.

**Why it was expensive**

Those components do not consume theme or active-section props, yet their React elements were rebuilt during already-expensive theme transitions and while scrolling between sections.

**After**

The static `<main>` subtree is wrapped in `React.memo` and receives only `stars`. Fixed UI layers still receive theme/current-section updates, while CSS custom properties continue to repaint the memoized content exactly as before.

**Measured impact**

Across five 6x theme-toggle runs: FPS 29.89 -> 31.51 (+5.4%), p99 256.62 -> 213.36 ms (-16.9%), script 3,434 -> 2,989 ms (-13.0%), TBT 8,042 -> 7,517 ms (-6.5%), and INP 366.4 -> 273.6 ms (-25.3%). Raw results: `performance/results/opt-03-click-control/` and `performance/results/opt-04-memo/`.

## OPT-05 - Font request cleanup

**Before**

`index.html` preloaded a Space Grotesk-only Google Fonts stylesheet but applied a different combined Inter/Space Grotesk/JetBrains Mono stylesheet. The preload could not satisfy the actual stylesheet request.

**After**

The mismatched preload is gone. Both preconnects and the exact stylesheet used by the page remain.

**Measured impact**

Five clean 6x navigations reduced the mean request count from 13.2 to 12.2 and transfer by about 730 bytes. FCP/LCP moved within thermal variance and no load-time improvement is claimed. Raw results: `performance/results/baseline-initial/` and `performance/results/opt-05-font-preload/`.

## Rejected experiment

Caching pose colors and fixed camera trigonometry in the WebGL loop was built and measured over five throttled idle runs. It did not produce a repeatable improvement and increased the Avatar chunk by about 70 gzip bytes, so it was reverted. Raw evidence remains in `performance/results/opt-05-webgl-loop/`.

Two more cursor implementations were rejected after sustained-session testing. Native CSS individual transforms produced excellent isolated pointer numbers but repeatedly retargeted compositor transitions poorly during simultaneous scroll+pointer input. A manual RAF tween preserved durations but showed the same sustained weakness. The retained MotionValue implementation uses Framer's original interpolation path and limits the change to removing React reconciliation. Evidence remains under `performance/results/opt-02-css-isolated-*`, `performance/results/opt-02-*-sustained/`, and `performance/results/diagnostic-touch-sustained/`.

## Final retained-build validation

The final implementation was rebuilt and measured again rather than relying only on the incremental pass results.

- Five 1366x768 clean navigations at 1x/4x/6x: `performance/results/final-retained-initial-valid/`.
- Five 1366x768 idle/scroll/interaction/return runs at 4x/6x: `performance/results/final-retained-valid/`.
- Five 1366x768 theme-toggle runs at 6x: `performance/results/final-retained-clicks-valid/`.
- One 60-second sustained run at 1x/4x/6x: `performance/results/final-retained-sustained-valid/`.
- Five 1920x1080 idle/scroll/interaction/return runs at 1x: `performance/results/final-desktop-valid/`.
- Five warning-free Lighthouse reports: `performance/results/lighthouse-final-retained/`.
- Eleven post-build visual captures: `performance/artifacts/final-verified-postbuild/`.

At 1920x1080/1x, all four runtime scenarios held 119.87-119.98 FPS with 8.5 ms p95 frame time and zero janky frames across five-run means. Relative to baseline, main-thread busy time improved 2.8% idle, 3.1% scroll, 7.5% interaction, and 5.1% after returning to the 3D scene. RAF callback rates fell by roughly one third while WebGL output stayed exactly 20 calls and 1,000,017 triangles per frame.

The low-end result is mixed and must not be summarized as a universal FPS win. In the final 6x clean-navigation set, LCP improved 6.1%, FCP 4.4%, TBT 12.7%, longest task 17.7%, and janky-frame percentage 11.6%, while average FPS, p95, and p99 were worse. In the final 6x theme stress set, script improved 18.3%, INP 22.0%, TBT 13.7%, p95 12.1%, and p99 27.7%, while average FPS and jank were worse because preserved style/paint work remained dominant. The ordered 4x/6x sustained results also regressed; see `PERFORMANCE_FINAL_REPORT.md` for the complete numbers and thermal/order caveat.

An earlier `final-retained-throttled` set contained only 54 DOM nodes and no WebGL samples because the local preview server had stopped. It is explicitly invalid and excluded from every comparison. The valid final sets above contain 641-693 DOM nodes and exactly the expected WebGL telemetry.
