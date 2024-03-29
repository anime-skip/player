import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  manifestVersion: 3,
  manifest: ({ mode, browser }) => {
    const manifest: any = {
      name: `Anime Skip Player${mode === 'development' ? ' (DEV)' : ''}`,
      description:
        'Custom video player for anime streaming websites. Skip intros, outros, and more.',
      permissions: ['storage', 'activeTab', 'contextMenus'],
    };
    if (browser === 'firefox') {
      manifest.browser_specific_settings = {
        gecko: {
          id: '{0442d98f-4ecc-4859-a65a-13e5969da46b}',
          strict_min_version: '109.0',
        },
      };
    }

    return manifest;
  },
  zip: {
    name: 'anime-skip-player',
    sourcesRoot: '../..',
    ignoredSources: ['apps/inspector', 'apps/embedded-demo', 'README.md'],
  },
});
