import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site: 'https://rishabh2324.github.io/',
    vite: {
        // three.js lives in its own lazily-loaded chunk.
        build: { chunkSizeWarningLimit: 700 },
    },
});
