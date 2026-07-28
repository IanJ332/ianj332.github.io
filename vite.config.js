import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/',
    build: {
        // Keep the WebGL stack in its own long-lived chunk. React.lazy already
        // defers it off the critical path; naming it explicitly means a content
        // change in the portfolio copy doesn't bust the 850 kB three.js cache
        // entry, and vice versa.
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Vite's __vitePreload helper is shared between the entry
                    // and the lazy canvas chunk. Left to Rollup it gets folded
                    // into `webgl`, which makes the entry STATICALLY import
                    // 966 kB of three.js and puts a modulepreload for it in
                    // index.html — silently undoing the code-split.
                    if (id.includes('preload-helper')) return 'react';
                    if (!id.includes('node_modules')) return undefined;
                    if (
                        id.includes('/three/') ||
                        id.includes('@react-three') ||
                        id.includes('/postprocessing/')
                    ) {
                        return 'webgl';
                    }
                    if (id.includes('framer-motion') || id.includes('/motion-')) return 'motion';
                    if (id.includes('/react-dom/') || id.includes('/scheduler/')) return 'react';
                    return undefined;
                },
            },
        },
        // The `webgl` chunk is ~965 kB and that is by design: it is lazy, it is
        // never on the critical path, and it is content-hash stable. The limit
        // is raised so a real regression in the ENTRY chunk still warns.
        chunkSizeWarningLimit: 1000,
    },
    server: {
        host: '0.0.0.0',
        port: 3000,
        strictPort: false
    }
})
