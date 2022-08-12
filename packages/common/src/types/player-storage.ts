export interface PlayerStorage {
  getItem<T>(key: string, defaultValue: T): Promise<T> | T;
  setItem<T>(key: string, newValue: T): Promise<void> | void;
  removeItem(key: string): void | Promise<void>;
  addItemListener<T>(key: string, cb: (newValue: T | null, oldValue: T | null) => void): void;
}

/**
 * A player storage backed by `localStorage`
 */
export const playerLocalStorage: PlayerStorage = {
  getItem(key, defaultValue) {
    return JSON.parse(localStorage.getItem(key) ?? '{}').value ?? defaultValue;
  },
  setItem(key, newValue) {
    localStorage.setItem(key, JSON.stringify({ value: newValue }));
  },
  removeItem(key) {
    localStorage.removeItem(key);
  },
  addItemListener(key, cb) {
    // TODO: use the storage event to implement the listener
    throw Error('Not implemented');
  },
};
