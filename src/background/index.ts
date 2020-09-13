import AxiosApi from '@/common/api/AxiosApi';
import Messenger from '@/common/utils/Messenger';
import { url } from 'inspector';

// Setup Globals

global.Api = AxiosApi;

// Setup Messaging

const messenger = new Messenger<ApiMessageTypes, ApiMessageListenerMap>(
  'background',
  {
    loginManual: ({ username, password }) => global.Api.loginManual(username, password),
    loginRefresh: global.Api.loginRefresh,

    updatePreferences: global.Api.updatePreferences,

    createShow: global.Api.createShow,
    searchShows: global.Api.searchShows,

    createEpisode: ({ data, showId }) => global.Api.createEpisode(data, showId),
    searchEpisodes: ({ name, showId }) => global.Api.searchEpisodes(name, showId),

    createEpisodeUrl: ({ data, episodeId }) => global.Api.createEpisodeUrl(data, episodeId),
    deleteEpisodeUrl: global.Api.deleteEpisodeUrl,
    fetchEpisodeByUrl: global.Api.fetchEpisodeByUrl,
    fetchEpisodeByName: global.Api.fetchEpisodeByName,

    createTimestamp: ({ episodeId, data }) => global.Api.createTimestamp(episodeId, data),
    updateTimestamp: global.Api.updateTimestamp,
    deleteTimestamp: global.Api.deleteTimestamp,
  },
  ['@anime-skip/inferEpisodeInfo']
);
console.log('Started messenger on the background script');

// Setup tab listener messenging

browser.tabs.onUpdated.addListener(function(tabId, { url }, _tabInfo) {
  if (url == null) return;
  try {
    messenger.send('@anime-skip/changeUrl', url, tabId);
  } catch (err) {
    console.error('Tab url change update failed', err);
  }
});
