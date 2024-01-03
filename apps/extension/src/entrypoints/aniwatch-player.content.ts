import '~/assets/jw-player.scss';

export default defineContentScript({
  matches: [
    // Retrived via apps/inspector
    // Examples:
    // - https://megacloud.tv/embed-2/e-1/OVM4QTgB18a4?k=1&autoPlay=1&oa=0&asi=1
    // - https://megacloud.tv/embed-2/e-1/2iHWoHyPKAY2?k=1&autoPlay=1&oa=0&asi=1
    '*://megacloud.tv/e/embed-*',
    // Examples:
    // - https://watchsb.com/e/15z19moxnzmq.html
    // - https://watchsb.com/e/pqmqgo3k43yn.html
    '*://watchsb.com/e/*',
  ],
  allFrames: true,

  async main(ctx) {
    // Sometimes it takes a really long time to load the video element
    await waitUntil(
      () => Promise.resolve(!!document.querySelector('video')),
      Infinity,
      1,
      100,
    );

    // Load player
    initExtensionPlayer({
      ctx,
      serviceName: 'Aniwatch',
      parentElement: 'body',
    });
  },
});
