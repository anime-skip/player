import AxiosApi from '@/common/api/AxiosApi';
import Messenger from '@/common/utils/Messenger';

// Setup Globals

global.Api = AxiosApi;

// Setup Messaging

new Messenger('background', {
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

  createTimestamp: ({ episodeId, data }) => global.Api.createTimestamp(episodeId, data),
  updateTimestamp: global.Api.updateTimestamp,
  deleteTimestamp: global.Api.deleteTimestamp,
});
console.log('Started messenger on the background script');
