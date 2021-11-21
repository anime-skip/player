import browser from 'webextension-polyfill';
import { PAGE_ACTION_MATCHES } from '~/common/utils/CompileTimeConstants';
import { loadedLog } from '~/common/utils/loadedLog';

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
    // TODO: Do these need to be explicitly added?
    // hosts.push({
    //   host: 'www.anime-skip.com',
    //   scheme: 'https',
    // });
    // hosts.push({
    //   host: 'anime-skip.com',
    //   scheme: 'https',
    // });
    console.log('Browser action enabled hosts', hosts);

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
