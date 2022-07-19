import { loadedLog } from '~/utils/log';
import { setupPlayerConfig } from '~/utils/setup-player-config';
import { cleanupUrl } from '~utils/urls';
import './player-overrides.scss';

export function setupZoroPlayer() {
  loadedLog('content-scripts/services/zoro/player.ts');

  return setupPlayerConfig('zoro', {
    serviceDisplayName: 'Zoro.to',
    getRootQuery: () => 'body',
    getVideoQuery: () => 'video',
    transformServiceUrl: url => cleanupUrl(url, { allowedQueryParams: ['ep'] }),
  });
}
