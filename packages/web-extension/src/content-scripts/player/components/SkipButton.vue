<template>
  <RaisedButton v-if="showSkipButton" dark @click.stop="skip"
    >Skip {{ beforeNextTimeStampTitle }}</RaisedButton
  >
</template>

<script lang="ts" setup>
import { useTimeout } from '@anime-skip/ui';
import { useGeneralPreferences } from '~/common/state/useGeneralPreferences';
import { PLAYER_ACTIVITY_TIMEOUT, TIMESTAMP_TYPES } from '~/common/utils/constants';
import Utils from '~/common/utils/GeneralUtils';
import { useDisplayedTimestamps } from '../hooks/useDisplayedTimestamps';
import { useDuration, useVideoController, useVideoState } from '../state/useVideoState';

const { setCurrentTime, setActive, setInactive } = useVideoController();
const videoState = useVideoState();
const isActive = computed(() => videoState.isActive);
const isPaused = computed(() => videoState.isPaused);
const currentTime = computed(() => videoState.currentTime);
const preferences = useGeneralPreferences();
const activeTimestamps = useDisplayedTimestamps();
const duration = useDuration(videoState);
const isVideoOver = computed(() => Math.abs(duration.value - currentTime.value) < 0.1);

// Timestamps

const currentTimestamp = computed(() =>
  Utils.previousTimestamp(currentTime.value, activeTimestamps.value, undefined, -0.1)
);
const nextTimestamp = computed(() =>
  Utils.nextTimestamp(currentTime.value, activeTimestamps.value, preferences.value, true)
);
const beforeNextTimeStampTitle = computed(() => {
  if (!nextTimestamp.value) return;
  const beforeNextTimeStamp = Utils.previousTimestamp(
    nextTimestamp.value?.at,
    activeTimestamps.value,
    undefined
  );

  return TIMESTAMP_TYPES.find(ttype => ttype.id === beforeNextTimeStamp?.typeId)?.name;
});
const currentTimeStampIsSkipped = computed(() =>
  !currentTimestamp.value ? false : Utils.isSkipped(currentTimestamp.value, preferences.value, true)
);

// Show / Skip

const showSkipButton = computed(
  () =>
    (isPaused.value || isActive.value) &&
    currentTimeStampIsSkipped.value &&
    !preferences.value.enableAutoSkip &&
    !isVideoOver.value &&
    beforeNextTimeStampTitle.value
);
const [setActiveTimeout, clearActiveTimeout] = useTimeout();
watch(currentTimestamp, _ => {
  if (currentTimeStampIsSkipped.value) {
    setActive();
    clearActiveTimeout();
    setActiveTimeout(setInactive, PLAYER_ACTIVITY_TIMEOUT);
  }
});

const skip = () => {
  const goToTime = nextTimestamp.value?.at ?? duration.value;
  if (goToTime != null) {
    setCurrentTime(goToTime);
  }
};
</script>

<style lang="scss" scoped></style>
