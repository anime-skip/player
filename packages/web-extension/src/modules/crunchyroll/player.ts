import { loadedLog } from '~/utils/log';
import { defineWebExtPlayerConfig } from '~/utils/define-player-config';
import GeneralUtils from '~utils/GeneralUtils';
import { getService } from './get-service';
import './player-overrides.scss';

export function initCrunchyrollPlayer() {
  loadedLog('content-scripts/services/crunchyroll/player.ts');

  return defineWebExtPlayerConfig(getService(), {
    serviceDisplayName: 'Crunchyroll',
    onPlayDebounceMs: 100,
    getRootQuery: () => 'body',
    getVideo: () => 'video',
    transformServiceUrl(inputUrl) {
      // Strip and remove -XXXXXX from end of url
      return GeneralUtils.stripUrl(inputUrl).replace(/-[0-9]+$/, '');
    },
    doNotReplacePlayer() {
      // Crunchyroll has two iframes, one for preloading and one for the actual video. This skips
      // the preloading one
      return document.body.getBoundingClientRect().width === 0;
    },
  });
}
