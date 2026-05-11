import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Vite empties this folder on each build; default is `dist`.
    outDir: 'dist',
    emptyOutDir: true,
  },
  css: {
    modules: {
      // Preserve original kebab-case class names so existing CSS rules
      // (e.g. .zz-row__copy) survive the move into *.module.css files.
      localsConvention: 'dashes',
    },
  },
});
