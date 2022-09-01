import Browser from 'webextension-polyfill';
import { createListenerManager, PlayerStorage } from '~types';
import { webExtStorage } from './web-ext-storage';

export const createPlayerWebExtStorage = (): PlayerStorage => {
  const { removeListener, addListener, triggerListeners } = createListenerManager();
  Browser.storage.onChanged.addListener(async (changes, area) => {
    if (area !== 'local') return;
    await triggerListeners(changes);
  });

  return {
    getItem<T>(key: string, defaultValue: T) {
      return webExtStorage.getItem<T>(key).then(res => res ?? defaultValue);
    },
    setItem<T>(key: string, newValue: T) {
      return webExtStorage.setItem(key, newValue);
    },
    removeItem(key: string) {
      return webExtStorage.removeItem(key);
    },
    addChangeListener: addListener,
    removeChangeListener: removeListener,
  };
};
