import Vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import WebExtension from 'vite-plugin-web-extension';
import pkg from './package.json';
import { generateManifest } from './scripts/generate-manifest';
import { rootPath } from './scripts/utils';

const browser = process.env.BUILD_FOR || 'firefox';
const mode = process.env.BUILD_MODE || 'test';

const developmentModes: ExtensionMode[] = ['dev', 'test', 'staged'];
const viteModes: Record<ExtensionMode, 'development' | 'production'> = {
  beta: 'production',
  dev: 'development',
  prod: 'production',
  staged: 'development',
  test: 'development',
};

export default defineConfig({
  root: rootPath('src'),
  mode: viteModes[mode],
  plugins: [
    WebExtension({
      assets: 'assets',
      manifest: () => generateManifest({ browser, mode }),
      browser,
      verbose: true,
    }),
    Vue(),
  ],
  build: {
    outDir: rootPath('dist'),
    emptyOutDir: true,
    sourcemap: developmentModes.includes(mode) ? 'inline' : undefined,
  },
  define: {
    EXTENSION_VERSION: `'${pkg.version}'`,
  },
  resolve: {
    alias: {
      '~/': `${rootPath('src')}/`,
      '~api': rootPath('src/common/api'),
      '~env': rootPath('src/common/utils/env'),
    },
  },
  optimizeDeps: {
    include: ['vue', '@vueuse/core'],
    exclude: ['vue-demi'],
  },
});
