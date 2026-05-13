import { Ref } from 'vue';

import { AmbiguousTimestamp, isTimestampEqual } from '../utils/timestamp-utils';
import { TimestampState } from '../utils/TimestampState';

export default function (timestamp: Ref<AmbiguousTimestamp>) {
  const timestamps = useApiTimestamps();

  return computed(() => {
    const existing = timestamps.value?.find((t) => t.id === timestamp.value.id);
    if (!existing) return TimestampState.New;

    if (isTimestampEqual(timestamp.value, existing))
      return TimestampState.NotChanged;

    return TimestampState.Edited;
  });
}
