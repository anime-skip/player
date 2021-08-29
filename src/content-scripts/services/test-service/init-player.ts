import { loadedLog } from '~/common/utils/loadedLog';
import setupGlobals from '~/common/utils/setupGlobals';
import './init-player.css';

loadedLog('content-scripts/services/test-service/init-player.ts');

setupGlobals('test-service', {
  serviceDisplayName: 'Anime Skip Test',
  getRootQuery() {
    return '.video-container';
  },
  getVideoQuery() {
    return '#video';
  },
});
