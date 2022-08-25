import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import type { Browser } from 'webextension-polyfill';

const browser = mock<Browser>({
  storage: {
    onChanged: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
  },
});
export default browser;
