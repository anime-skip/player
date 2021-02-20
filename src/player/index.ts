import { createApp } from 'vue';
import Player from './Player.vue';
import { store } from '@/common/store';
import MessengerApi from '@/common/api/MessengerApi';

import ui from '@anime-skip/ui';
import '@/common/css';

console.log('INJECTED player/index.ts');

// Setup Globals

global.Api = MessengerApi;

global.onVideoChanged(video => {
  video.controls = false;
  video.autoplay = true;
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
  const rootQuery = global.getRootQuery();
  console.debug(`Adding player to ${rootQuery}`);

  while (document.querySelector(rootQuery) == null) {
    console.debug("Player's root node not found, trying again");
    await sleep(100);
  }

  // Set the style to hide all the old elements
  document.body.classList.add('hide-for-anime-skip');

  try {
    const container = document.createElement('div');

    const app = createApp(Player).use(store).use(ui);
    const mountedApp = app.mount(container);

    document.querySelector(rootQuery)?.appendChild(mountedApp.$el);

    console.info(`Added player to ${rootQuery}`);
  } catch (err) {
    console.warn('Failed to inject player UI', err);
  }
}

if (global.doNotReplacePlayer?.()) {
  console.info('Did not inject Anime Skip on purpose');
} else {
  injectPlayer();
}
