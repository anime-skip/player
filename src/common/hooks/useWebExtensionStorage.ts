import isEqual from 'lodash.isequal';
import { browser, Storage } from 'webextension-polyfill-ts';

type AreaName = 'sync' | 'local' | 'managed';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useWebExtensionStorage<T extends Record<string, any>>(
  key: string,
  initialValue: T,
  area: AreaName
) {
  const value = ref(initialValue);
  browser.storage[area].get(key).then(results => {
    const newValue = results[key];
    if (newValue == null) {
      browser.storage[area].set({ [key]: initialValue });
      value.value = initialValue;
    } else {
      value.value = newValue;
    }
  });

  // Watch for changes
  const onChangeStorageKey = (
    changes: { [s: string]: Storage.StorageChange },
    areaName: string
  ) => {
    if (areaName !== area) return;
    if (isEqual(changes[key]?.oldValue, changes[key]?.newValue)) return;
    console.log(`${key}: ${areaName} storage changed:`, { changes, area, key });

    // TODO: Put this listener in a sharedComposable so it only gets added once

    value.value = changes[key]?.newValue ?? initialValue;
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
    value.value = newValue;
    console.log(`Updated ${area} storage:`, newValue);
  };
  return {
    value,
    updateValue,
  };
}
