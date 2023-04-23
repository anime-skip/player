import { IPlayerStorage } from '../options';

export function createLocalPlayerStorage(): IPlayerStorage {
  return {
    getItem(key) {
      const res = localStorage.getItem(key);
      if (res == null) return null;
      return JSON.parse(res);
    },
    clear() {
      localStorage.clear();
    },
    removeItem(key) {
      localStorage.removeItem(key);
    },
    setItem(key, value) {
      if (value == null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    },
  };
}
