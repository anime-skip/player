import isEqual from 'lodash.isequal';
import { onMounted, onUnmounted, reactive, Ref, ref } from 'vue';
import browser, { Storage } from 'webextension-polyfill';

type PartialNulls<T> = {
  [K in keyof T]?: T[K] | null;
};

type AreaName = 'sync' | 'local' | 'managed';

/**
 * @deprecated in favor of `createWebExtProvideInject` - The reactivity of this solution was causing
 *             problems and not working all the time
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useWebExtensionStorage<T extends Record<string, any>>(
  key: string,
  initialValue: T,
  area: AreaName
) {
  const cachedValue = sessionStorage.getItem(key);
  const value = reactive(cachedValue ? JSON.parse(cachedValue) : initialValue);
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
      sessionStorage.setItem(key, JSON.stringify(newValue));
    }

    for (const field in newValue) {
      value[field] = newValue[field] ?? null;
    }
  };
  return {
    value,
    updateValue,
  };
}

export function useWebExtensionStorageValue<T>(key: string, initialValue: T, area: AreaName) {
  const value = ref<T>(initialValue) as Ref<T>;

  function onChange(changes: Record<string, Storage.StorageChange | undefined>, areaName: string) {
    if (areaName !== area || changes[key] == null) return;
    value.value = changes[key]?.newValue;
  }
  function setValue(newValue: T) {
    value.value = newValue;
    if (newValue == null) {
      browser.storage[area].remove(key);
    } else {
      browser.storage[area].set({ [key]: newValue });
    }
  }

  onMounted(() => {
    browser.storage.onChanged.addListener(onChange);
    browser.storage[area].get(key).then(res => {
      value.value = res[key];
    });
  });
  onUnmounted(() => {
    browser.storage.onChanged.removeListener(onChange);
  });

  return { value, setValue };
}
