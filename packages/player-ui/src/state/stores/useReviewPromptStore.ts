import { DAY } from 'common/src/utils/time';
import { defineStore } from 'pinia';
import { usePlayerConfig } from '../../composables/usePlayerConfig';
import { usePlayerStorage } from '../../composables/usePlayerStorage';

const SHOW_AT_STORAGE_KEY = 'storeReviewPromptAt';
const PROMPT_COUNT_STORAGE_KEY = 'prompt-count';

const BASE_BACKOFF = 2 * DAY;

export const useReviewPromptStore = defineStore('review-prompt', () => {
  const { storage } = usePlayerConfig();
  const showAt = usePlayerStorage<number>(SHOW_AT_STORAGE_KEY, Infinity);
  const promptCount = usePlayerStorage<number>(PROMPT_COUNT_STORAGE_KEY, 0);

  // Purposefully not reactive!
  // This should be set when the player is opened (ie: when this store is created!). No need to
  // perfectly show the prompt down to the exact second
  const now = Date.now();

  return {
    shouldShow: computed(() => now >= showAt.value),
    /**
     * Apply an exponential backoff.
     */
    async showAgainInFuture() {
      const newPromptCount = promptCount.value + 1;
      await storage.setItem(PROMPT_COUNT_STORAGE_KEY, newPromptCount);
      await storage.setItem(SHOW_AT_STORAGE_KEY, now + Math.pow(BASE_BACKOFF, newPromptCount));
    },
  };
});
