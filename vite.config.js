import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

export default {
  root: fileURLToPath(new URL('./support-kb', import.meta.url)),
  resolve: {
    alias: { '#lib': fileURLToPath(new URL('./support-kb/src/lib', import.meta.url)) },
    conditions: ['svelte'],
  },
  plugins: [svelte({
    extensions: ['.svelte', '.svx'],
    preprocess: mdsvex({
      extensions: ['.svx'],
      layout: { runbook: fileURLToPath(new URL('./support-kb/src/lib/layouts/runbook.svelte', import.meta.url)) },
    }),
  })],
  build: {
    ssr: fileURLToPath(new URL('./scripts/render.js', import.meta.url)),
    outDir: fileURLToPath(new URL('./.build', import.meta.url)),
    ssrEmitAssets: true,
    cssCodeSplit: false,
    rollupOptions: { output: { entryFileNames: 'render.mjs' } },
  },
};
