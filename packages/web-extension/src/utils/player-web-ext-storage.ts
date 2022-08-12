import Browser from 'webextension-polyfill';
import { PlayerStorage } from '~types';

export const playerWebExtStorage: PlayerStorage = {
  async getItem<T>(key: string, defaultValue: T) {
    const res = await Browser.storage.local.get(key);
    return res[key] ?? defaultValue;
  },
  async setItem<T>(key: string, newValue: T) {
    await Browser.storage.local.set({
      // Undefined values are ignored by `set`, so we use null instead
      [key]: newValue ?? null,
    });
  },
  async removeItem(key: string) {
    await Browser.storage.local.remove(key);
  },
  addItemListener<T>(key: string, cb: (newValue: T | null, oldValue: T | null) => void) {
    Browser.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local' || changes[key] == null) return;
      const { newValue, oldValue } = changes[key];
      cb(newValue ?? null, oldValue ?? null);
    });
  },
};
