import vue from '@vitejs/plugin-vue';
import components from 'unplugin-vue-components/vite';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import pkg from './package.json';
import { rootPath } from './scripts/utils';
import { alias } from './vite.config';

export default defineConfig(({ mode }) => ({
  root: rootPath('src'),
  test: {
    mockReset: true,
    restoreMocks: true,
    setupFiles: rootPath('vitest.setup.ts'),
    cache: {
      dir: rootPath('node_modules/.vitest'),
    },
  },
  plugins: [
    components({
      dts: true,
      allowOverrides: true,
      dirs: [rootPath('src')],

      /**
       * Hack to fix:
       * https://github.com/anime-skip/web-extension/issues/169
       */
      importPathTransform: path => {
        return path.startsWith('C:') ? path.replaceAll('\\', '\\\\') : path;
      },
    }),
    vue(),
  ],
  resolve: {
    alias,
  },
  define: {
    __EXTENSION_VERSION__: `'${pkg.version}'`,
    __TARGET_BROWSER__: `'firefox'`,
    'vite.env': loadEnv(mode, process.cwd()),
  },
}));
