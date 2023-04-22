import { TypedStorageProperty } from '../utils/createTypedStorage';

export default function <T>(property: TypedStorageProperty<T>) {
  const { state, isLoading, isReady } = useAsyncState(property.get(), null);

  const value = computed({
    get() {
      return state.value;
    },
    set(v) {
      state.value = v;
      // @ts-expect-error: doesn't like "| null", but it's OK to set it for all fields.
      void property.set(v).catch(console.error);
    },
  });

  return {
    value,
    isLoading,
    isReady,
  };
}
