import { Ref } from 'vue';

/**
 * Return the timestamp that the provided time is in. Assumes that the timestamps are sorted.
 */
export default function (timeInS: Ref<number>) {
  const timestamps = useCurrentTimestamps();

  return computed(() =>
    timestamps.value?.filter((t) => timeInS.value >= t.at).pop(),
  );
}
