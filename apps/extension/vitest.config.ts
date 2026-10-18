import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing/vitest-plugin';

export default defineConfig({
  test: {
    restoreMocks: true,
    mockReset: true,
  },
  plugins: [WxtVitest()],
});
