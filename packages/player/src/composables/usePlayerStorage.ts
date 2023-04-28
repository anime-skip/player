import { TypedStorageProperty } from '../utils/createTypedStorage';
import { StorageChangedEvent } from '../utils/StorageChangedEvent';
import useCustomEventListener from './useCustomEventListener';

export default function <T>(property: TypedStorageProperty<T>) {
  const { state, isLoading, isReady } = useAsyncState(property.get(), null);

  useCustomEventListener(
    StorageChangedEvent.TYPE,
    (event: StorageChangedEvent) => {
      if (event.detail.key !== property.key) return;

      state.value = event.detail.newValue;
    },
  );

  const value = computed({
    get() {
      return state.value;
    },
    set(newValue) {
      const oldValue = state.value;
      state.value = newValue;

      // Send value change event
      window.dispatchEvent(
        new StorageChangedEvent({ key: property.key, oldValue, newValue }),
      );

      // Update value in storage
      // @ts-expect-error: doesn't like "| null", but it's OK to set it for all fields.
      void property.set(newValue).catch(console.error);
    },
  });

  return {
    state: value,
    isLoading,
    isReady,
  };
}
