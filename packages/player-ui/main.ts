import '@anime-skip/ui/tailwind.css';
import { createPlayerLocalStorage } from 'common/src/types';
import { mountPlayerUi } from './src';
import NoopScreenshotController from './src/components/NoopScreenshotController.vue';

const noop = () => {};
const asyncNoop = async () => {};

mountPlayerUi({
  getRootQuery: () => '#video-player',
  getUrl: () => location.href,
  getVideo() {
    const video = document.querySelector('video');
    if (video == null) throw Error('Could not find video in DOM');
    return video;
  },
  crawlEpisodeInfo: async () => ({
    show: 'Sword Art Online',
    name: 'Pilot',
    season: '1',
    number: '2',
    absoluteNumber: '3',
  }),
  onVideoChanged: noop,
  openAllSettings: noop,
  service: 'test',
  serviceDisplayName: 'Player UI Test',
  storage: createPlayerLocalStorage(),
  screenshotController: NoopScreenshotController,
  usageClient: {
    getUserId: () => 'test',
    saveEvent: asyncNoop,
  },
  apiClientId: 'OB3AfF3fZg9XlZhxtLvhwLhDcevslhnr',
  apiEnv: 'prod',
  addKeyDownListener: l => document.addEventListener('keydown', l),
  removeKeyDownListener: l => document.removeEventListener('keydown', l),
});
