import { Scalars } from '../utils/api';
import { SECOND } from '../utils/time';
import { AmbiguousTimestamp } from '../utils/timestamp-utils';

/**
 * When hovering over a timestamp in the timestamp list, it should be lifted up in the timeline so
 * it stands out. This tracks which timestamp is being hovered over.
 *
 * The ID will be automatically unset after a timeout.
 */
export default createGlobalState(() => {
  const id = ref<AmbiguousTimestamp['id']>();
  const reset = useTimeoutFn(
    () => {
      id.value = undefined;
    },
    3 * SECOND,
    { immediate: false },
  );

  return computed<AmbiguousTimestamp['id'] | undefined>({
    get: () => id.value,
    set(newId) {
      id.value = newId;
      reset.stop();
      reset.start();
    },
  });
});
