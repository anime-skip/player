import { loadedLog } from '~/utils/log';
import { defineWebExtPlayerConfig } from '~/utils/define-player-config';
import './player-overrides.css';

export function initTestServicePlayer() {
  loadedLog('content-scripts/services/test-service/player.ts');

  return defineWebExtPlayerConfig('test-service', {
    serviceDisplayName: 'Anime Skip Test',
    getRootQuery: () => '.video-container',
    getVideo: () => '#video',
  });
}
