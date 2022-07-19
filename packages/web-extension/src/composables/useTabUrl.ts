import { onScopeDispose } from 'vue';
import browser from 'webextension-polyfill';
import { createSharedComposable } from '~/composables/createSharedComposable';
import { usePlayerConfig } from '~/composables/player-config';
import { log } from '~/utils/log';

interface ChangeUrlMessage {
  type: '@anime-skip/changeUrl';
  payload: string;
}
interface UnknownMessage {
  type?: 'other';
}

export const useTabUrl = createSharedComposable(function () {
  const tabUrl = ref<string>();
  const { transformServiceUrl } = usePlayerConfig();

  onMounted(async () => {
    const initialUrl = await browser.runtime.sendMessage({ type: '@anime-skip/get-url' });

    const correctedNewUrl = transformServiceUrl(initialUrl);
    log('Initial URL: ' + correctedNewUrl);
    tabUrl.value = correctedNewUrl;
  });

  const onReceiveMessage = (message: ChangeUrlMessage | UnknownMessage) => {
    if (message.type != '@anime-skip/changeUrl') return;
    const newUrl = message.payload;

    const correctedNewUrl = transformServiceUrl(newUrl);
    log('Change URL: ' + correctedNewUrl);
    tabUrl.value = correctedNewUrl;
  };
  browser.runtime.onMessage.addListener(onReceiveMessage);
  onScopeDispose(() => {
    browser.runtime.onMessage.removeListener(onReceiveMessage);
  });

  return tabUrl;
});
