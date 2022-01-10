import browser from 'webextension-polyfill';
import { detectBrowser } from '~/common/utils/browser';
import { loadedLog, log } from '~/common/utils/log';
import UsageStats from '~/common/utils/UsageStats';

const EXTENSION_VERSION_STORAGE_KEY = 'extension-version';

function getUninstallUrl(userId: string | undefined): string | undefined {
  if (userId == null) return undefined;
  const encodedUserId = encodeURIComponent(userId);
  const browserName = encodeURIComponent(detectBrowser());
  const appVersion = encodeURIComponent(EXTENSION_VERSION);
  return `https://usage-stats.anime-skip.com/redirects/extension-uninstalled?user_id=${encodedUserId}&app_version=${appVersion}&browser=${browserName}`;
}

export function initMetrics() {
  loadedLog('background/metrics.ts');

  browser.runtime.onInstalled.addListener(async () => {
    const result = await browser.storage.local.get(EXTENSION_VERSION_STORAGE_KEY);
    const prevVersion = result[EXTENSION_VERSION_STORAGE_KEY] as string | undefined;
    if (prevVersion == null) {
      UsageStats.saveEvent('extension_installed');
    } else if (prevVersion !== EXTENSION_VERSION) {
      UsageStats.saveEvent('extension_updated', {
        fromVersion: prevVersion,
        toVersion: EXTENSION_VERSION,
      });
    }
    await browser.storage.local.set({ [EXTENSION_VERSION_STORAGE_KEY]: EXTENSION_VERSION });
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
