import browser from 'webextension-polyfill';
import { PAGE_ACTION_MATCHES } from '~/common/utils/compile-time-constants';
import { loadedLog, log } from '~/common/utils/log';

export function initChromePageAction() {
  loadedLog('background/chrome-page-action.ts');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chrome = browser as any;
  browser.runtime.onInstalled.addListener(function (_details) {
    const hosts: Array<{ scheme: string; host: string }> = PAGE_ACTION_MATCHES.map(pageMatch => {
      const url = new URL(pageMatch);
      return {
        scheme: url.protocol.replace(':', ''),
        host: url.hostname,
      };
    });
    log('Browser action enabled hosts', hosts);

    const rules = hosts.map(({ host, scheme }) => {
      return {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: host, schemes: [scheme] },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      };
    });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
      chrome.declarativeContent.onPageChanged.addRules(rules);
    });
  });
}
