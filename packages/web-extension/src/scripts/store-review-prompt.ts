import { SHOW_AT_STORAGE_KEY } from '@anime-skip/player-ui/src/stores/useReviewPromptStore';
import Browser from 'webextension-polyfill';
import { webExtStorage } from '~/utils/web-ext-storage';
import { DAYS, today } from '~utils/time';

export function initStoreReviewPrompt() {
  Browser.runtime.onInstalled.addListener(async () => {
    await webExtStorage.setItem(SHOW_AT_STORAGE_KEY, today() + DAYS(3));
  });
}
