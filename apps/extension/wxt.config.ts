import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  manifestVersion: 3,
  manifest: ({ mode }) => ({
    name: `Anime Skip Player${mode === 'development' ? ' (DEV)' : ''}`,
    description: 'Custom video player for anime streaming websites.',
    permissions: ['storage', 'tabs', 'contextMenus'],
  }),
  experimental: {
    // includeBrowserPolyfill: false,
  },
});
