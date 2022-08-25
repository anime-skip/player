import {
  getDontShowStoreReviewPromptAgain,
  getStoreReviewPromptAt,
  setStoreReviewPromptAt,
} from '@anime-skip/player-ui/src/stores/store-review-prompt';
import Browser from 'webextension-polyfill';
import { createPlayerWebExtStorage } from '~/utils/player-web-ext-storage';
import { PlayerStorage } from '~types';
import { DAYS, SECONDS, sleep, today } from '~utils/time';

export function initStoreReviewPrompt() {
  const storage = createPlayerWebExtStorage({ disableListener: true });

  // Initialize for new users, NEEDS TO BE BEFORE FIRST AWAIT so it adds the listener synchronously
  Browser.runtime.onInstalled.addListener(async () => {
    await setStoreReviewPromptAt(storage, today() + DAYS(3));
  });

  // Initialize for existing users
  (async () => {
    const dontPrompt = await getDontShowStoreReviewPromptAgain(storage);
    if (dontPrompt) return undefined;
    const currentDate = await getStoreReviewPromptAt(storage);
    if (currentDate == null) {
      await sleep(SECONDS(10));
      await setStoreReviewPromptAt(storage, today() + DAYS(1));
    }
  })();
}
