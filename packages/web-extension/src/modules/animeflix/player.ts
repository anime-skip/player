import { defineWebExtPlayerConfig } from '~/utils/define-player-config';
import { loadedLog } from '~/utils/log';
import './player-overrides.scss';

export function initAnimeflixPlayer() {
  loadedLog('content-scripts/services/animeflix/player.ts');

  const getVideo = () => '#plyr';
  const getRootQuery = () => '#root';
  const delayMountingUntil = () => {
    const video = document.querySelector<HTMLVideoElement>(getVideo());
    return !!video && video.duration > 0;
  };

  removePlayerOnUrlChange();

  return defineWebExtPlayerConfig('animeflix', {
    serviceDisplayName: 'Animeflix',
    getRootQuery,
    getVideo,
    delayMountingUntil,
  });
}

/**
 * Because we inject the player outside the regular player element, and since it's a SPA, the player
 * isn't automatically removed. Instead, remove it manually.
 */
function removePlayerOnUrlChange() {
  const url = window.location.href;
  const interval = setInterval(() => {
    if (window.location.href === url) return;

    document.querySelectorAll('.anime-skip-scope').forEach(el => el.remove());
    clearInterval(interval);
  }, 500);
}
