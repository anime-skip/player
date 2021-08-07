import Utils from '@/common/utils/Utils';
import setupGlobals from '../setupGlobals';
import './style.scss';

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
