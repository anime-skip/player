import isEqual from 'lodash.isequal';
import { onMounted, onUnmounted } from 'vue';
import browser, { Storage } from 'webextension-polyfill';
import { createProvideInject } from './createProvideInject';

type AreaName = 'sync' | 'local' | 'managed';

// eslint-disable-next-line @typescript-eslint/ban-types
export function createWebExtProvideInject<T extends object>(
  label: string,
  area: AreaName,
  defaultValue: T
) {
  const {
    provideValue,
    useUpdate: rawUseUpdate,
    useValue,
  } = createProvideInject(label, defaultValue);

  const useUpdate = () => {
    const value = useValue();
    const rawUpdate = rawUseUpdate();
    return async function update(newValue: Partial<T>) {
      rawUpdate(newValue);
      await browser.storage[area].set({
        [label]: { ...value, ...newValue },
      });
    };
  };

  const useInitStorageListener = () => {
    // Listen for storage changes, then update
    const update = useUpdate();
    const onChangeStorageKey = (
      changes: { [s: string]: Storage.StorageChange },
      areaName: string
    ) => {
      if (areaName !== area) return;
      if (changes[label] == null) return;
      if (isEqual(changes[label]?.oldValue, changes[label]?.newValue)) return;
      update(changes[label].newValue);
    };
    browser.storage.onChanged.addListener(onChangeStorageKey);
    onUnmounted(() => {
      browser.storage.onChanged.removeListener(onChangeStorageKey);
    });

    // Load initial storage value if present
    onMounted(() => {
      browser.storage[area].get(label).then(results => {
        if (results[label] != null) update(results[label]);
      });
    });
  };

  return {
    useInitStorageListener,
    provideValue,
    useValue,
    useUpdate,
  };
}
