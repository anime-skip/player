import { loadedLog } from '~/common/utils/loadedLog';
import setupGlobals from '~/common/utils/setupGlobals';
import Utils from '~/common/utils/Utils';
import './init-player.css';

loadedLog('content-scripts/services/crunchyroll/init-player.ts');

setupGlobals('crunchyroll', {
  serviceDisplayName: 'Crunchyroll',
  getRootQuery() {
    return 'body';
  },
  getVideoQuery() {
    return 'video';
  },
  transformServiceUrl(inputUrl) {
    // Strip and remove -XXXXXX from end of url
    return Utils.stripUrl(inputUrl).replace(/-[0-9]+$/, '');
  },
});
