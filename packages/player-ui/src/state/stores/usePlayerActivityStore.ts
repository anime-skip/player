import { useTimeoutFn } from '@vueuse/core';
import { SECOND } from 'common/src/utils/time';
import { defineStore } from 'pinia';

export const PLAYER_ACTIVITY_TIMEOUT = 3 * SECOND;

export const usePlayerActivityStore = defineStore('player-activity', () => {
  /**
   * Whether or not the user has recently interacted with the video player.
   */
  const isActive = ref(false);
  const isActiveTimeout = useTimeoutFn(() => {
    isActive.value = false;
  }, PLAYER_ACTIVITY_TIMEOUT);

  /**
   * Use to tell the player there was an interaction, and it should be considered "active" again.
   */
  function triggerActive() {
    isActiveTimeout.stop();
    isActive.value = true;
    isActiveTimeout.start();
  }

  /**
   * Tell the player to immediately treat the user as inactive, regardless of the last time
   * `triggerActive` was called.
   */
  function clearActive() {
    isActiveTimeout.stop();
    isActive.value = false;
  }

  return {
    isActive,
    triggerActive,
    clearActive,
  };
});
