import { defineConfig } from 'vite';
import typescript from '@rollup/plugin-typescript';
import generateManifest from './build/generate-manifest';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {},
    },
  },
  plugins: [generateManifest(), typescript()],
});
