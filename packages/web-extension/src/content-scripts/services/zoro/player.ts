import { loadedLog } from '~/common/utils/log';
import { setupPlayerConfig } from '~/common/utils/setup-player-config';
import './player-overrides.scss';

export function setupZoroPlayer() {
  loadedLog('content-scripts/services/zoro/player.ts');

  return setupPlayerConfig('zoro', {
    serviceDisplayName: 'Zoro.to',
    getRootQuery: () => '#vidcloud-player',
    getVideoQuery: () => 'video',
  });
}
