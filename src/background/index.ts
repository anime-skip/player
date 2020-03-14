import Api from '@/common/Api';
import Messenger from '@/common/utils/Messenger';

console.info('Started messenger on the background script');
const messenger = new Messenger();

messenger.on('fetchEpisode', async url => {
  return await Api.fetchEpisodeByUrl(url);
});
