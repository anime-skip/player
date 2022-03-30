import { loadedLog } from '~/common/utils/log';
import { setupPlayerConfig } from '~/common/utils/setup-player-config';
import './player-overrides.css';

export function initTestServicePlayer() {
  loadedLog('content-scripts/services/test-service/player.ts');

  return setupPlayerConfig('test-service', {
    serviceDisplayName: 'Anime Skip Test',
    getRootQuery: () => '.video-container',
    getVideoQuery: () => '#video',
  });
}
