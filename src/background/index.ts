import AxiosApi from '@/common/api/AxiosApi';
import Messenger from '@/common/utils/Messenger';

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
  },
  ['@anime-skip/inferEpisodeInfo']
);

// Setup tab listener messaging

browser.tabs.onUpdated.addListener(function(tabId, { url }, _tabInfo) {
  if (url == null) return;

  messenger.send('@anime-skip/changeUrl', url, tabId).catch(err => {
    console.warn('Tab url change update failed', err);
  });
});
