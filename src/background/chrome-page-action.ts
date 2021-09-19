import { browser } from 'webextension-polyfill-ts';
import { services } from '~/common/utils/CompileTimeConstants';
import { loadedLog } from '~/common/utils/loadedLog';

loadedLog('background/chrome-page-action.ts');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chrome = browser as any;
browser.runtime.onInstalled.addListener(function (_details) {
  const hosts: Array<{ scheme: string; host: string }> = services
    .flatMap(service => service.page_matches)
    .map(pageMatch => {
      const url = new URL(pageMatch);
      return {
        scheme: url.protocol.replace(':', ''),
        host: url.hostname,
      };
    });
  hosts.push({
    host: 'www.anime-skip.com',
    scheme: 'https',
  });
  hosts.push({
    host: 'anime-skip.com',
    scheme: 'https',
  });
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
