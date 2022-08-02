import { loadedLog } from '~/common/utils/log';
import { setupPlayerConfig } from '~/common/utils/setup-player-config';
import './player-overrides.scss';
import { cleanupUrl } from '~utils/urls';

export function setup9animePlayer() {
  loadedLog('content-scripts/services/9anime/player.ts');

  return setupPlayerConfig('9anime', {
    serviceDisplayName: '9anime',
    getRootQuery: () => 'body',
    getVideoQuery: () => 'video',
    transformServiceUrl: url => cleanupUrl(url).replace(/9anime\.\w+/, '9anime.to'),
  });
}
