import ui from '@anime-skip/ui';
import { createApp } from 'vue';
import 'vue-global-api';
import '~/assets/themes.scss';
import FakeRouterLink from '~/components/FakeRouterLink.vue';
import { PlayerContainer } from '~/components/PlayerContainer';
import { Provider } from '~/components/Provider';
import { providePlayerConfig } from '~/composables/usePlayerConfig';
import '~/styles';
import { debug, log, warn } from '~/utils/log';
import { createPlayerWebExtStorage } from '~/utils/player-web-ext-storage';
import { ExternalPlayerConfig, InternalPlayerConfig } from '~types';
import GeneralUtils from '~utils/GeneralUtils';
import { sleep } from '~utils/time';

function mapExternalConfig(config: ExternalPlayerConfig): InternalPlayerConfig {
  return {
    ...config,
    onPlayDebounceMs: config.onPlayDebounceMs ?? 0,
    transformServiceUrl: config.transformServiceUrl ?? GeneralUtils.stripUrl,
    storage: createPlayerWebExtStorage(),
  };
}

// TODO git mv to player-ui
export function loadPlayerUi(config: ExternalPlayerConfig) {
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

    while (document.querySelector(rootQuery) == null) {
      debug("Player's root node not found, trying again");
      await sleep(100);
    }

    try {
      const container = document.createElement('div');
      const internalConfig = mapExternalConfig(config);
      const RootComponent = Provider(() => providePlayerConfig(internalConfig), PlayerContainer);
      const app = createApp(RootComponent)
        .use(ui)
        .component('RouterLink', FakeRouterLink)
        .component('ScreenshotControllerImplementation', internalConfig.screenshotController);
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
