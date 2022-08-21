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
  const { addListener, removeListener } = createListenerManager();
  // TODO: listen

  return {
    getItem(key, defaultValue) {
      return JSON.parse(localStorage.getItem(key) ?? '{}').value ?? defaultValue;
    },
    setItem(key, newValue) {
      localStorage.setItem(key, JSON.stringify({ value: newValue }));
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
