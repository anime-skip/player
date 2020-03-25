import { as } from '../utils/GlobalUtils';
import Messenger from '../utils/Messenger';

const messenger = new Messenger('content-script');

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
  searchShows(name) {
    return messenger.send('searchShows', name);
  },
  searchEpisodes(name) {
    return messenger.send('searchEpisodes', name);
  },
  fetchEpisodeByUrl(url) {
    return messenger.send('fetchEpisodeByUrl', url);
  },
});
