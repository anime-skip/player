import Browser from 'webextension-polyfill';
import { PlayerStorage, PlayerStorageOnChanged } from '~types';
import { webExtStorage } from './web-ext-storage';

interface PlayerWebExtStorageConfig {
  disableListener?: true;
}

export const createPlayerWebExtStorage = (config?: PlayerWebExtStorageConfig): PlayerStorage => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listeners: Record<string, PlayerStorageOnChanged<any>[] | undefined> = {};
  if (!config?.disableListener) {
    Browser.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      Object.entries(listeners).forEach(([key, keyListeners]) => {
        if (changes[key] == null) return;
        const newValue = changes[key].newValue ?? null;
        const oldValue = changes[key].oldValue ?? null;
        keyListeners?.forEach(listener => listener(newValue, oldValue));
      });
    });
  }

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
    addChangeListener<T>(key: string, cb: PlayerStorageOnChanged<T>) {
      listeners[key] ??= [];
      listeners[key]?.push(cb);
    },
    removeChangeListener<T>(key: string, cb: PlayerStorageOnChanged<T>) {
      listeners[key] = listeners[key]?.filter(l => l !== cb);
    },
  };
};
