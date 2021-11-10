import browser from 'webextension-polyfill';
import { loadedLog } from '~/common/utils/loadedLog';
import Messenger from '~/common/utils/Messenger';

loadedLog('background/tab-change.ts');

const messenger = new Messenger('background-tabs');

browser.tabs.onUpdated.addListener(function (tabId, { url }, _tabInfo) {
  if (url == null) return;

  messenger.send('@anime-skip/changeUrl', url, tabId).catch(err => {
    console.warn('Tab url change update failed', err);
  });
});
