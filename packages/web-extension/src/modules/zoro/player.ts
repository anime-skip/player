import { loadedLog } from '~/utils/log';
import { defineWebExtPlayerConfig } from '~/utils/define-player-config';
import { cleanupUrl } from '~utils/urls';
import './player-overrides.scss';

export function initZoroPlayer() {
  loadedLog('content-scripts/services/zoro/player.ts');

  return defineWebExtPlayerConfig('zoro', {
    serviceDisplayName: 'Zoro.to',
    getRootQuery: () => 'body',
    getVideo: () => 'video',
    transformServiceUrl: url => cleanupUrl(url, { allowedQueryParams: ['ep'] }),
  });
}
