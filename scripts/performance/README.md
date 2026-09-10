# Performance harness

Build and serve the production site before running these commands:

```powershell
npm run build
npm run preview -- --host 127.0.0.1
```

Run the repeatable production scenarios at the laptop viewport:

```powershell
npm run perf:benchmark -- --label local --runs 5 --duration 20 --warmup 5 --cpu 1,4,6 --viewport 1366x768 --scenarios initial,idle,scroll,interaction,return
```

Capture desktop, laptop, and mobile visual states:

```powershell
npm run perf:visual -- local
```

The harness launches installed stable Chrome with a fresh temporary profile,
device scale factor 1, cache-disabled initial navigations, and real CDP CPU
throttling. Frame data comes from `requestAnimationFrame`; Long Tasks, layout
shifts, LCP, and interaction timing come from `PerformanceObserver`; browser
main-thread counters come from the CDP Performance domain. WebGL calls and
resource creation are instrumented before application scripts run.

GPU throttling is not available through this setup. The reports therefore keep
GPU-throttled metrics as N/A rather than inferring them from CPU throttling.
