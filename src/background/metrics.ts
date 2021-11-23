import browser from 'webextension-polyfill';
import Browser from '~/common/utils/Browser';
import { loadedLog, log } from '~/common/utils/log';
import UsageStats from '~/common/utils/UsageStats';

function getUninstallUrl(userId: string | undefined): string | undefined {
  if (userId == null) return undefined;
  const encodedUserId = encodeURIComponent(userId);
  const browserName = encodeURIComponent(Browser.detect());
  const appVersion = encodeURIComponent(EXTENSION_VERSION);
  return `https://usage-stats.anime-skip.com/redirects/extension-uninstalled?user_id=${encodedUserId}&app_version=${appVersion}&browser=${browserName}`;
}

export function initMetrics() {
  loadedLog('background/metrics.ts');

  browser.runtime.onInstalled.addListener(() => {
    UsageStats.saveEvent('extension_installed');
  });

  let prevUninstallUrl: string | undefined = undefined;
  setInterval(() => {
    Promise.resolve(UsageStats.getUserId()).then(userId => {
      const uninstallUrl = userId ? getUninstallUrl(userId) : undefined;
      if (uninstallUrl !== prevUninstallUrl) {
        browser.runtime.setUninstallURL(uninstallUrl);
        log('Updated uninstall url:', uninstallUrl);
      }
      prevUninstallUrl = uninstallUrl;
    });
  }, 10 * 1000);
}
