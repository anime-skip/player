import { Ref } from 'vue';

/**
 * Return the timestamp that the provided time is in. Assumes that the timestamps are sorted.
 */
export default function (timeInS: Ref<number>) {
  const timestamps = useCurrentTimestamps();

  const timePlusFloatingPointError = computed(() => timeInS.value + 0.001);
  return computed(() =>
    timestamps.value
      ?.filter((t) => timePlusFloatingPointError.value >= t.at)
      .pop(),
  );
}
