import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing';

export default defineConfig({
  test: {
    restoreMocks: true,
    mockReset: true,
  },
  ssr: {
    noExternal: ['@webext-core/messaging'],
  },
  plugins: [WxtVitest()],
});
