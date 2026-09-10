(() => {
    const state = {
        active: false,
        label: 'startup',
        startedAt: 0,
        frameTimes: [],
        longTasks: [],
        layoutShift: 0,
        lcp: null,
        eventTimings: [],
        rafRequests: 0,
        rafCallbacks: 0,
        drawCalls: 0,
        triangles: 0,
        points: 0,
        lines: 0,
        drawFrames: [],
        resources: {
            buffers: { created: 0, deleted: 0 },
            textures: { created: 0, deleted: 0 },
            programs: { created: 0, deleted: 0 },
            framebuffers: { created: 0, deleted: 0 },
            renderbuffers: { created: 0, deleted: 0 },
            vertexArrays: { created: 0, deleted: 0 },
        },
        listeners: { added: {}, removed: {}, active: {} },
    };

    const increment = (record, key, amount = 1) => {
        record[key] = (record[key] || 0) + amount;
    };

    const originalRaf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback) => {
        if (state.active) state.rafRequests += 1;
        return originalRaf((timestamp) => {
            if (state.active) state.rafCallbacks += 1;
            callback(timestamp);
        });
    };

    const listenerRegistry = new WeakMap();
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.addEventListener = function addEventListener(type, listener, options) {
        let targetListeners = listenerRegistry.get(this);
        if (!targetListeners) {
            targetListeners = new Map();
            listenerRegistry.set(this, targetListeners);
        }
        let typeListeners = targetListeners.get(type);
        if (!typeListeners) {
            typeListeners = new Set();
            targetListeners.set(type, typeListeners);
        }
        if (!typeListeners.has(listener)) {
            typeListeners.add(listener);
            increment(state.listeners.added, type);
            increment(state.listeners.active, type);
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
    EventTarget.prototype.removeEventListener = function removeEventListener(type, listener, options) {
        const typeListeners = listenerRegistry.get(this)?.get(type);
        if (typeListeners?.delete(listener)) {
            increment(state.listeners.removed, type);
            increment(state.listeners.active, type, -1);
        }
        return originalRemoveEventListener.call(this, type, listener, options);
    };

    const primitiveCounts = (mode, count, instances = 1) => {
        if (mode === 4) return { triangles: Math.floor(count / 3) * instances };
        if (mode === 5 || mode === 6) return { triangles: Math.max(0, count - 2) * instances };
        if (mode === 0) return { points: count * instances };
        if (mode === 1) return { lines: Math.floor(count / 2) * instances };
        if (mode === 2) return { lines: count * instances };
        if (mode === 3) return { lines: Math.max(0, count - 1) * instances };
        return {};
    };

    const wrapWebGlPrototype = (prototype) => {
        if (!prototype || prototype.__portfolioPerfWrapped) return;
        Object.defineProperty(prototype, '__portfolioPerfWrapped', { value: true });

        for (const method of ['drawArrays', 'drawElements']) {
            const original = prototype[method];
            if (!original) continue;
            prototype[method] = function wrappedDraw(mode, firstOrCount, countOrType) {
                const count = method === 'drawArrays' ? countOrType : firstOrCount;
                if (state.active) {
                    state.drawCalls += 1;
                    const totals = primitiveCounts(mode, count);
                    state.triangles += totals.triangles || 0;
                    state.points += totals.points || 0;
                    state.lines += totals.lines || 0;
                }
                return original.apply(this, arguments);
            };
        }

        for (const method of ['drawArraysInstanced', 'drawElementsInstanced']) {
            const original = prototype[method];
            if (!original) continue;
            prototype[method] = function wrappedInstancedDraw(mode, firstOrCount, countOrType, typeOrOffset, offsetOrInstances, maybeInstances) {
                const count = method === 'drawArraysInstanced' ? countOrType : firstOrCount;
                const instances = method === 'drawArraysInstanced' ? offsetOrInstances : maybeInstances;
                if (state.active) {
                    state.drawCalls += 1;
                    const totals = primitiveCounts(mode, count, instances);
                    state.triangles += totals.triangles || 0;
                    state.points += totals.points || 0;
                    state.lines += totals.lines || 0;
                }
                return original.apply(this, arguments);
            };
        }

        const resources = [
            ['Buffer', 'buffers'],
            ['Texture', 'textures'],
            ['Program', 'programs'],
            ['Framebuffer', 'framebuffers'],
            ['Renderbuffer', 'renderbuffers'],
            ['VertexArray', 'vertexArrays'],
        ];
        for (const [suffix, key] of resources) {
            const create = prototype[`create${suffix}`];
            const remove = prototype[`delete${suffix}`];
            if (create) {
                prototype[`create${suffix}`] = function wrappedCreate() {
                    const value = create.apply(this, arguments);
                    state.resources[key].created += 1;
                    return value;
                };
            }
            if (remove) {
                prototype[`delete${suffix}`] = function wrappedDelete() {
                    state.resources[key].deleted += 1;
                    return remove.apply(this, arguments);
                };
            }
        }
    };

    wrapWebGlPrototype(window.WebGLRenderingContext?.prototype);
    wrapWebGlPrototype(window.WebGL2RenderingContext?.prototype);

    for (const [type, handler] of [
        ['longtask', (entry) => state.longTasks.push({ startTime: entry.startTime, duration: entry.duration })],
        ['layout-shift', (entry) => {
            if (!entry.hadRecentInput) state.layoutShift += entry.value;
        }],
        ['largest-contentful-paint', (entry) => {
            state.lcp = { startTime: entry.startTime, size: entry.size, element: entry.element?.tagName || null };
        }],
        ['event', (entry) => {
            if (entry.duration >= 16) {
                state.eventTimings.push({ name: entry.name, duration: entry.duration, interactionId: entry.interactionId });
            }
        }],
    ]) {
        try {
            const observer = new PerformanceObserver((list) => list.getEntries().forEach(handler));
            observer.observe(type === 'event' ? { type, buffered: true, durationThreshold: 16 } : { type, buffered: true });
        } catch {
            // Metrics unsupported by this browser remain explicitly unavailable.
        }
    }

    let previousFrameTime = null;
    const frameTick = (timestamp) => {
        if (state.active) {
            if (previousFrameTime !== null) state.frameTimes.push(timestamp - previousFrameTime);
            state.drawFrames.push({
                calls: state.drawCalls,
                triangles: state.triangles,
                points: state.points,
                lines: state.lines,
            });
            state.drawCalls = 0;
            state.triangles = 0;
            state.points = 0;
            state.lines = 0;
        }
        previousFrameTime = timestamp;
        window.requestAnimationFrame(frameTick);
    };
    window.requestAnimationFrame(frameTick);

    window.__portfolioPerfReset = (label) => {
        state.active = true;
        state.label = label;
        state.startedAt = performance.now();
        state.frameTimes = [];
        state.longTasks = [];
        state.layoutShift = 0;
        state.lcp = null;
        state.eventTimings = [];
        state.rafRequests = 0;
        state.rafCallbacks = 0;
        state.drawCalls = 0;
        state.triangles = 0;
        state.points = 0;
        state.lines = 0;
        state.drawFrames = [];
    };

    window.__portfolioPerfSnapshot = () => {
        state.active = false;
        const canvases = [...document.querySelectorAll('canvas')].map((canvas) => ({
            width: canvas.width,
            height: canvas.height,
            cssWidth: canvas.clientWidth,
            cssHeight: canvas.clientHeight,
        }));
        const canvas = document.querySelector('canvas');
        const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl');
        const debugRenderer = gl?.getExtension('WEBGL_debug_renderer_info');
        const gpu = gl
            ? {
                  vendor: gl.getParameter(debugRenderer?.UNMASKED_VENDOR_WEBGL || gl.VENDOR),
                  renderer: gl.getParameter(debugRenderer?.UNMASKED_RENDERER_WEBGL || gl.RENDERER),
                  version: gl.getParameter(gl.VERSION),
                  maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                  maxSamples: gl.getParameter(gl.MAX_SAMPLES),
              }
            : null;
        const resources = Object.fromEntries(
            Object.entries(state.resources).map(([key, value]) => [key, { ...value, active: value.created - value.deleted }])
        );
        return {
            label: state.label,
            duration: performance.now() - state.startedAt,
            frameTimes: [...state.frameTimes],
            longTasks: [...state.longTasks],
            layoutShift: state.layoutShift,
            lcp: state.lcp,
            eventTimings: [...state.eventTimings],
            rafRequests: state.rafRequests,
            rafCallbacks: state.rafCallbacks,
            drawFrames: [...state.drawFrames],
            resources,
            listeners: structuredClone(state.listeners),
            canvases,
            gpu,
            domNodes: document.getElementsByTagName('*').length,
            scrollY: window.scrollY,
            scrollHeight: document.documentElement.scrollHeight,
        };
    };

    window.__portfolioPerfReset('initial-load');
})();
