import AxiosApi from '@/common/api/AxiosApi';
import Messenger from '@/common/utils/Messenger';
import { globalAgent } from 'http';

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
  searchEpisodes: global.Api.searchEpisodes,

  createEpisodeUrl: ({ data, episodeId }) => global.Api.createEpisodeUrl(data, episodeId),
  deleteEpisodeUrl: global.Api.deleteEpisodeUrl,
  fetchEpisodeByUrl: global.Api.fetchEpisodeByUrl,
});
console.info('Started messenger on the background script');
