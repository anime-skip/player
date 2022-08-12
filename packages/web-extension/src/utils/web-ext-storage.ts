import isEqual from 'lodash.isequal';
import Browser from 'webextension-polyfill';

export type AreaName = 'sync' | 'local' | 'managed';

/**
 * The `chrome.storage` APIs aren't nice to use in code, so this is a wrapper that makes it more
 * similar to `localStorage` and `sessionStorage`.
 */
export const webExtStorage = {
  getItem<T>(key: string, area: AreaName = 'local'): Promise<T | null> {
    return Browser.storage[area].get(key).then(res => res[key]);
  },

  async setItem<T>(key: string, newValue: T | null, area: AreaName = 'local'): Promise<void> {
    const oldValue = await this.getItem(key, area);
    if (isEqual(oldValue, newValue)) return;
    await Browser.storage[area].set({ [key]: newValue ?? null });
  },

  removeItem(key: string, area: AreaName = 'local'): Promise<void> {
    return Browser.storage[area].remove(key);
  },
};
