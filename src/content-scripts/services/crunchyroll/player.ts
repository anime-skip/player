import { loadedLog } from '~/common/utils/loadedLog';
import setupGlobals from '~/common/utils/setupGlobals';
import Utils from '~/common/utils/Utils';
import './player.scss';

export function initCrunchyrollPlayer() {
  loadedLog('content-scripts/services/crunchyroll/player.ts');

  setupGlobals('crunchyroll', {
    serviceDisplayName: 'Crunchyroll',
    getRootQuery: () => 'body',
    getVideoQuery: () => 'video',
    transformServiceUrl(inputUrl) {
      // Strip and remove -XXXXXX from end of url
      return Utils.stripUrl(inputUrl).replace(/-[0-9]+$/, '');
    },
    doNotReplacePlayer() {
      // Crunchyroll has two iframes, one for preloading and one for the actual video. This skips the preloading one
      return document.body.getBoundingClientRect().width === 0;
    },
  });
}
