import { SECOND } from '../utils/time';

export default createGlobalState(() => {
  const url = ref<string>();

  const clearPreview = useTimeoutFn(
    () => {
      url.value = undefined;
    },
    10 * SECOND,
    {
      immediate: false,
    },
  );

  return computed({
    get() {
      return url.value;
    },
    set(newValue) {
      if (newValue) clearPreview.start();
      url.value = newValue;
    },
  });
});
