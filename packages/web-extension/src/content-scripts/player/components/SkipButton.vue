<template>
  <Transition>
    <flat-button v-if="showSkipButton" @click.stop="skip">
      <span class="as-mr-2 as-text-on-primary">Skip {{ currentTimestampTitle }}</span>
      <svg viewBox="5 5 16 16" class="as-inline-block as-w-4 as-fill-on-primary">
        <path d="M4 18L12.5 12L4 6V18ZM13 6V18L21.5 12L13 6Z" />
      </svg>
    </flat-button>
  </Transition>
</template>

<script lang="ts" setup>
import { useGeneralPreferences } from '~/common/state/useGeneralPreferences';
import { TIMESTAMP_TYPES } from '~/common/utils/constants';
import Utils from '~/common/utils/GeneralUtils';
import { useDisplayedTimestamps } from '../hooks/useDisplayedTimestamps';
import { useIsToolbarVisible } from '../hooks/useIsToolbarVisible';
import { useIsEditing } from '../state/useEditingState';
import { useDuration, useVideoController, useVideoState } from '../state/useVideoState';

const SKIP_BUTTON_OFFSET = 0.1;
const IS_VIDEO_OVER_ALLOWED_DIFF = 0.1;

const { setCurrentTime, setActive } = useVideoController();
const videoState = useVideoState();
const isToolbarVisible = useIsToolbarVisible();
const currentTime = computed(() => videoState.currentTime);
const preferences = useGeneralPreferences();
const activeTimestamps = useDisplayedTimestamps();
const duration = useDuration(videoState);
const isVideoOver = computed(
  () => Math.abs(duration.value - currentTime.value) < IS_VIDEO_OVER_ALLOWED_DIFF
);

// Timestamps

const currentTimestamp = computed(() => {
  const time = currentTime.value + SKIP_BUTTON_OFFSET;
  return Utils.previousTimestampInVideo(time, activeTimestamps.value);
});
const nextTimestamp = computed(() =>
  Utils.nextTimestamp(currentTime.value, activeTimestamps.value, preferences.value)
);
const currentTimestampTitle = computed<string | undefined>(() => {
  const currentTimestampTypeId = currentTimestamp.value?.typeId;
  if (!currentTimestampTypeId) return;
  return TIMESTAMP_TYPES.find(type => type.id === currentTimestampTypeId)?.name;
});
const currentTimeStampIsSkipped = computed(
  () => currentTimestamp.value && Utils.isSkipped(currentTimestamp.value, preferences.value)
);

// Show / Skip

const isEditing = useIsEditing();
const showSkipButton = computed(
  () =>
    isToolbarVisible.value &&
    currentTimeStampIsSkipped.value &&
    !preferences.value.enableAutoSkip &&
    !isVideoOver.value &&
    !isEditing.value &&
    currentTimestampTitle.value
);
watch(currentTimeStampIsSkipped, newIsSkipped => {
  if (newIsSkipped) setActive();
});

const skip = () => {
  const goToTime = nextTimestamp.value?.at ?? duration.value;
  if (goToTime != null) {
    setCurrentTime(goToTime);
  }
};
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
