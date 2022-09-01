import isEqual from 'lodash.isequal';

export type PlayerStorageOnChanged<T> = (newValue: T | null, oldValue: T | null) => void;

export interface PlayerStorage {
  getItem<T>(key: string, defaultValue: T): Promise<T> | T;
  setItem<T>(key: string, newValue: T): Promise<void> | void;
  removeItem(key: string): void | Promise<void>;
  addChangeListener<T>(key: string, cb: PlayerStorageOnChanged<T>): void;
  removeChangeListener<T>(key: string, cb: PlayerStorageOnChanged<T>): void;
}

/**
 * A player storage backed by `localStorage`
 */
export function createPlayerLocalStorage(): PlayerStorage {
  const { addListener, removeListener, triggerListeners } = createListenerManager();
  const getJsonValueOrNull = (jsonString: string | null): any | null => {
    if (!jsonString) return null;
    return JSON.parse(jsonString)?.value;
  };

  window.addEventListener('storage', async e => {
    if (e.storageArea !== localStorage) return;
    if (e.key === null) return;

    await triggerListeners({
      [e.key]: {
        oldValue: getJsonValueOrNull(e.oldValue),
        newValue: getJsonValueOrNull(e.newValue),
      },
    });
  });

  return {
    getItem(key, defaultValue) {
      return getJsonValueOrNull(localStorage.getItem(key)) ?? defaultValue;
    },
    setItem(key, newValue) {
      const oldValue = getJsonValueOrNull(localStorage.getItem(key));
      if (isEqual(newValue, oldValue)) return;
      localStorage.setItem(key, JSON.stringify({ value: newValue }));
      // Trigger the storage event for this window so everything updates on the current tab as well
      // as other tabs - by default, storage change events are only dispatched on other tabs.
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: key,
          newValue: JSON.stringify({ value: newValue }),
          oldValue: JSON.stringify({ value: oldValue }),
          storageArea: localStorage,
        })
      );
    },
    removeItem(key) {
      localStorage.removeItem(key);
    },
    addChangeListener: addListener,
    removeChangeListener: removeListener,
  };
}

export function createListenerManager() {
  const listeners: Record<string, PlayerStorageOnChanged<any>[] | undefined> = {};
  return {
    async triggerListeners(changes: Record<string, { newValue?: any; oldValue?: any }>) {
      for (const [key, keyListeners] of Object.entries(listeners)) {
        if (changes[key] == null) continue;
        const newValue = changes[key].newValue ?? null;
        const oldValue = changes[key].oldValue ?? null;
        for (const listener of keyListeners ?? []) {
          await listener(newValue, oldValue);
        }
      }
    },
    addListener(key: string, cb: PlayerStorageOnChanged<any>) {
      listeners[key] ??= [];
      listeners[key]?.push(cb);
    },
    removeListener(key: string, cb: PlayerStorageOnChanged<any>) {
      listeners[key] = listeners[key]?.filter(l => l !== cb);
    },
  };
}
