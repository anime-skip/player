import browser from 'webextension-polyfill';
import { loadedLog, log } from '~/utils/log';
import UsageStats from '~/utils/UsageStats';
import { detectBrowser } from '~utils/browser';

function getUninstallUrl(userId: string | undefined): string | undefined {
  if (userId == null) return undefined;
  const encodedUserId = encodeURIComponent(userId);
  const browserName = encodeURIComponent(detectBrowser() ?? TARGET_BROWSER);
  const appVersion = encodeURIComponent(EXTENSION_VERSION);
  return `https://usage-stats.anime-skip.com/redirects/extension-uninstalled?user_id=${encodedUserId}&app_version=${appVersion}&browser=${browserName}`;
}

export function initMetrics() {
  loadedLog('background/metrics.ts');

  browser.runtime.onInstalled.addListener(event => {
    log('onInstalled', event);

    if (event.reason === 'install') {
      UsageStats.saveEvent('extension_installed');
    } else if (event.reason === 'update') {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const fromVersion = event.previousVersion!;
      const toVersion = EXTENSION_VERSION;

      // Reloading temp extension triggers an "update" event with the same versions
      if (fromVersion !== toVersion)
        UsageStats.saveEvent('extension_updated', { fromVersion, toVersion });
    }
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
