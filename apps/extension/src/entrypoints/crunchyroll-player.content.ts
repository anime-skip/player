import '~/assets/crunchyroll-player.scss';
import { ColorTheme } from '@anime-skip/player';

import { defineSpaContentScript } from '@/utils/define-spa-content-script';

const PLAYER_SELECTOR = '#player-container';
const VIDEO_SELECTOR = 'video';

export default defineSpaContentScript({
  matches: ['*://www.crunchyroll.com/watch/*'],
  async main(ctx) {
    // Need to wait for both the player wrapper and video element, the video
    // element is rendered last, so we wait for that.
    await waitUntil(
      () => Promise.resolve(!!document.querySelector(VIDEO_SELECTOR)),
      Infinity,
      1,
      100,
    );

    // Load player
    initExtensionPlayer({
      ctx,
      serviceName: 'Crunchyroll',
      serviceTheme: ColorTheme.CrunchyrollOrange,
      parentElement: PLAYER_SELECTOR,
      fullscreenElement: PLAYER_SELECTOR,
    });
  },
});
