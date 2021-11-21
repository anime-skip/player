import { loadedLog } from '~/common/utils/loadedLog';
import setupGlobals from '~/common/utils/setupGlobals';
import './player.css';

export function initTestServicePlayer() {
  loadedLog('content-scripts/services/test-service/player.ts');
  setupGlobals('test-service', {
    serviceDisplayName: 'Anime Skip Test',
    getRootQuery: () => '.video-container',
    getVideoQuery: () => '#video',
  });
}
