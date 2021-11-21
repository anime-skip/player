import ui from '@anime-skip/ui';
import { createApp } from 'vue';
import 'vue-global-api';
import FakeRouterLink from '~/common/components/FakeRouterLink.vue';
import '~/common/styles';
import { loadedLog } from '~/common/utils/loadedLog';
import Container from './Container.vue';

// TODO git mv to player-ui
export function loadPlayerUi() {
  loadedLog('content-scripts/player-ui/index.ts');

  // Setup Globals

  window.onVideoChanged(video => {
    video.controls = false;
    // video.autoplay = true;
  });

  // Clean DOM

  const existingPlayers = document.querySelectorAll('#AnimeSkipPlayer');
  if (existingPlayers.length > 0) {
    console.debug('Player already added, removing');
    existingPlayers.forEach(player => {
      player.remove();
    });
  }

  async function sleep(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
  }

  // Inject DOM

  async function injectPlayer() {
    const rootQuery = window.getRootQuery();
    console.debug(`Adding player to ${rootQuery}`);

    while (document.querySelector(rootQuery) == null) {
      console.debug("Player's root node not found, trying again");
      await sleep(100);
    }

    // Set the style to hide all the old elements
    document.body.classList.add('hide-for-anime-skip');

    try {
      const container = document.createElement('div');

      const app = createApp(Container).use(ui).component('RouterLink', FakeRouterLink);
      const mountedApp = app.mount(container);

      document.querySelector(rootQuery)?.appendChild(mountedApp.$el);

      console.log(`Added player to ${rootQuery}`);
    } catch (err) {
      console.warn('Failed to inject player UI', err);
    }
  }

  if (window.doNotReplacePlayer?.()) {
    console.log('Did not inject Anime Skip on purpose');
  } else {
    injectPlayer();
  }
}
