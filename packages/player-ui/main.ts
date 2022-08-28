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
  crawlEpisodeInfo: async () => ({}),
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
  apiEnv: import.meta.env.VITE_API_ENV ?? 'local',
  addKeyDownListener: l => document.addEventListener('keydown', l),
  removeKeyDownListener: l => document.removeEventListener('keydown', l),
});
