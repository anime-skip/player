import isEqual from 'lodash.isequal';
import { browser, Storage } from 'webextension-polyfill-ts';

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

    // TODO: Put this listener in a sharedComposable so it only gets added once

    updateValue(changes[key]?.newValue ?? initialValue);
  };
  onMounted(() => browser.storage.onChanged.addListener(onChangeStorageKey));
  onUnmounted(() => browser.storage.onChanged.removeListener(onChangeStorageKey));

  const updateValue = (newPartial: Partial<T>): void => {
    const newValue = {
      ...value.value,
      ...newPartial,
    };
    if (!isEqual(value.value, newValue)) {
      browser.storage[area].set({ [key]: newValue });
    }

    for (const field in newValue) {
      // @ts-expect-error: Bad key typing
      value[field] = newValue[field];
    }
    console.log(`Updated ${area} storage:`, newValue);
  };
  return {
    value,
    updateValue,
  };
}
