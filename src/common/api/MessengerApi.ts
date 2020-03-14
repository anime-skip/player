import { as } from '../utils/GlobalUtils';
import Messenger from '../utils/Messenger';

const messenger = new Messenger();

export default as<Api.Implementation>({
  fetchEpisodeByUrl(url) {
    return messenger.send('fetchEpisodeByUrl', url);
  },
  loginManual(username, password) {
    return messenger.send('loginManual', { username, password });
  },
  loginRefresh(refreshToken: string) {
    return messenger.send('loginRefresh', refreshToken);
  },
  updatePreferences(prefs: Api.Preferences) {
    return messenger.send('updatePreferences', prefs);
  },
});
