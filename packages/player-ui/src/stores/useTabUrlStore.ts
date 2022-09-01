import { useIntervalFn } from '@vueuse/core';
import { SECOND } from 'common/src/utils/time';
import { defineStore } from 'pinia';
import { usePlayerConfig } from '../composables/usePlayerConfig';
import { log } from '../utils/log';

const CHECK_FOR_CHANGE_INTERVAL = SECOND;

export const useTabUrlStore = defineStore('tab-url', () => {
  /**
   * The tab's current URL.
   */
  const url = ref<string>();

  const { transformServiceUrl, getUrl } = usePlayerConfig();

  onMounted(async () => {
    const initialUrl = await getUrl();

    const correctedNewUrl = transformServiceUrl(initialUrl);
    log('Initial URL: ' + correctedNewUrl);
    url.value = correctedNewUrl;
  });

  async function checkForChange() {
    const oldUrl = url.value;
    const newUrl = transformServiceUrl(await getUrl());
    if (oldUrl === newUrl) return;
    log(`Change URL: ${newUrl}`);
    url.value = newUrl;
  }
  useIntervalFn(checkForChange, CHECK_FOR_CHANGE_INTERVAL);

  return {
    url,
  };
});
