import { loadedLog } from '~/common/utils/log';
import { setupPlayerConfig } from '~/common/utils/setup-player-config';
import './player-overrides.scss';
import { cleanupUrl } from '~utils/urls';

export function setupZoroPlayer() {
  loadedLog('content-scripts/services/zoro/player.ts');

  return setupPlayerConfig('zoro', {
    serviceDisplayName: 'Zoro.to',
    getRootQuery: () => 'body',
    getVideoQuery: () => 'video',
    transformServiceUrl: url => cleanupUrl(url, { allowedQueryParams: ['ep'] }),
  });
}
