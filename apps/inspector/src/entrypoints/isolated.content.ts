import { LocalNetworkRequest } from '@/utils/network-repo';

export default defineContentScript({
  matches: ['*://*/*'],
  runAt: 'document_start',
  allFrames: true,
  world: 'ISOLATED',

  main(ctx) {
    // @ts-expect-error: Custome event
    ctx.addEventListener(window, 'inspector:networkrequest', (event) => {
      const request: LocalNetworkRequest = (event as CustomEvent).detail;
      messaging.sendMessage('saveNetworkRequest', request);
    });
  },
});
