import { createUsageStatsClient, UsageStatsClientConfig } from '@anime-skip/usage-stats-client';
import browser from 'webextension-polyfill';
import { detectBrowser } from '~utils/browser';
import { debug } from './log';
import { webExtStorage } from './web-ext-storage';

export const USAGE_STATS_USER_ID_STORAGE_KEY = 'usage-stats-user-id';

const getUserId: UsageStatsClientConfig['getUserId'] = () => {
  return webExtStorage
    .getItem<string | undefined>(USAGE_STATS_USER_ID_STORAGE_KEY)
    .then(user => user ?? undefined);
};

const reportModes: ExtensionMode[] = ['prod', 'beta'];

const client = createUsageStatsClient({
  app: 'Anime Skip Player',
  appVersion: EXTENSION_VERSION,
  browser: detectBrowser(),
  getUserId,
  log: (...args) => debug('[usage-client]', ...args),
  persistGuestUserId(userId) {
    return webExtStorage.setItem(USAGE_STATS_USER_ID_STORAGE_KEY, userId);
  },
  source: 'browser',
  canSendMetrics() {
    return reportModes.includes(EXTENSION_MODE) && TARGET_BROWSER !== 'firefox';
  },
});

export default {
  getUserId,
  ...client,
};
