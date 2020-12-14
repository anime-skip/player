import { SUPPORTED_THIRD_PARTY_SERVICES } from '../utils/Constants';
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

  updatePreferences(preferences) {
    return messenger.send('updatePreferences', preferences);
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
  updateEpisode(episodeId, newEpisode) {
    return messenger.send('updateEpisode', { episodeId, newEpisode });
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
  async fetchEpisodeByName(name, showName) {
    // The axiosApi doesn't have a global.service since it handles all services. Instead, this is
    // handled here to always pull out unsupported 3rd party services
    const allServiceResults = await messenger.send('fetchEpisodeByName', { name, showName });
    const thisServiceResults = allServiceResults.filter(episode =>
      SUPPORTED_THIRD_PARTY_SERVICES[global.service].includes(episode.source)
    );
    return thisServiceResults;
  },
  updateEpisodeUrl(episodeUrl, newEpisodeUrl) {
    return messenger.send('updateEpisodeUrl', { episodeUrl, newEpisodeUrl });
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
