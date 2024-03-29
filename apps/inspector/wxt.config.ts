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
    permissions: ['storage', 'contextMenus', 'webNavigation'],
    action: {
      default_area: 'navbar',
    },
  },
  runner: {
    startUrls: ['https://anime-skip.com/'],
  },
});
