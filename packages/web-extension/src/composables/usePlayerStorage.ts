import isEqual from 'lodash.isequal';
import { Ref } from 'vue';
import { injectPlayerStorage } from './usePlayerConfig';

export function usePlayerStorage<T>(key: string, defaultValue: T): Ref<T> {
  const storage = injectPlayerStorage();
  const v = ref(defaultValue) as Ref<T>;

  // Restore the value from storage
  async function loadInitialValue() {
    const restoredValue = await storage.getItem<T>(key, defaultValue);
    // Only restore the value if it hasn't been changed yet
    if (isEqual(v.value, defaultValue)) v.value = restoredValue;
  }
  loadInitialValue();

  // Update persisted value when we change the ref's value via `v.value = ...`
  watch(v, async newValue => {
    if (newValue == null) await storage.removeItem(key);
    else await storage.setItem<T>(key, newValue);
  });

  // Add a storage listener and update the value when the storage changes
  storage.addItemListener<T>(key, raw => {
    const newValue = raw ?? defaultValue;
    if (!isEqual(v.value, newValue)) v.value = newValue;
  });

  return v;
}
