import '~/assets/crunchyroll-player.scss';
import { ColorTheme } from '@anime-skip/player';

export default defineContentScript({
  matches: ['*://static.crunchyroll.com/vilos-v2/web/vilos/player.html*'],
  allFrames: true,
  main(ctx) {
    // Load player
    initExtensionPlayer({
      ctx,
      serviceName: 'Crunchyroll',
      serviceTheme: ColorTheme.CrunchyrollOrange,
      parentElement: 'body',
      fullscreenElement: 'body',
      // Strip and remove -XXXXXX from end of url
      transformServiceUrl(inputUrl) {
        return stripUrl(inputUrl).replace(/-[0-9]+$/, '');
      },
      // Crunchyroll has two iframes, one for preloading and one for the actual video. This skips
      // the preloading one
      isDisabled() {
        return document.body.getBoundingClientRect().width === 0;
      },
    });
  },
});
