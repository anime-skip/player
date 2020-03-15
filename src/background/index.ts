import AxiosApi from '@/common/api/AxiosApi';
import Messenger from '@/common/utils/Messenger';
import { globalAgent } from 'http';

// Setup Globals

global.Api = AxiosApi;

// Setup Messaging

new Messenger({
  fetchEpisodeByUrl: url => global.Api.fetchEpisodeByUrl(url),
  loginManual: ({ username, password }) => global.Api.loginManual(username, password),
  loginRefresh: global.Api.loginRefresh,
  updatePreferences: global.Api.updatePreferences,
});
console.info('Started messenger on the background script');
