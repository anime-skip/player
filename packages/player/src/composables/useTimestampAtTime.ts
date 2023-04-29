import { Ref } from 'vue';
import {
  AmbiguousTimestamp,
  getTimestampAtTime,
} from '../utils/timestamp-utils';

/**
 * Return the timestamp that the provided time is in. Assumes that the timestamps are sorted.
 */
export default function (timeInS: Ref<number>) {
  const timestamps = useCurrentTimestamps();

  return computed<AmbiguousTimestamp | undefined>(() =>
    getTimestampAtTime(timestamps.value, timeInS.value),
  );
}
