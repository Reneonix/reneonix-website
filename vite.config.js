import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Warn only when a single chunk exceeds 800 kB (after splitting, none should)
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          // React runtime — tiny, always cached after first visit
          'vendor-react': ['react', 'react-dom'],
          // THREE.js is large; isolate it so the other chunks stay small
          'vendor-three': ['three'],
          // Lucide icon tree — needed on every page but separate from app logic
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
  css: {
    modules: {
      // Preserve original kebab-case class names so existing CSS rules survive
      localsConvention: 'dashes',
    },
  },
});
