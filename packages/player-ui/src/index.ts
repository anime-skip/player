import ui from '@anime-skip/ui';
import { createApp } from 'vue';
import 'vue-global-api';
import FakeRouterLink from './components/FakeRouterLink.vue';
import { PlayerContainer } from './components/PlayerContainer';
import { Provider } from './components/Provider';
import { providePlayerConfig } from './composables/usePlayerConfig';
import '@anime-skip/ui/tailwind.css';
import { debug, error, log } from './utils/log';
import { ExternalPlayerConfig, InternalPlayerConfig, mapToInternalConfig } from 'common/src/types';
import { sleep } from 'common/src/utils/time';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from 'vue-query';
import TestComp from './TestComp.vue';
import { provideApiClient } from './composables/useApiClient';

const RootComponent = (config: InternalPlayerConfig) =>
  Provider(
    () => providePlayerConfig(config),
    Provider(() => provideApiClient(config), PlayerContainer)
  );

export function mountPlayerUi(config: ExternalPlayerConfig) {
  log('Loading Player UI', { config });
  void config.usageClient.saveEvent('player_injected');

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

    while (document.querySelector(rootQuery) == null) {
      debug("Player's root node not found, trying again");
      await sleep(100);
    }

    try {
      const container = document.createElement('div');
      const internalConfig = mapToInternalConfig(config);
      const app = createApp(RootComponent(internalConfig))
        .use(ui)
        .use(createPinia())
        .use(VueQueryPlugin)
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
  }
}
