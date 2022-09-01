import { useTimeoutFn } from '@vueuse/core';
import { SECOND } from 'common/src/utils/time';
import { defineStore } from 'pinia';
import { debug } from '../utils/log';

export const PLAYER_ACTIVITY_TIMEOUT = 3 * SECOND;

export const useUserActivityStore = defineStore('player-activity', () => {
  /**
   * Whether or not the user has recently interacted with the video player.
   */
  const isActive = ref(false);

  /**
   * Tell the player to immediately treat the user as inactive, regardless of the last time
   * `triggerActive` was called.
   */
  function clearActive() {
    debug('[user-activity] User activity cleared');
    isActiveTimeout.stop();
    isActive.value = false;
  }
  /**
   * Use to tell the player there was an interaction, and it should be considered "active" again.
   */
  function triggerActive() {
    debug('[user-activity] User activity triggered');
    isActiveTimeout.stop();
    isActive.value = true;
    isActiveTimeout.start();
  }

  const isActiveTimeout = useTimeoutFn(clearActive, PLAYER_ACTIVITY_TIMEOUT);

  return {
    isActive: readonly(isActive),
    triggerActive,
    clearActive,
  };
});
