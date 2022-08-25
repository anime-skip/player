import { useInterval, useIntervalFn } from '@vueuse/core';
import { SECOND } from 'common/src/utils/time';
import { onScopeDispose } from 'vue';
import { createSharedComposable } from '../composables/createSharedComposable';
import { usePlayerConfig } from '../composables/usePlayerConfig';
import { log } from '../utils/log';

interface ChangeUrlMessage {
  type: '@anime-skip/changeUrl';
  payload: string;
}
interface UnknownMessage {
  type?: 'other';
}

export const useTabUrl = createSharedComposable(function () {
  const tabUrl = ref<string>();
  const { transformServiceUrl, getUrl } = usePlayerConfig();

  onMounted(async () => {
    const initialUrl = await getUrl();

    const correctedNewUrl = transformServiceUrl(initialUrl);
    log('Initial URL: ' + correctedNewUrl);
    tabUrl.value = correctedNewUrl;
  });

  useIntervalFn(async () => {
    const oldUrl = tabUrl.value;
    const newUrl = transformServiceUrl(await getUrl());
    if (oldUrl === newUrl) return;
    log(`Change URL: ${newUrl}`);
    tabUrl.value = newUrl;
  }, SECOND);

  return tabUrl;
});
