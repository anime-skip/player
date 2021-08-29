<template>
  <div
    class="TimelineWrapper"
    :class="{
      'add-margin': isEditing,
      flipped: isFlipped,
    }"
  >
    <Slider
      class="slider w-full"
      :progress="normalizedTime"
      :max="100"
      disable-update-during-seek
      :default-thumb-size="thumbSize"
      @seek="onSeek"
    >
      <template #background>
        <div />
      </template>
      <template #foreground="slotProps">
        <Timeline
          :class="{
            seeking: isSeeking,
          }"
          :timestamps="timelineData"
          :normalized-progress="slotProps.progress"
          :editing="isEditing"
          @click.stop
        />
      </template>
    </Slider>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import * as Api from '~/common/api';
import { useGeneralPreferences } from '~/common/state/useGeneralPreferences';
import Utils from '~/common/utils/Utils';
import { useDisplayedTimestamps } from '../hooks/useDisplayedTimestamps';
import { useGetTimestampColor } from '../hooks/useTimelineColors';
import { useEditingState, useIsEditing } from '../state/useEditingState';
import { useHoveredTimestampId } from '../state/useHoveredTimestamp';
import { usePlayHistory, useUpdatePlayHistory } from '../state/usePlayHistory';
import { useDuration, useVideoController, useVideoState } from '../state/useVideoState';

const props = defineProps<{
  isFlipped?: boolean;
}>();

const preferences = useGeneralPreferences();
const { setCurrentTime } = useVideoController();
const videoState = useVideoState();
const currentTime = computed(() => videoState.currentTime);
const hoveredTimestampId = useHoveredTimestampId();
const playHistory = usePlayHistory();
const updatePlayHistory = useUpdatePlayHistory();

// Styles

const thumbSize = computed(() => (props.isFlipped ? 3 : 11));

// Editing

const editingState = useEditingState();
const isEditing = useIsEditing(editingState);
const timestampBeingEdited = computed(() => editingState.activeTimestamp);

// Timestamps

const getTimestampColor = useGetTimestampColor(false); // Use darker blue on the actual timeline
const activeTimestamps = useDisplayedTimestamps();
const duration = useDuration(videoState);
const timelineData = computed(() => {
  if (duration.value == null) return [];

  return activeTimestamps.value.map(timestamp => ({
    key: timestamp.id,
    normalizedAt: (timestamp.at / duration.value) * 100,
    skipped: !isEditing.value && Utils.isSkipped(timestamp, preferences.value),
    color: getTimestampColor(timestamp),
    active:
      hoveredTimestampId.value === timestamp.id || timestamp.id === timestampBeingEdited.value?.id,
  }));
});
const goToNextTimestampOnTimeChange = (newTime: number): void => {
  const newNext = Utils.nextTimestamp(newTime, activeTimestamps.value, preferences.value);
  const goToTime = newNext?.at ?? duration.value;
  if (goToTime != null) {
    setCurrentTime(goToTime);
  }
};

// On time change

const isSeeking = ref(false);
const onSeek = (newNormalizedTime: number): void => {
  if (!duration.value) return;
  const newTime = (newNormalizedTime / 100) * duration.value;
  setCurrentTime(newTime);
};
const normalizedTime = computed(() => {
  if (!duration.value) return 0;
  return Utils.boundedNumber((currentTime.value / duration.value) * 100, [0, 100]);
});
const hasSkippedFromZero = computed({
  get: () => playHistory.hasSkippedFromZero,
  set: value => updatePlayHistory({ hasSkippedFromZero: value }),
});
watch(currentTime, (newTime, oldTime) => {
  if (!duration.value) return;

  // Do nothing
  const currentTimestamp = Utils.previousTimestamp(oldTime, activeTimestamps.value, undefined);
  const insideSkippedSection =
    currentTimestamp != null && Utils.isSkipped(currentTimestamp, preferences.value);
  if (insideSkippedSection) {
    return;
  }

  // Get the next timestamp AFTER the oldTime, regardless of if it's skipped
  let oldNext = Utils.nextTimestamp(oldTime, activeTimestamps.value, undefined);

  // Do nothing
  const timeDiff = Math.abs(oldTime - newTime);
  const hasNoMoreTimestamsps = oldNext == null;
  const isSeeking = timeDiff > 1 * videoState.playbackRate; // Multiple the base number, 1s, by the speed so that high playback rates don't "skip" over timestamps
  const isAtEnd = newTime >= duration.value;
  if (hasNoMoreTimestamsps || isSeeking || isAtEnd || isEditing.value) {
    return;
  }
  oldNext = oldNext as Api.AmbiguousTimestamp;

  // Skip timestamp at 0:00 if we haven't yet
  const wasAtBeginning = oldTime === 0;
  const haveNotSkippedFromBeginning = !hasSkippedFromZero.value;
  const shouldSkipFirstTimestamp = Utils.isSkipped(activeTimestamps.value[0], preferences.value);
  if (wasAtBeginning && haveNotSkippedFromBeginning && shouldSkipFirstTimestamp) {
    hasSkippedFromZero.value = true;
    goToNextTimestampOnTimeChange(newTime);
    return;
  }

  // Do nothing
  // const oldNext as Api.AmbiguousTimestamp;
  const willNotPastATimestamp = oldNext.at > newTime + timeDiff; // look forward a time update so we don't show the user a frame of the skipped section
  const notSkippingThePassedTimestamp = !Utils.isSkipped(oldNext, preferences.value);
  if (willNotPastATimestamp || notSkippingThePassedTimestamp) {
    return;
  }
  const jumpedDirectlyToTimestamp =
    activeTimestamps.value.find(timestamp => Math.abs(timestamp.at - oldTime) < 0.0001) != null;
  if (jumpedDirectlyToTimestamp) {
    return;
  }

  goToNextTimestampOnTimeChange(newTime);
});
</script>

<style lang="scss" scoped>
@import '@anime-skip/ui/variables-theme.scss';

$translationDefault: 4px;
$translationInactiveSliderDefault: 4px;

.TimelineWrapper {
  position: relative;
  transform: scaleY(1);
  transition: 200ms;

  &.flipped {
    transform: scaleY(-1);
  }
  &.add-margin {
    margin-left: 24px;
    margin-right: 24px;
  }

  &.flipped .slider {
    top: 0px;
  }
}

.slider {
  --default-foreground-color: #{$backgroundColor-primaryPalette-500} !important;
}
</style>
