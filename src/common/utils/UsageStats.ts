import { createUsageStatsClient, UsageStatsClientConfig } from '@anime-skip/usage-stats-client';
import { browser } from 'webextension-polyfill-ts';
import Browser from './Browser';

declare const EXTENSION_VERSION: string;

export const USAGE_STATS_USER_ID_STORAGE_KEY = 'usage-stats-user-id';

const getUserId: UsageStatsClientConfig['getUserId'] = async () => {
  const results = await browser.storage.local.get(USAGE_STATS_USER_ID_STORAGE_KEY);
  return results[USAGE_STATS_USER_ID_STORAGE_KEY];
};

const client = createUsageStatsClient({
  app: 'Anime Skip Player',
  appVersion: EXTENSION_VERSION,
  browser: Browser.detect(),
  getUserId,
  log: console.log,
  async persistGuestUserId(userId) {
    browser.storage.local.set({ [USAGE_STATS_USER_ID_STORAGE_KEY]: userId });
  },
  send: import.meta.env.VITE_EXT_MODE === 'prod' || import.meta.env.VITE_EXT_MODE === 'beta',
  source: 'browser',
});

export default {
  getUserId,
  async setUserId(userId: string): Promise<void> {
    await browser.storage.local.set({ [USAGE_STATS_USER_ID_STORAGE_KEY]: userId });
  },
  async clearUserId(): Promise<void> {
    await browser.storage.local.remove(USAGE_STATS_USER_ID_STORAGE_KEY);
  },
  ...client,
};
