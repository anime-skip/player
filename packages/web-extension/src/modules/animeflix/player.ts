import { defineWebExtPlayerConfig } from '~/utils/define-player-config';
import { loadedLog } from '~/utils/log';
import './player-overrides.scss';

export function initAnimeflixPlayer() {
  loadedLog('content-scripts/services/animeflix/player.ts');

  return defineWebExtPlayerConfig('animeflix', {
    serviceDisplayName: 'Animeflix',
    getRootQuery: () => 'body',
    getVideo: () => 'video',
  });
}
