import browser from 'webextension-polyfill';
import { DAYS, today } from '~/common/utils/time';
import { useWebExtensionStorageValue } from '../hooks/useWebExtensionStorage';

const REVIEW_PROMPT_AT_KEY = 'storeReviewPromptAt';
const DONT_SHOW_AGAIN_KEY = 'dontShowStoreReviewPromptAgain';

async function getLocalStorage<T>(key: string): Promise<T | null> {
  return (await browser.storage.local.get(key))[key];
}
async function setLocalStorage<T>(key: string, value: T | null): Promise<void> {
  await browser.storage.local.set({ [key]: value });
}

export const getStoreReviewPromptAt = () => getLocalStorage<number | null>(REVIEW_PROMPT_AT_KEY);
export const setStoreReviewPromptAt = async (value: number | null) => {
  console.log('Set store review prompt at:', value);
  await setLocalStorage(REVIEW_PROMPT_AT_KEY, value);
};

export const getDontShowStoreReviewPromptAgain = () =>
  getLocalStorage<number | null>(DONT_SHOW_AGAIN_KEY);
export const setDontShowStoreReviewPromptAgain = (value: boolean | null) =>
  setLocalStorage(DONT_SHOW_AGAIN_KEY, value);

export async function initStoreReviewPrompt() {
  // If they've selected "Don't show again", stop
  if (await getDontShowStoreReviewPromptAgain()) return undefined;

  // Initialize for existing users
  const currentDate = await getStoreReviewPromptAt();
  if (currentDate == null) await setStoreReviewPromptAt(today() + DAYS(1));

  // Initialize for new users
  browser.runtime.onInstalled.addListener(async () => {
    await setStoreReviewPromptAt(today() + DAYS(3));
  });
}

export const useStoreReviewPromptDate = () =>
  useWebExtensionStorageValue<number | null>(REVIEW_PROMPT_AT_KEY, null, 'local');
export const useDontShowStoreReviewPromptAgain = () =>
  useWebExtensionStorageValue<boolean | null>(DONT_SHOW_AGAIN_KEY, null, 'local');
