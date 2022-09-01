import { onMessage, sendMessage } from '~/utils/web-ext-bridge';
import Browser from 'webextension-polyfill';
import { getPopupUrl } from '~/utils/extension-pages';
import { loadedLog } from '~/utils/log';

export function initMessenger() {
  loadedLog('background/messenger.ts');

  onMessage('@anime-skip/open-all-settings', () => Browser.runtime.openOptionsPage());
  onMessage('@anime-skip/open-login', async () => {
    await Browser.tabs.create({ url: getPopupUrl({ closeAfterLogin: true }) });
  });
  onMessage('@anime-skip/get-url', ({ sender }) => {
    if (sender.tab?.url) return sender.tab?.url;
    throw Error('Tab did not have a URL: ' + JSON.stringify(sender.tab));
  });
  onMessage('@anime-skip/inferEpisodeInfo', ({ sender, data }) =>
    // Send this message back to the content script, and return the result
    // TODO: instead of sending this iframe->background->top_frame, just send it from iframe->top_frame
    sendMessage('@anime-skip/inferEpisodeInfo', data, sender.tab?.id)
  );
}
