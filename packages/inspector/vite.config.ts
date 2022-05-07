import { defineConfig } from 'vite';
import webExtension from 'vite-plugin-web-extension';
import { join } from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: join(__dirname, 'dist'),
  },
  plugins: [
    webExtension({
      manifest: 'src/manifest.template.json',
      assets: 'assets',
      additionalInputs: ['inspector.html'],
      browser: process.env.TARGET,
    }),
  ],
});
