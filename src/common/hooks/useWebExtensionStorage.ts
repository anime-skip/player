import isEqual from 'lodash.isequal';
import { browser, Storage } from 'webextension-polyfill-ts';

type PartialNulls<T> = {
  [K in keyof T]?: T[K] | null;
};

type AreaName = 'sync' | 'local' | 'managed';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useWebExtensionStorage<T extends Record<string, any>>(
  key: string,
  initialValue: T,
  area: AreaName
) {
  const value = reactive(initialValue);
  browser.storage[area].get(key).then(results => {
    const newValue = results[key];
    if (newValue == null) {
      browser.storage[area].set({ [key]: initialValue });
      updateValue(initialValue);
    } else {
      updateValue(newValue);
    }
  });

  // Watch for changes
  const onChangeStorageKey = (
    changes: { [s: string]: Storage.StorageChange },
    areaName: string
  ) => {
    if (areaName !== area) return;
    if (isEqual(changes[key]?.oldValue, changes[key]?.newValue)) return;
    const currentValue = JSON.parse(JSON.stringify(value));
    if (isEqual(currentValue, changes[key].newValue)) return;

    // TODO: Put this listener in a sharedComposable so it only gets added once

    updateValue(changes[key]?.newValue ?? initialValue);
  };
  onMounted(() => browser.storage.onChanged.addListener(onChangeStorageKey));
  onUnmounted(() => browser.storage.onChanged.removeListener(onChangeStorageKey));

  const updateValue = (newPartial: PartialNulls<T>): void => {
    const newValue = {
      ...value,
      ...newPartial,
    };
    if (!isEqual(value, newValue)) {
      browser.storage[area].set({ [key]: newValue });
    }

    for (const field in newValue) {
      // @ts-expect-error: Bad key typing, null is required to maintain reactivity in chrome
      value[field] = newValue[field] ?? null;
    }
  };
  return {
    value,
    updateValue,
  };
}
