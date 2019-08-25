import Api from '@/shared/utils/Api';
import Messenger from '@/shared/utils/Messenger';

console.info('Started messenger on the background script');
const messenger = new Messenger();

messenger.on('fetchEpisode', async url => {
  return await Api.fetchEpisodeByUrl(url);
});
