import { Ref } from 'vue';
import { getTimestampAtTime } from '../utils/timestamp-utils';
import { TimestampFragment } from '../utils/api';

/**
 * Return the timestamp that the provided time is in. Assumes that the timestamps are sorted.
 */
export default function (timeInS: Ref<number>) {
  const timestamps = useCurrentTimestamps();

  return computed<TimestampFragment | undefined>(() =>
    getTimestampAtTime(timestamps.value, timeInS.value),
  );
}
