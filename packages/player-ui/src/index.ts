import ui from '@anime-skip/ui';
import { createApp } from 'vue';
import 'vue-global-api';
import FakeRouterLink from './components/FakeRouterLink.vue';
import { PlayerContainer } from './components/PlayerContainer';
import { Provider } from './components/Provider';
import { providePlayerConfig } from './composables/usePlayerConfig';
import '@anime-skip/ui/tailwind.css';
import { debug, error, log } from './utils/log';
import { ExternalPlayerConfig, mapToInternalConfig } from 'common/src/types';
import { sleep } from 'common/src/utils/time';

export function mountPlayerUi(config: ExternalPlayerConfig) {
  log('Loading Player UI', { config });

  // Initial Setup

  config.onVideoChanged(video => {
    video.controls = false;
    // video.autoplay = true;
  });

  // Prepare the body so the old player can be hidden
  document.body?.classList.add('hide-for-anime-skip', config.service);

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

    document.body?.classList.add(`as-1`);
    while (document.querySelector(rootQuery) == null) {
      debug("Player's root node not found, trying again");
      await sleep(100);
    }
    document.body?.classList.add(`as-2`);

    try {
      const container = document.createElement('div');
      const internalConfig = mapToInternalConfig(config);
      const RootComponent = Provider(() => providePlayerConfig(internalConfig), PlayerContainer);
      const app = createApp(RootComponent)
        .use(ui)
        .component('RouterLink', FakeRouterLink)
        .component('ScreenshotController', internalConfig.screenshotController);
      const mountedApp = app.mount(container);

      document.querySelector(rootQuery)?.appendChild(mountedApp.$el);

      debug(`Added player to ${rootQuery}`);
    } catch (err) {
      error('Failed to inject player UI', err);
    }
  }

  if (config.doNotReplacePlayer?.()) {
    log('Did not inject Anime Skip on purpose');
  } else {
    injectPlayer();
    // Zoro.to's player removes the body elements before mounting it's player, so we need to make
    // sure the player exists
    if (config.service === 'zoro') {
      setInterval(() => {
        const existingPlayers = document.querySelectorAll('#AnimeSkipPlayer');
        if (existingPlayers.length === 0) {
          debug('Player was removed, adding it back');
          injectPlayer();
        }
      }, 1000);
    }
  }
}
