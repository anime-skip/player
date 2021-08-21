import { onScopeDispose } from 'vue';
import { browser } from 'webextension-polyfill-ts';
import { createSharedComposable } from '~/common/hooks/createSharedComposable';

interface ChangeUrlMessage {
  type: '@anime-skip/changeUrl';
  payload: string;
}
interface UnknownMessage {
  type?: 'other';
}

export const useTabUrl = createSharedComposable(function () {
  const tabUrl = ref<string>();

  const onReceiveMessage = (message: ChangeUrlMessage | UnknownMessage) => {
    if (message.type != '@anime-skip/changeUrl') return;
    const newUrl = message.payload;

    console.log('Change URL: ' + newUrl);
    tabUrl.value = newUrl;
  };
  browser.runtime.onMessage.addListener(onReceiveMessage);
  onScopeDispose(() => {
    browser.runtime.onMessage.removeListener(onReceiveMessage);
  });

  return tabUrl;
});
