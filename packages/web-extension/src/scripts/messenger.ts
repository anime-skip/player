import Browser from 'webextension-polyfill';
import { getPopupUrl } from '~/utils/extension-pages';
import { loadedLog } from '~/utils/log';
import Messenger from '~/utils/Messenger';

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
        await Browser.runtime.openOptionsPage();
      },
      '@anime-skip/open-login': async () => {
        await Browser.tabs.create({ url: getPopupUrl({ closeAfterLogin: true }) });
      },
      '@anime-skip/get-url': async (_, sender) => {
        return sender.tab?.url;
      },
    },
    ['@anime-skip/inferEpisodeInfo']
  );
}
