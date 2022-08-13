import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: 'src',
  test: {
    mockReset: true,
    restoreMocks: true,
    setupFiles: 'vitest.setup.ts',
  },
  plugins: [vue()],
});
