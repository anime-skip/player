import { createUsageStatsClient, UsageStatsClientConfig } from '@anime-skip/usage-stats-client';
import browser from 'webextension-polyfill';
import Browser from './Browser';
import { debug } from './log';

export const USAGE_STATS_USER_ID_STORAGE_KEY = 'usage-stats-user-id';

const getUserId: UsageStatsClientConfig['getUserId'] = async () => {
  const results = await browser.storage.local.get(USAGE_STATS_USER_ID_STORAGE_KEY);
  return results[USAGE_STATS_USER_ID_STORAGE_KEY];
};

const reportModes: ExtensionMode[] = ['prod', 'beta'];

const client = createUsageStatsClient({
  app: 'Anime Skip Player',
  appVersion: EXTENSION_VERSION,
  browser: Browser.detect(),
  getUserId,
  log: debug,
  async persistGuestUserId(userId) {
    browser.storage.local.set({ [USAGE_STATS_USER_ID_STORAGE_KEY]: userId });
  },
  send: reportModes.includes(EXTENSION_MODE),
  source: 'browser',
});

export default {
  getUserId,
  ...client,
};
