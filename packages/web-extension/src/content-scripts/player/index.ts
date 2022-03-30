import ui from '@anime-skip/ui';
import { createApp } from 'vue';
import 'vue-global-api';
import FakeRouterLink from '~/common/components/FakeRouterLink.vue';
import { Provider } from '~/common/components/Provider';
import '~/common/styles';
import { centerFitVideoBounds, fallbackBound } from '~/common/utils/drawing';
import { debug, loadedLog, log, warn } from '~/common/utils/log';
import Messenger from '~/common/utils/Messenger';
import { sleep } from '~/common/utils/time';
import { IPlayerConfig, providePlayerConfig } from './composition/player-config';
import { Container } from './Container';
import './themes.scss';

// TODO git mv to player-ui
export function loadPlayerUi(config: IPlayerConfig) {
  loadedLog('content-scripts/player-ui/index.ts');

  // Initial Setup

  config.onVideoChanged(video => {
    video.controls = false;
    // video.autoplay = true;
  });

  // Prepare the body so the old player can be hidden
  document.body?.classList.add('hide-for-anime-skip', config.service);

  // TODO: Move this... elsewhere
  new Messenger(`${config.service} player messenger`, {
    // Get the bounds, then center fit the video
    '@anime-skip/player-screenshot-details': async () => {
      const video = config.getVideo?.();

      const boundingRect = video?.getBoundingClientRect();
      const elementBounds = {
        height: fallbackBound(boundingRect?.height),
        left: fallbackBound(boundingRect?.left),
        top: fallbackBound(boundingRect?.top),
        width: fallbackBound(boundingRect?.width),
      };
      const videoWidth = fallbackBound(video?.videoWidth, 1);
      const videoHeight = fallbackBound(video?.videoHeight, 1);
      return centerFitVideoBounds(elementBounds, videoWidth, videoHeight);
    },
  });

  // Clean DOM

  const existingPlayers = document.querySelectorAll('#AnimeSkipPlayer');
  if (existingPlayers.length > 0) {
    debug('Player already added, removing');
    existingPlayers.forEach(player => player.remove());
  }

  // Inject DOM

  async function injectPlayer() {
    const rootQuery = config.getRootQuery();
    debug(`Adding player to ${rootQuery}`);

    while (document.querySelector(rootQuery) == null) {
      debug("Player's root node not found, trying again");
      await sleep(100);
    }

    try {
      const container = document.createElement('div');

      const RootComponent = Provider(() => providePlayerConfig(config), Container);
      const app = createApp(RootComponent).use(ui).component('RouterLink', FakeRouterLink);
      const mountedApp = app.mount(container);

      document.querySelector(rootQuery)?.appendChild(mountedApp.$el);

      debug(`Added player to ${rootQuery}`);
    } catch (err) {
      warn('Failed to inject player UI', err);
    }
  }

  if (config.doNotReplacePlayer?.()) {
    log('Did not inject Anime Skip on purpose');
  } else {
    injectPlayer();
  }
}
