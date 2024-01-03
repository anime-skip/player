<script setup lang="ts">
import {
  AmbiguousTimestamp,
  isTimestampSkipped,
} from '../utils/timestamp-utils';

const allTimestamps = useCurrentTimestamps();

const { currentTime, duration } = useVideoControls();
const currentTimestampIndex = computed(() => {
  return allTimestamps.value.findLastIndex(
    (timestamp) => timestamp.at <= currentTime.value,
  );
});
const currentTimestamp = computed<AmbiguousTimestamp | undefined>(() => {
  return allTimestamps.value[currentTimestampIndex.value];
});

const currentTimestampType = useTimestampType(currentTimestamp);

const { state: prefs } = usePreferences();
const isCurrentTimestampSkipped = computed(() => {
  if (currentTimestamp.value == null) return false;
  return isTimestampSkipped(currentTimestamp.value.typeId, prefs.value, true);
});

function goToNextTimestamp() {
  const nextTimestamp = allTimestamps.value.find((timestamp) => {
    return (
      timestamp.at >= currentTime.value &&
      !isTimestampSkipped(timestamp.typeId, prefs.value, true)
    );
  });
  const goToTime = nextTimestamp?.at ?? duration.value;
  if (goToTime != null) currentTime.value = goToTime;
}

const { isEditing } = useIsEditing();
const { view } = useView();
const isVisible = computed<boolean>(() => {
  // We consider anything "close" to the end as the end. When skipping to the end of the video, it
  // doesn't always go to the end, it usually goes to within 1 to 1.5 seconds of the end. So this
  // covers that case and prevents the button from showing up after skipping to the end of the
  // video.
  const isAtEnd = Math.abs(currentTime.value - (duration.value ?? 0)) < 1.5;
  const hiddenbyView = view.value === 'account' || view.value === 'preferences';

  return (
    !!currentTimestampType.value &&
    isCurrentTimestampSkipped.value &&
    !isAtEnd &&
    !hiddenbyView
  );
});

const skipButton = ref<HTMLButtonElement>();
whenever(
  // The skip button only becomes available after it becomes visible, so we need to wait for both checks
  () => isVisible.value && skipButton.value != null,
  () => {
    if (isEditing.value) return;
    skipButton.value?.focus();
  },
);
</script>

<template>
  <button
    v-if="isVisible"
    ref="skipButton"
    class="btn btn-primary shadow-xl"
    @click.stop="goToNextTimestamp"
  >
    Skip {{ currentTimestampType?.name }}
  </button>
</template>
