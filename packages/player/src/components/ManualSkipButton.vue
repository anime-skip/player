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
const isVisible = computed<boolean>(() => {
  const isAtEnd = Math.abs(currentTime.value - (duration.value ?? 0)) < 0.1;
  return (
    !!currentTimestampType.value && isCurrentTimestampSkipped.value && !isAtEnd
  );
});

const button = ref<HTMLButtonElement>();
watch(isVisible, (isVisible) => {
  if (isVisible && !isEditing.value) {
    console.log('Focusing on skip button');
    button.value?.focus();
  }
});
</script>

<template>
  <button
    v-if="isVisible"
    ref="button"
    class="btn btn-primary"
    @click.stop="goToNextTimestamp"
  >
    Skip {{ currentTimestampType?.name }}
  </button>
</template>
