import vue from '@vitejs/plugin-vue';
import components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import webExtension from 'vite-plugin-web-extension';
import pkg from './package.json';
import { generateManifest } from './scripts/generate-manifest';
import { rootPath } from './scripts/utils';
import icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import IconResolver from 'unplugin-icons/resolver';

let webExtConfig = {};
try {
  webExtConfig = require('./.web-ext.config.json');
} catch (_) {
  // noop
}

const browser = process.env.BROWSER || 'firefox';

export const alias = {
  '~/': rootPath('src') + '/',
  '~api': rootPath('../common/src/api'),
  '~utils': rootPath('../common/src/utils') + '/',
  '~types': rootPath('../common/src/types'),
};

export default defineConfig(({ mode }) => ({
  root: rootPath('src'),
  plugins: [
    icons({
      customCollections: {
        my: FileSystemIconLoader(rootPath('..', 'player-ui', 'src', 'assets')),
      },
    }),
    components({
      dts: true,
      allowOverrides: true,
      dirs: [rootPath('src'), rootPath('..', 'player-ui', 'src')],

      /**
       * Hack to fix:
       * https://github.com/anime-skip/web-extension/issues/169
       */
      importPathTransform: path => {
        return path.startsWith('C:') ? path.replaceAll('\\', '\\\\') : path;
      },
      resolvers: [
        IconResolver({
          customCollections: ['my'],
        }),
      ],
    }),
    webExtension({
      assets: 'assets',
      manifest: () => generateManifest({ browser, mode }),
      browser,
      webExtConfig,
      skipManifestValidation: true,
      watchFilePaths: [rootPath('..', 'player-ui', 'src')],
    }),
    vue(),
  ],
  build: {
    outDir: rootPath('dist'),
    emptyOutDir: true,
    sourcemap: mode === 'development' ? 'inline' : undefined,
    minify: mode === 'production' ? 'esbuild' : false,
  },
  define: {
    __EXTENSION_VERSION__: `'${pkg.version}'`,
    __TARGET_BROWSER__: `'${browser}'`,
  },
  resolve: {
    alias,
  },
  optimizeDeps: {
    include: ['vue', '@vueuse/core'],
    exclude: ['vue-demi'],
  },
}));
