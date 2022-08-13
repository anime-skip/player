import { sendMessage } from 'webext-bridge';
import Browser from 'webextension-polyfill';
import { loadedLog, warn } from '~/utils/log';

export function initTabChange() {
  loadedLog('background/tab-change.ts');

  Browser.tabs.onUpdated.addListener(function (tabId, { url }, _tabInfo) {
    if (url == null) return;

    sendMessage('@anime-skip/changeUrl', url, `content-script@${tabId}`).catch(err => {
      warn('Tab url change update failed', err);
    });
  });
}
