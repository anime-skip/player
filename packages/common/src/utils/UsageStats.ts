import { createUsageStatsClient, UsageStatsClientConfig } from '@anime-skip/usage-stats-client';
import browser from 'webextension-polyfill';
import { SHOULD_LOG } from '.';
import { detectBrowser } from './browser';
import { debug } from './log';

export const USAGE_STATS_USER_ID_STORAGE_KEY = 'usage-stats-user-id';

const getUserId: UsageStatsClientConfig['getUserId'] = async () => {
  const results = await browser.storage.local.get(USAGE_STATS_USER_ID_STORAGE_KEY);
  return results[USAGE_STATS_USER_ID_STORAGE_KEY];
};

const client = createUsageStatsClient({
  app: 'Anime Skip Player',
  appVersion: __APP_VERSION__,
  browser: detectBrowser(),
  getUserId,
  log: debug,
  async persistGuestUserId(userId) {
    browser.storage.local.set({ [USAGE_STATS_USER_ID_STORAGE_KEY]: userId });
  },
  send: !SHOULD_LOG,
  source: 'browser',
});

export default {
  getUserId,
  ...client,
};
