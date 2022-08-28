import { defineStore, storeToRefs } from 'pinia';
import { useTabUrlStore } from './useTabUrlStore';

export const usePlayHistoryStore = defineStore('play-history', () => {
  const hasSkippedFromZero = ref(false);
  const isInitialBuffer = ref(true);
  const playTicks = ref(0);

  function reset() {
    hasSkippedFromZero.value = false;
    isInitialBuffer.value = true;
    playTicks.value = 0;
  }

  const { url } = storeToRefs(useTabUrlStore());
  watch(url, reset);

  function incrementPlayTicks() {
    playTicks.value++;
  }

  return {
    hasSkippedFromZero,
    isInitialBuffer,
    playTicks,
    incrementPlayTicks,
  };
});
