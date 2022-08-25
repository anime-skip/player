import Browser from 'webextension-polyfill';
import { usePlayerStorage } from '../composables/usePlayerStorage';
import { DAYS, SECONDS, sleep, today } from 'common/src/utils/time';
import { debug } from '../utils/log';
import { PlayerStorage } from 'common/src/types';

const REVIEW_PROMPT_AT_KEY = 'storeReviewPromptAt';
const DONT_SHOW_AGAIN_KEY = 'dontShowStoreReviewPromptAgain';

export const getStoreReviewPromptAt = (storage: PlayerStorage) =>
  storage.getItem<number | null>(REVIEW_PROMPT_AT_KEY, null);
export const setStoreReviewPromptAt = async (storage: PlayerStorage, value: number | null) => {
  debug('Set store review prompt at:', value);
  await storage.setItem(REVIEW_PROMPT_AT_KEY, value);
};

export const getDontShowStoreReviewPromptAgain = (storage: PlayerStorage) =>
  storage.getItem<number | null>(DONT_SHOW_AGAIN_KEY, null);
export const setDontShowStoreReviewPromptAgain = (storage: PlayerStorage, value: boolean | null) =>
  storage.setItem(DONT_SHOW_AGAIN_KEY, value);

export const useStoreReviewPromptDate = () =>
  usePlayerStorage<number | null>(REVIEW_PROMPT_AT_KEY, null);
export const useDontShowStoreReviewPromptAgain = () =>
  usePlayerStorage<boolean | null>(DONT_SHOW_AGAIN_KEY, null);
