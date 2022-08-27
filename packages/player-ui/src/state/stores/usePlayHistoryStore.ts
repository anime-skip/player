import { defineStore } from 'pinia';

export const usePlayHistoryStore = defineStore('play-history', () => {
  const hasSkippedFromZero = ref(false);
  const isInitialBuffer = ref(true);
  const playTicks = ref(0);

  function reset() {
    hasSkippedFromZero.value = false;
    isInitialBuffer.value = true;
    playTicks.value = 0;
  }

  function incrementPlayTicks() {
    playTicks.value++;
  }

  return {
    hasSkippedFromZero,
    isInitialBuffer,
    playTicks,
    reset,
    incrementPlayTicks,
  };
});
