import browser from 'webextension-polyfill';
import { loadedLog, warn } from '~/common/utils/log';
import Messenger from '~/common/utils/Messenger';

export function initTabChange() {
  loadedLog('background/tab-change.ts');

  const messenger = new Messenger('background-tabs');

  browser.tabs.onUpdated.addListener(function (tabId, { url }, _tabInfo) {
    if (url == null) return;

    messenger.send('@anime-skip/changeUrl', url, tabId).catch(err => {
      warn('Tab url change update failed', err);
    });
  });
}
