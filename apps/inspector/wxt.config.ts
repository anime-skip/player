import { defineConfig } from 'wxt';
import vue from '@vitejs/plugin-vue';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  imports: {
    addons: {
      vueTemplate: true,
    },
    presets: ['vue-router', '@vueuse/core'],
  },
  vite: () => ({
    plugins: [vue()],
  }),
  manifest: {
    version: '1.0.0',
    permissions: ['storage', 'contextMenus'],
    action: {
      default_area: 'navbar',
    },
  },
  runner: {
    startUrls: ['https://anime-skip.com/'],
  },
});
