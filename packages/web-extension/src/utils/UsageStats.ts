import { createUsageStatsClient, UsageStatsClientConfig } from '@anime-skip/usage-stats-client';
import { detectBrowser } from '~utils/browser';
import { debug } from './log';
import { webExtStorage } from './web-ext-storage';

export const USAGE_STATS_USER_ID_STORAGE_KEY = 'usage-stats-user-id';

const getUserId: UsageStatsClientConfig['getUserId'] = () => {
  return webExtStorage
    .getItem<string | undefined>(USAGE_STATS_USER_ID_STORAGE_KEY)
    .then(user => user ?? undefined);
};

const client = createUsageStatsClient({
  app: 'Anime Skip Player',
  appVersion: __EXTENSION_VERSION__,
  browser: detectBrowser(),
  getUserId,
  log: (...args) => debug('[usage-client]', ...args),
  persistGuestUserId(userId) {
    return webExtStorage.setItem(USAGE_STATS_USER_ID_STORAGE_KEY, userId);
  },
  source: 'browser',
  canSendMetrics() {
    return import.meta.env.PROD && __TARGET_BROWSER__ !== 'firefox';
  },
});

export default {
  getUserId,
  ...client,
};
