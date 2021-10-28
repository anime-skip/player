import { browser } from 'webextension-polyfill-ts';
import { loadedLog } from '~/common/utils/loadedLog';
import UsageStats from '~/common/utils/UsageStats';

loadedLog('background/uninstall-feedback.ts');

let prevUninstallUrl: string | undefined = undefined;
setInterval(() => {
  Promise.resolve(UsageStats.getUserId()).then(userId => {
    const uninstallUrl = userId
      ? `https://usage-stats.anime-skip.com/redirects/${userId}/uninstall`
      : undefined;
    if (uninstallUrl !== prevUninstallUrl) {
      browser.runtime.setUninstallURL(uninstallUrl);
      console.log('Updated uninstall url:', uninstallUrl);
    }
    prevUninstallUrl = uninstallUrl;
  });
}, 10 * 1000);
