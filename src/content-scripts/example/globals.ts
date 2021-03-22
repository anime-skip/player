import setupGlobals from '../setupGlobals';
import './style.scss';

setupGlobals('example', {
  serviceDisplayName: 'Anime Skip Example',
  getRootQuery() {
    return '.video-container';
  },
  getVideoQuery() {
    return '#video';
  },
});
