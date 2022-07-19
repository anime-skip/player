import { loadedLog } from '~/utils/log';
import { setupPlayerConfig } from '~/utils/setup-player-config';
import GeneralUtils from '~utils/GeneralUtils';
import { getService } from './get-service';
import './player-overrides.scss';

export function initCrunchyrollPlayer() {
  loadedLog('content-scripts/services/crunchyroll/player.ts');

  return setupPlayerConfig(getService(), {
    serviceDisplayName: 'Crunchyroll',
    onPlayDebounceMs: 100,
    getRootQuery: () => 'body',
    getVideoQuery: () => 'video',
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
