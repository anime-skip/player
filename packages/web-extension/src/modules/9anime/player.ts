import { loadedLog } from '~/utils/log';
import { defineWebExtPlayerConfig } from '~/utils/define-player-config';
import { cleanupUrl } from '~utils/urls';
import './player-overrides.scss';

export function init9animePlayer() {
  loadedLog('content-scripts/services/9anime/player.ts');

  return defineWebExtPlayerConfig('9anime', {
    serviceDisplayName: '9anime',
    getRootQuery: () => 'body',
    getVideo: () => 'video',
    transformServiceUrl: url => cleanupUrl(url).replace(/9anime\.\w+/, '9anime.to'),
  });
}
