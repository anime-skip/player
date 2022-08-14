import Browser from 'webextension-polyfill';
import { usePlayerStorage } from '~/composables/usePlayerStorage';
import { webExtStorage } from '~/utils/web-ext-storage';
import { DAYS, SECONDS, sleep, today } from '~utils/time';
import { debug } from '../utils/log';

const REVIEW_PROMPT_AT_KEY = 'storeReviewPromptAt';
const DONT_SHOW_AGAIN_KEY = 'dontShowStoreReviewPromptAgain';

export const getStoreReviewPromptAt = () =>
  webExtStorage.getItem<number | null>(REVIEW_PROMPT_AT_KEY);
export const setStoreReviewPromptAt = async (value: number | null) => {
  debug('Set store review prompt at:', value);
  await webExtStorage.setItem(REVIEW_PROMPT_AT_KEY, value);
};

export const getDontShowStoreReviewPromptAgain = () =>
  webExtStorage.getItem<number | null>(DONT_SHOW_AGAIN_KEY);
export const setDontShowStoreReviewPromptAgain = (value: boolean | null) =>
  webExtStorage.setItem(DONT_SHOW_AGAIN_KEY, value);

export function initStoreReviewPrompt() {
  // Initialize for new users, NEEDS TO BE BEFORE FIRST AWAIT so it adds the listener synchronously
  Browser.runtime.onInstalled.addListener(async () => {
    await setStoreReviewPromptAt(today() + DAYS(3));
  });

  // Initialize for existing users
  getDontShowStoreReviewPromptAgain().then(async dontPrompt => {
    if (dontPrompt) return undefined;
    const currentDate = await getStoreReviewPromptAt();
    if (currentDate == null) {
      await sleep(SECONDS(10));
      await setStoreReviewPromptAt(today() + DAYS(1));
    }
  });
}

export const useStoreReviewPromptDate = () =>
  usePlayerStorage<number | null>(REVIEW_PROMPT_AT_KEY, null);
export const useDontShowStoreReviewPromptAgain = () =>
  usePlayerStorage<boolean | null>(DONT_SHOW_AGAIN_KEY, null);
