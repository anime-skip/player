import { loadedLog } from '~/common/utils/log';
import setupGlobals from '~/common/utils/setupGlobals';
import './player-overrides.css';

export function initTestServicePlayer() {
  loadedLog('content-scripts/services/test-service/player.ts');

  setupGlobals('test-service', {
    serviceDisplayName: 'Anime Skip Test',
    getRootQuery: () => '.video-container',
    getVideoQuery: () => '#video',
  });
}
