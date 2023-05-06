import { TimestampState } from '../utils/TimestampState';
import { AmbiguousTimestamp } from '../utils/timestamp-utils';
import { Ref } from 'vue';

export default function (timestamp: Ref<AmbiguousTimestamp>) {
  const timestamps = useApiTimestamps();

  return computed(() => {
    const existing = timestamps.value?.find((t) => t.id === timestamp.value.id);
    if (!existing) return TimestampState.New;

    if (
      timestamp.value.at !== existing.at ||
      timestamp.value.typeId !== existing.typeId ||
      timestamp.value.source !== existing.source
    )
      return TimestampState.Edited;

    return TimestampState.NotChanged;
  });
}
