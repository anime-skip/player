import { as } from '../utils/GlobalUtils';
import Messenger from '../utils/Messenger';

const messenger = new Messenger<
  ApiMessageTypes,
  ApiMessageListenerMap,
  ApiMessagePayloadMap,
  ApiMessageResponseMap
>('content-script');

export default as<Api.Implementation>({
  loginManual(username, password) {
    return messenger.send('loginManual', { username, password });
  },
  loginRefresh(refreshToken) {
    return messenger.send('loginRefresh', refreshToken);
  },

  updatePreferences(prefs) {
    return messenger.send('updatePreferences', prefs);
  },

  createShow(data) {
    return messenger.send('createShow', data);
  },
  searchShows(name) {
    return messenger.send('searchShows', name);
  },

  createEpisode(data, showId) {
    return messenger.send('createEpisode', { data, showId });
  },
  searchEpisodes(name, showId) {
    return messenger.send('searchEpisodes', { name, showId });
  },

  createEpisodeUrl(data, episodeId) {
    return messenger.send('createEpisodeUrl', { data, episodeId });
  },
  deleteEpisodeUrl(url) {
    return messenger.send('deleteEpisodeUrl', url);
  },
  fetchEpisodeByUrl(url) {
    return messenger.send('fetchEpisodeByUrl', url);
  },

  createTimestamp(episodeId, data) {
    return messenger.send('createTimestamp', { episodeId, data });
  },
  updateTimestamp(data) {
    return messenger.send('updateTimestamp', data);
  },
  deleteTimestamp(timestampId) {
    return messenger.send('deleteTimestamp', timestampId);
  },
});
