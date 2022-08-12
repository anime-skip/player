import browser from 'webextension-polyfill';
import { isUrlSupported } from '~/stores/url-supported';
import { loadedLog, log } from '~/utils/log';
import { webExtStorage } from '~/utils/web-ext-storage';

const iconBase = browser.runtime.getURL('assets/');
const enabledIcon = {
  '16': iconBase + 'extension-logo/16.png',
  '32': iconBase + 'extension-logo/32.png',
  '48': iconBase + 'extension-logo/48.png',
  '128': iconBase + 'extension-logo/128.png',
};

const disabledIcon = {
  '16': iconBase + 'extension-logo-disabled/16.png',
  '32': iconBase + 'extension-logo-disabled/32.png',
  '48': iconBase + 'extension-logo-disabled/48.png',
  '128': iconBase + 'extension-logo-disabled/128.png',
};

export function initPageAction() {
  loadedLog('background/chrome-page-action.ts');

  const action = browser.action ?? browser.pageAction;

  function enableAction(tab: browser.Tabs.Tab) {
    if (tab.id == null) return;

    action.setIcon({
      tabId: tab.id,
      path: enabledIcon,
    });
  }
  function disableAction(tab: browser.Tabs.Tab) {
    if (tab.id == null) return;

    action.setIcon({
      tabId: tab.id,
      path: disabledIcon,
    });
  }

  async function onTabChanged(tab: browser.Tabs.Tab) {
    if (!tab.active || !tab.url) return;

    if (isUrlSupported(tab.url)) enableAction(tab);
    else disableAction(tab);
  }

  async function updateActiveTabUrl(tab: browser.Tabs.Tab) {
    const url = tab.url || null;
    webExtStorage.setItem('supported-website-check-url', url);
    log(`Updated current tab in storage to: ${url}`);
  }

  browser.tabs.onActivated.addListener(async activeInfo => {
    const tab = await browser.tabs.get(activeInfo.tabId);
    await onTabChanged(tab);
    if (tab.active) await updateActiveTabUrl(tab);
  });
  browser.tabs.onUpdated.addListener(async tabId => {
    const tab = await browser.tabs.get(tabId);
    await onTabChanged(tab);
    if (tab.active) await updateActiveTabUrl(tab);
  });
}
