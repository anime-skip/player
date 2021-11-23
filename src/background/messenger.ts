import browser from 'webextension-polyfill';
import { loadedLog } from '~/common/utils/log';
import Messenger from '~/common/utils/Messenger';

export function initMessenger() {
  loadedLog('background/messenger.ts');

  new Messenger<
    RuntimeMessageTypes,
    RuntimeMessageListenerMap,
    RuntimeMessagePayloadMap,
    RuntimeMessageResponseMap
  >(
    'background-messenger',
    {
      '@anime-skip/open-all-settings': async () => {
        await browser.runtime.openOptionsPage();
      },
      '@anime-skip/open-login': async () => {
        await browser.tabs.create({ url: 'popup/index.html?closeAfterLogin=true' });
      },
      '@anime-skip/get-url': async (_, sender) => {
        return sender.tab?.url;
      },
    },
    ['@anime-skip/inferEpisodeInfo']
  );
}
