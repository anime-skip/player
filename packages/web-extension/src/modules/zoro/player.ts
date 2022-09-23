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
    /**
     * Zoro replaces HTML content when loading the player, this waits for that content to be loaded
     * before loading the anime skip player.
     */
    async delayMountingUntil() {
      return !!document.getElementById('vidcloud-player') && !!document.querySelector('video');
    },
  });
}
