import { loadedLog } from '~/common/utils/log';
import setupGlobals from '~/common/utils/setupGlobals';
import './player-overrides.scss';

export function initWakanimPlayer() {
  loadedLog('content-scripts/services/wakanim/player.ts');

  setupGlobals('wakanim', {
    serviceDisplayName: 'Wakanim',
    getRootQuery: () => '#jwplayer-container',
    getVideoQuery: () => 'video.jw-video',
  });
}
