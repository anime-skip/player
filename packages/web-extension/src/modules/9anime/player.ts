import { loadedLog } from '~/utils/log';
import { setupPlayerConfig } from '~/utils/setup-player-config';
import { cleanupUrl } from '~utils/urls';
import './player-overrides.scss';

export function setup9animePlayer() {
  loadedLog('content-scripts/services/9anime/player.ts');

  return setupPlayerConfig('9anime', {
    serviceDisplayName: '9anime',
    getRootQuery: () => 'body',
    getVideoQuery: () => 'video',
    transformServiceUrl: url => cleanupUrl(url).replace(/9anime\.\w+/, '9anime.to'),
  });
}
