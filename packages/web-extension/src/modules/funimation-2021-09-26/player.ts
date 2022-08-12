import { loadedLog } from '~/utils/log';
import { setupPlayerConfig } from '~/utils/setup-player-config';
import './player-overrides.scss';

export function initFunimation20210926Player() {
  loadedLog('content-scripts/services/funimation-2021-09-26/player.ts');

  return setupPlayerConfig('funimation-2021-09-26', {
    serviceDisplayName: 'Funimation',
    getRootQuery: () => 'body',
    getVideoQuery: () => '#vjs_video_3_html5_api',
  });
}
