import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { copyPlugin } from './scripts/copy-plugin';

// GitHub Pages serves the repository's docs/ folder; relative base keeps every page working under /prometheus/.
export default defineConfig({
  base: './',
  plugins: [copyPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: { index: resolve(__dirname, 'index.html'), docs: resolve(__dirname, 'docs.html') },
    },
  },
});
