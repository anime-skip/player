import { loadedLog } from '~/common/utils/loadedLog';
import setupGlobals from '~/common/utils/setupGlobals';
import './init-player.scss';

loadedLog('content-scripts/services/funimation-2021-09-26/init-player.ts');

setupGlobals('funimation', {
  serviceDisplayName: 'Funimation',
  getRootQuery: () => 'body',
  getVideoQuery: () => '#vjs_video_3_html5_api',
});
