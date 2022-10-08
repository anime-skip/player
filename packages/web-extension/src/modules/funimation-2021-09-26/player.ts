import { defineWebExtPlayerConfig } from '~/utils/define-player-config';
import { loadedLog } from '~/utils/log';
import './player-overrides.scss';

export function initFunimation20210926Player() {
  loadedLog('content-scripts/services/funimation-2021-09-26/player.ts');

  const getVideo = () => '#vjs_video_3_html5_api';

  return defineWebExtPlayerConfig('funimation-2021-09-26', {
    serviceDisplayName: 'Funimation',
    getRootQuery: () => 'body',
    getVideo,
    async delayMountingUntil() {
      return !!document.querySelector(getVideo());
    },
  });
}
