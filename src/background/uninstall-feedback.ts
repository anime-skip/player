import { browser } from 'webextension-polyfill-ts';
import Browser from '~/common/utils/Browser';
import { loadedLog } from '~/common/utils/loadedLog';
import UsageStats from '~/common/utils/UsageStats';

loadedLog('background/uninstall-feedback.ts');

function getUninstallUrl(userId: string | undefined): string | undefined {
  if (userId == null) return undefined;
  const encodedUserId = encodeURIComponent(userId);
  const browserName = encodeURIComponent(Browser.detect());
  const appVersion = encodeURIComponent(EXTENSION_VERSION);
  return `https://usage-stats.anime-skip.com/redirects/extension-uninstalled?user_id=${encodedUserId}&app_version=${appVersion}&browser=${browserName}`;
}

let prevUninstallUrl: string | undefined = undefined;
setInterval(() => {
  Promise.resolve(UsageStats.getUserId()).then(userId => {
    const uninstallUrl = userId ? getUninstallUrl(userId) : undefined;
    if (uninstallUrl !== prevUninstallUrl) {
      browser.runtime.setUninstallURL(uninstallUrl);
      console.log('Updated uninstall url:', uninstallUrl);
    }
    prevUninstallUrl = uninstallUrl;
  });
}, 10 * 1000);
