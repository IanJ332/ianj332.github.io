import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchChrome, sleep } from './cdp-client.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '../..');
const instrumentationSource = await readFile(path.join(scriptDirectory, 'browser-instrumentation.js'), 'utf8');

const defaults = {
    url: 'http://127.0.0.1:4173/',
    label: 'local',
    runs: 1,
    duration: 20_000,
    warmup: 5_000,
    cpu: [1],
    viewport: { width: 1366, height: 768 },
    scenarios: ['initial', 'idle', 'scroll', 'interaction', 'return'],
    chrome: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    touch: false,
};

const parseArgs = () => {
    const args = process.argv.slice(2);
    const options = structuredClone(defaults);
    for (let index = 0; index < args.length; index += 1) {
        const argument = args[index];
        const next = args[index + 1];
        if (argument === '--url') options.url = next;
        else if (argument === '--label') options.label = next;
        else if (argument === '--runs') options.runs = Number(next);
        else if (argument === '--duration') options.duration = Number(next) * 1000;
        else if (argument === '--warmup') options.warmup = Number(next) * 1000;
        else if (argument === '--cpu') options.cpu = next.split(',').map(Number);
        else if (argument === '--viewport') {
            const [width, height] = next.split('x').map(Number);
            options.viewport = { width, height };
        } else if (argument === '--scenarios') options.scenarios = next.split(',');
        else if (argument === '--chrome') options.chrome = next;
        else if (argument === '--touch') {
            options.touch = true;
            continue;
        }
        else continue;
        index += 1;
    }
    return options;
};

const quantile = (values, percentile) => {
    if (!values.length) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(percentile * sorted.length) - 1));
    return sorted[index];
};

const average = (values) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null);

const summarizeFrames = (frameTimes) => {
    const valid = frameTimes.filter((value) => value > 0 && value < 1000);
    const mean = average(valid);
    const p99 = quantile(valid, 0.99);
    const countAbove = (threshold) => valid.filter((value) => value > threshold).length;
    return {
        samples: valid.length,
        averageFps: mean ? 1000 / mean : null,
        onePercentLowFps: p99 ? 1000 / p99 : null,
        frameTimeAverageMs: mean,
        frameTimeMedianMs: quantile(valid, 0.5),
        frameTimeP95Ms: quantile(valid, 0.95),
        frameTimeP99Ms: p99,
        framesOver16_7Ms: countAbove(16.7),
        framesOver33_3Ms: countAbove(33.3),
        framesOver50Ms: countAbove(50),
        framesOver16_7Percent: valid.length ? (countAbove(16.7) / valid.length) * 100 : null,
        jankyFramesPercent: valid.length ? (countAbove(33.3) / valid.length) * 100 : null,
    };
};

const summarizeLongTasks = (longTasks) => ({
    count: longTasks.length,
    longestMs: longTasks.length ? Math.max(...longTasks.map((task) => task.duration)) : 0,
    totalMs: longTasks.reduce((sum, task) => sum + task.duration, 0),
    totalBlockingTimeMs: longTasks.reduce((sum, task) => sum + Math.max(0, task.duration - 50), 0),
});

const summarizeDrawFrames = (frames) => {
    const rendered = frames.filter((frame) => frame.calls > 0);
    return {
        sampledDisplayFrames: frames.length,
        renderedFrames: rendered.length,
        callsAverage: average(rendered.map((frame) => frame.calls)),
        callsP95: quantile(rendered.map((frame) => frame.calls), 0.95),
        trianglesAverage: average(rendered.map((frame) => frame.triangles)),
        trianglesP95: quantile(rendered.map((frame) => frame.triangles), 0.95),
        pointsAverage: average(rendered.map((frame) => frame.points)),
        linesAverage: average(rendered.map((frame) => frame.lines)),
    };
};

const metricMap = (metrics) => Object.fromEntries(metrics.map(({ name, value }) => [name, value]));

const metricDiff = (before, after) => {
    const names = [
        'TaskDuration',
        'ScriptDuration',
        'LayoutDuration',
        'RecalcStyleDuration',
        'V8CompileDuration',
        'JSHeapUsedSize',
        'JSHeapTotalSize',
        'Nodes',
        'Documents',
        'Frames',
        'LayoutCount',
        'RecalcStyleCount',
    ];
    return Object.fromEntries(
        names.map((name) => [name, name.includes('Duration') ? (after[name] - before[name]) * 1000 : after[name] - before[name]])
    );
};

const evaluate = async (client, expression, awaitPromise = false) => {
    const result = await client.send('Runtime.evaluate', {
        expression,
        awaitPromise,
        returnByValue: true,
        userGesture: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Runtime evaluation failed');
    return result.result.value;
};

const collectPageTiming = (client) =>
    evaluate(
        client,
        `(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const resources = performance.getEntriesByType('resource');
            const paint = Object.fromEntries(performance.getEntriesByType('paint').map(entry => [entry.name, entry.startTime]));
            return {
                navigation: navigation ? {
                    ttfbMs: navigation.responseStart,
                    domContentLoadedMs: navigation.domContentLoadedEventEnd,
                    loadMs: navigation.loadEventEnd,
                    transferSize: navigation.transferSize,
                    encodedBodySize: navigation.encodedBodySize,
                    decodedBodySize: navigation.decodedBodySize,
                } : null,
                paint,
                resources: resources.map(entry => ({
                    name: entry.name,
                    initiatorType: entry.initiatorType,
                    transferSize: entry.transferSize,
                    encodedBodySize: entry.encodedBodySize,
                    decodedBodySize: entry.decodedBodySize,
                    duration: entry.duration,
                })),
            };
        })()`
    );

const resourceCategory = (resource) => {
    const url = resource.name.toLowerCase();
    if (resource.initiatorType === 'script' || /\.m?js(?:\?|$)/.test(url)) return 'javascript';
    if (/\.css(?:\?|$)/.test(url)) return 'css';
    if (/\.(?:woff2?|ttf|otf)(?:\?|$)/.test(url)) return 'font';
    if (/\.(?:glb|gltf|bin)(?:\?|$)/.test(url)) return 'model';
    if (/\.(?:png|jpe?g|webp|avif|gif|svg)(?:\?|$)/.test(url)) return 'image';
    if (/\.(?:hdr|ktx2?|basis)(?:\?|$)/.test(url)) return 'texture';
    return 'other';
};

const summarizeResources = (timing) => {
    const totals = {};
    for (const resource of timing.resources) {
        const category = resourceCategory(resource);
        if (!totals[category]) totals[category] = { requests: 0, transferred: 0, encoded: 0, decoded: 0 };
        totals[category].requests += 1;
        totals[category].transferred += resource.transferSize || 0;
        totals[category].encoded += resource.encodedBodySize || 0;
        totals[category].decoded += resource.decodedBodySize || 0;
    }
    return {
        requestCount: timing.resources.length + 1,
        transferredBytes: timing.resources.reduce((sum, resource) => sum + (resource.transferSize || 0), timing.navigation?.transferSize || 0),
        encodedBytes: timing.resources.reduce((sum, resource) => sum + (resource.encodedBodySize || 0), timing.navigation?.encodedBodySize || 0),
        decodedBytes: timing.resources.reduce((sum, resource) => sum + (resource.decodedBodySize || 0), timing.navigation?.decodedBodySize || 0),
        categories: totals,
        largest: [...timing.resources].sort((a, b) => b.decodedBodySize - a.decodedBodySize).slice(0, 12),
    };
};

const snapshotScenario = async (client, label, action) => {
    await evaluate(client, `window.__portfolioPerfReset(${JSON.stringify(label)})`);
    const before = metricMap((await client.send('Performance.getMetrics')).metrics);
    await action();
    const after = metricMap((await client.send('Performance.getMetrics')).metrics);
    const raw = await evaluate(client, 'window.__portfolioPerfSnapshot()');
    return formatScenarioResult(label, raw, before, after);
};

const formatScenarioResult = (label, raw, before, after) => {
    const inpCandidates = raw.eventTimings.filter((entry) => entry.interactionId > 0);
    return {
        label,
        frames: summarizeFrames(raw.frameTimes),
        longTasks: summarizeLongTasks(raw.longTasks),
        webVitals: {
            lcpMs: raw.lcp?.startTime ?? null,
            cls: raw.layoutShift,
            inpMs: inpCandidates.length ? Math.max(...inpCandidates.map((entry) => entry.duration)) : null,
        },
        mainThread: metricDiff(before, after),
        webgl: {
            ...summarizeDrawFrames(raw.drawFrames),
            resources: raw.resources,
            canvases: raw.canvases,
            gpu: raw.gpu,
        },
        raf: {
            requests: raw.rafRequests,
            callbacks: raw.rafCallbacks,
            callbacksPerSecond: raw.duration ? raw.rafCallbacks / (raw.duration / 1000) : null,
        },
        memory: {
            jsHeapUsedBytes: after.JSHeapUsedSize,
            jsHeapTotalBytes: after.JSHeapTotalSize,
            domNodes: raw.domNodes,
            documents: after.Documents,
        },
        listeners: raw.listeners,
        durationMs: raw.duration,
        finalScrollY: raw.scrollY,
        scrollHeight: raw.scrollHeight,
    };
};

const navigateFresh = async (client, url, cacheDisabled) => {
    await client.send('Network.setCacheDisabled', { cacheDisabled });
    const loaded = client.once('Page.loadEventFired', 30_000);
    await client.send('Page.navigate', { url: `${url}${url.includes('?') ? '&' : '?'}run=${Date.now()}` });
    await loaded;
};

const scrollAction = (client, durationMs, cycles = 1) =>
    evaluate(
        client,
        `(async () => {
            const duration = ${durationMs};
            const cycles = ${cycles};
            const maximum = document.documentElement.scrollHeight - innerHeight;
            const startedAt = performance.now();
            await new Promise(resolve => {
                const tick = now => {
                    const overall = Math.min(1, (now - startedAt) / duration);
                    const phase = overall * cycles;
                    const cycleProgress = phase - Math.floor(phase);
                    const cycleIndex = Math.min(cycles - 1, Math.floor(phase));
                    const downward = cycleIndex % 2 === 0;
                    const progress = downward ? cycleProgress : 1 - cycleProgress;
                    window.scrollTo({ top: maximum * (overall === 1 ? (cycles % 2) : progress), behavior: 'instant' });
                    if (overall < 1) requestAnimationFrame(tick); else resolve();
                };
                requestAnimationFrame(tick);
            });
        })()`,
        true
    );

const pointerAction = async (client, durationMs, width, height) => {
    const startedAt = performance.now();
    while (performance.now() - startedAt < durationMs) {
        const elapsed = performance.now() - startedAt;
        const x = width * (0.5 + Math.sin(elapsed / 730) * 0.38);
        const y = height * (0.48 + Math.cos(elapsed / 910) * 0.36);
        await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, modifiers: 0 });
        await sleep(16);
    }
};

const clickAction = async (client, durationMs) => {
    const rect = await evaluate(
        client,
        `(() => {
            const button = document.querySelector('button[aria-label^="Switch to"]');
            if (!button) return null;
            const box = button.getBoundingClientRect();
            return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
        })()`
    );
    if (!rect) throw new Error('Theme toggle was not found');
    const startedAt = performance.now();
    while (performance.now() - startedAt < durationMs) {
        await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: rect.x, y: rect.y });
        await client.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: rect.x, y: rect.y, button: 'left', clickCount: 1 });
        await client.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: rect.x, y: rect.y, button: 'left', clickCount: 1 });
        await sleep(1_000);
    }
};

const sustainedAction = async (client, durationMs, width, height) => {
    const scrollPromise = scrollAction(client, durationMs, 4);
    const pointerPromise = pointerAction(client, durationMs, width, height);
    await Promise.all([scrollPromise, pointerPromise]);
};

const runScenario = async (client, scenario, options) => {
    if (scenario === 'initial') {
        await navigateFresh(client, options.url, true);
        await sleep(options.duration);
        const after = metricMap((await client.send('Performance.getMetrics')).metrics);
        // Chrome resets Performance-domain cumulative counters on navigation,
        // so the new document starts at zero. Subtracting about:blank or the
        // previous document would produce invalid negative durations.
        const before = Object.fromEntries(Object.keys(after).map((name) => [name, 0]));
        const raw = await evaluate(client, 'window.__portfolioPerfSnapshot()');
        const result = formatScenarioResult(scenario, raw, before, after);
        const timing = await collectPageTiming(client);
        result.navigation = timing.navigation;
        result.paint = timing.paint;
        result.resources = summarizeResources(timing);
        result.webVitals.fcpMs = timing.paint['first-contentful-paint'] ?? null;
        return result;
    }

    await navigateFresh(client, options.url, scenario === 'initial');
    await sleep(options.warmup);

    if (scenario === 'idle') {
        const result = await snapshotScenario(client, scenario, () => sleep(options.duration));
        result.webVitals.lcpMs = null;
        return result;
    }
    if (scenario === 'scroll') {
        const result = await snapshotScenario(client, scenario, () => scrollAction(client, options.duration, 1));
        result.webVitals.lcpMs = null;
        return result;
    }
    if (scenario === 'interaction') {
        const result = await snapshotScenario(client, scenario, () => pointerAction(client, options.duration, options.viewport.width, options.viewport.height));
        result.webVitals.lcpMs = null;
        return result;
    }
    if (scenario === 'clicks') {
        const result = await snapshotScenario(client, scenario, () => clickAction(client, options.duration));
        result.webVitals.lcpMs = null;
        return result;
    }
    if (scenario === 'return') {
        const result = await snapshotScenario(client, scenario, () => scrollAction(client, options.duration, 4));
        result.webVitals.lcpMs = null;
        return result;
    }
    if (scenario === 'sustained') {
        const result = await snapshotScenario(client, scenario, () => sustainedAction(client, options.duration, options.viewport.width, options.viewport.height));
        result.webVitals.lcpMs = null;
        return result;
    }
    throw new Error(`Unknown scenario: ${scenario}`);
};

const meanOf = (records, selector) => {
    const values = records.map(selector).filter((value) => Number.isFinite(value));
    return average(values);
};

const aggregateScenario = (records) => ({
    runs: records.length,
    averageFps: meanOf(records, (record) => record.frames.averageFps),
    onePercentLowFps: meanOf(records, (record) => record.frames.onePercentLowFps),
    frameTimeAverageMs: meanOf(records, (record) => record.frames.frameTimeAverageMs),
    frameTimeP95Ms: meanOf(records, (record) => record.frames.frameTimeP95Ms),
    frameTimeP99Ms: meanOf(records, (record) => record.frames.frameTimeP99Ms),
    jankyFramesPercent: meanOf(records, (record) => record.frames.jankyFramesPercent),
    longTaskCount: meanOf(records, (record) => record.longTasks.count),
    longestLongTaskMs: meanOf(records, (record) => record.longTasks.longestMs),
    totalLongTaskMs: meanOf(records, (record) => record.longTasks.totalMs),
    totalBlockingTimeMs: meanOf(records, (record) => record.longTasks.totalBlockingTimeMs),
    mainThreadBusyMs: meanOf(records, (record) => record.mainThread.TaskDuration),
    scriptMs: meanOf(records, (record) => record.mainThread.ScriptDuration),
    styleMs: meanOf(records, (record) => record.mainThread.RecalcStyleDuration),
    layoutMs: meanOf(records, (record) => record.mainThread.LayoutDuration),
    jsHeapUsedBytes: meanOf(records, (record) => record.memory.jsHeapUsedBytes),
    domNodes: meanOf(records, (record) => record.memory.domNodes),
    rafCallbacksPerSecond: meanOf(records, (record) => record.raf.callbacksPerSecond),
    drawCallsPerRenderedFrame: meanOf(records, (record) => record.webgl.callsAverage),
    trianglesPerRenderedFrame: meanOf(records, (record) => record.webgl.trianglesAverage),
    lcpMs: meanOf(records, (record) => record.webVitals.lcpMs),
    fcpMs: meanOf(records, (record) => record.webVitals.fcpMs),
    cls: meanOf(records, (record) => record.webVitals.cls),
    inpMs: meanOf(records, (record) => record.webVitals.inpMs),
    transferredBytes: meanOf(records, (record) => record.resources?.transferredBytes),
    decodedBytes: meanOf(records, (record) => record.resources?.decodedBytes),
    requestCount: meanOf(records, (record) => record.resources?.requestCount),
    javascriptTransferredBytes: meanOf(records, (record) => record.resources?.categories?.javascript?.transferred),
    modelTransferredBytes: meanOf(records, (record) => record.resources?.categories?.model?.transferred),
    imageTransferredBytes: meanOf(records, (record) => record.resources?.categories?.image?.transferred),
    fontTransferredBytes: meanOf(records, (record) => record.resources?.categories?.font?.transferred),
});

const options = parseArgs();
const outputDirectory = path.join(
    repositoryRoot,
    'performance',
    'results',
    options.label,
    `${options.viewport.width}x${options.viewport.height}`
);
await mkdir(outputDirectory, { recursive: true });

const allResults = [];
for (const cpuRate of options.cpu) {
    const launched = await launchChrome({
        chromePath: options.chrome,
        width: options.viewport.width,
        height: options.viewport.height,
    });
    const { client } = launched;
    try {
        await Promise.all([
            client.send('Page.enable'),
            client.send('Runtime.enable'),
            client.send('Network.enable'),
            client.send('Performance.enable'),
        ]);
        await client.send('Emulation.setDeviceMetricsOverride', {
            width: options.viewport.width,
            height: options.viewport.height,
            deviceScaleFactor: 1,
            mobile: false,
        });
        await client.send('Emulation.setCPUThrottlingRate', { rate: cpuRate });
        if (options.touch) {
            await client.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
        }
        await client.send('Page.addScriptToEvaluateOnNewDocument', { source: instrumentationSource });

        for (let run = 1; run <= options.runs; run += 1) {
            for (const scenario of options.scenarios) {
                process.stdout.write(`[${options.label}] ${options.viewport.width}x${options.viewport.height} ${cpuRate}x run ${run}/${options.runs} ${scenario}... `);
                const result = await runScenario(client, scenario, options);
                const record = {
                    metadata: {
                        label: options.label,
                        capturedAt: new Date().toISOString(),
                        url: options.url,
                        viewport: options.viewport,
                        cpuSlowdown: cpuRate,
                        run,
                        chromePath: options.chrome,
                        durationMs: options.duration,
                        warmupMs: options.warmup,
                        touchEmulation: options.touch,
                    },
                    scenario: result,
                };
                allResults.push(record);
                await writeFile(
                    path.join(outputDirectory, `cpu-${cpuRate}x-run-${run}-${scenario}.json`),
                    `${JSON.stringify(record, null, 2)}\n`
                );
                process.stdout.write(`done (${result.frames.averageFps?.toFixed(2) ?? 'N/A'} FPS, p95 ${result.frames.frameTimeP95Ms?.toFixed(2) ?? 'N/A'} ms)\n`);
            }
        }
    } finally {
        await launched.close();
    }
}

const groups = {};
for (const record of allResults) {
    const key = `${record.metadata.cpuSlowdown}x/${record.scenario.label}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(record.scenario);
}
const summary = {
    metadata: {
        label: options.label,
        createdAt: new Date().toISOString(),
        url: options.url,
        viewport: options.viewport,
        runs: options.runs,
        durationMs: options.duration,
        warmupMs: options.warmup,
        cpuSlowdowns: options.cpu,
        scenarios: options.scenarios,
        gpuThrottling: 'Unavailable; no GPU slowdown was simulated.',
        jankDefinition: 'Frame interval >33.3 ms. Counts above 16.7/33.3/50 ms are also retained per run.',
    },
    scenarios: Object.fromEntries(Object.entries(groups).map(([key, records]) => [key, aggregateScenario(records)])),
};
await writeFile(path.join(outputDirectory, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
process.stdout.write(`Summary: ${path.join(outputDirectory, 'summary.json')}\n`);
