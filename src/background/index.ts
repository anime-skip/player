import AxiosApi from '@/common/api/AxiosApi';
import Browser from '@/common/utils/Browser';
import Messenger from '@/common/utils/Messenger';
import { services } from '@/common/utils/CompileTimeConstants';

// Setup Globals

global.Api = AxiosApi;

// Setup Messaging

const messenger = new Messenger<
  ApiMessageTypes & RuntimeMessageTypes,
  ApiMessageListenerMap & RuntimeMessageListenerMap,
  ApiMessagePayloadMap & RuntimeMessagePayloadMap,
  ApiMessageResponseMap & RuntimeMessageResponseMap
>(
  'background',
  {
    loginManual: ({ username, password }) => global.Api.loginManual(username, password),
    loginRefresh: global.Api.loginRefresh,

    updatePreferences: global.Api.updatePreferences,

    createShow: global.Api.createShow,
    searchShows: global.Api.searchShows,

    createEpisode: ({ data, showId }) => global.Api.createEpisode(data, showId),
    searchEpisodes: ({ name, showId }) => global.Api.searchEpisodes(name, showId),
    updateEpisode: ({ episodeId, newEpisode }) => global.Api.updateEpisode(episodeId, newEpisode),

    createEpisodeUrl: ({ data, episodeId }) => global.Api.createEpisodeUrl(data, episodeId),
    deleteEpisodeUrl: global.Api.deleteEpisodeUrl,
    fetchEpisodeByUrl: global.Api.fetchEpisodeByUrl,
    fetchEpisodeByName: ({ name, showName }) => global.Api.fetchEpisodeByName(name, showName),
    updateEpisodeUrl: ({ episodeUrl, newEpisodeUrl }) =>
      global.Api.updateEpisodeUrl(episodeUrl, newEpisodeUrl),

    createTimestamp: ({ episodeId, data }) => global.Api.createTimestamp(episodeId, data),
    updateTimestamp: global.Api.updateTimestamp,
    deleteTimestamp: global.Api.deleteTimestamp,

    '@anime-skip/open-options': async () => {
      await browser.runtime.openOptionsPage();
    },
    '@anime-skip/open-popup': async () => {
      await browser.tabs.create({ url: 'popup/index.html?closeAfterLogin=true' });
    },
    '@anime-skip/get-url': async (_, sender) => {
      return sender.tab?.url;
    },
  },
  ['@anime-skip/inferEpisodeInfo']
);

// Setup tab listener messaging

browser.tabs.onUpdated.addListener(function (tabId, { url }, _tabInfo) {
  if (url == null) return;

  messenger.send('@anime-skip/changeUrl', url, tabId).catch(err => {
    console.warn('Tab url change update failed', err);
  });
});

// Setup page action behavior for chrome

if (Browser.detect() === 'chrome') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chrome = browser as any;
  browser.runtime.onInstalled.addListener(function (_details) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const hosts: Array<{ scheme: string; host: string }> = services.map(service => {
      const url = new URL(service.page_matches[0]);
      console.log(url);
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

    const rules = hosts.map(({ host, scheme }) => {
      const matcher = scheme === 'file://' ? {} : { hostEquals: host };
      return {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { ...matcher, schemes: [scheme] },
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
