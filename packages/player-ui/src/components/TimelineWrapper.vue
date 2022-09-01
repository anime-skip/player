<template>
  <div
    ref="wrapperRef"
    class="TimelineWrapper"
    :class="{
      'as-add-margin': editing.isEditing,
      'as-flipped': isFlipped,
    }"
  >
    <Slider
      class="as-slider as-w-full"
      :progress="normalizedTime"
      :max="100"
      disable-update-during-seek
      :default-thumb-size="thumbSize"
      @seek="onSeek"
      @mouseenter="toggleHovering(true)"
      @mouseleave="toggleHovering(false)"
      @mousemove="updateHoverPosition"
    >
      <template #background>
        <div />
      </template>
      <template #foreground="slotProps">
        <Timeline
          :class="{
            'as-seeking': isSeeking,
          }"
          :timestamps="timelineData"
          :normalized-progress="slotProps.progress"
          :editing="editing.isEditing"
          :duration="videoState.duration"
          :allow-overlay="isHovering"
          :force-overlay-normalized-at="hoverNormalizedAt"
          @click.stop
        />
      </template>
    </Slider>
  </div>
</template>

<script lang="ts" setup>
import { Utils as UiUtils } from '@anime-skip/ui';
import { computed, ref, watch } from 'vue';
import { useDisplayedTimestamps } from '../composables/useDisplayedTimestamps';
import { useGetTimestampColor } from '../composables/useTimelineColors';
import { TIMESTAMP_TYPES } from '../utils/constants';
import * as Api from 'common/src/api';
import Utils from 'common/src/utils/GeneralUtils';
import { usePlayerConfig } from '../composables/usePlayerConfig';
import { storeToRefs } from 'pinia';
import { usePreferencesStore } from '../stores/usePreferencesStore';
import { useVideoStateStore } from '../stores/useVideoStateStore';
import { useFocusedTimestampStore } from '../stores/useFocusedTimestampStore';
import { usePlayHistoryStore } from '../stores/usePlayHistoryStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useTimestampEditingStore } from '../stores/useTimestampEditingStore';

const props = defineProps<{
  isFlipped?: boolean;
}>();

const { usageClient } = usePlayerConfig();
const auth = useAuthStore();
const { preferences } = storeToRefs(usePreferencesStore());
const videoState = useVideoStateStore();
const focusedTimestamp = useFocusedTimestampStore();
const playHistory = usePlayHistoryStore();
const editing = useTimestampEditingStore();

// Styles

const thumbSize = computed(() => (props.isFlipped ? 3 : 11));

// Timestamps

const getTimestampColor = useGetTimestampColor('icon');
const activeTimestamps = useDisplayedTimestamps();
const timelineData = computed(() => {
  if (videoState.duration == null) return [];

  return activeTimestamps.value.map(timestamp => ({
    key: timestamp.id,
    title: TIMESTAMP_TYPES.find(ttype => ttype.id === timestamp.typeId)?.name ?? 'Unknown',
    normalizedAt: (timestamp.at / videoState.duration) * 100,
    skipped:
      auth.isLoggedIn &&
      !editing.isEditing &&
      preferences.value.enableAutoSkip &&
      Utils.isSkipped(timestamp, preferences.value),
    fillClass: getTimestampColor(timestamp),
    active:
      focusedTimestamp.timestamp?.id === timestamp.id ||
      editing.activeTimestamp?.id === timestamp.id,
  }));
});
const goToNextTimestampOnTimeChange = (newTime: number): void => {
  const newNext = Utils.nextTimestamp(newTime, activeTimestamps.value, preferences.value);
  const goToTime = newNext?.at ?? videoState.duration;
  if (goToTime != null) {
    videoState.seekTo(goToTime);
  }
};

// On time change

const isSeeking = ref(false);
const onSeek = (newNormalizedTime: number): void => {
  if (!videoState.duration) return;
  const newTime = (newNormalizedTime / 100) * videoState.duration;
  videoState.seekTo(newTime);
};
const normalizedTime = computed(() => {
  if (!videoState.duration) return 0;
  return Utils.boundedNumber((videoState.currentTime / videoState.duration) * 100, [0, 100]);
});
const hasSkippedFromZero = computed(() => playHistory.hasSkippedFromZero);
watch(
  () => videoState.currentTime,
  (newTime, oldTime) => {
    if (!videoState.duration) return;

    // Do nothing
    const currentTimestamp = Utils.previousTimestampInVideo(oldTime, activeTimestamps.value);
    const insideSkippedSection =
      currentTimestamp != null && Utils.isSkipped(currentTimestamp, preferences.value);
    if (insideSkippedSection) {
      return;
    }

    // Get the next timestamp AFTER the oldTime, regardless of if it's skipped
    let oldNext = Utils.nextTimestampInVideo(oldTime, activeTimestamps.value);

    // Do nothing
    const timeDiff = Math.abs(oldTime - newTime);
    const hasNoMoreTimestamps = oldNext == null;
    const isSeeking = timeDiff > 1 * videoState.rate; // Multiple the base number, 1s, by the speed so that high playback rates don't "skip" over timestamps
    const isAtEnd = newTime >= videoState.duration;
    if (hasNoMoreTimestamps || isSeeking || isAtEnd || editing.isEditing) {
      return;
    }
    oldNext = oldNext as Api.AmbiguousTimestamp;

    // Skip timestamp at 0:00 if we haven't yet
    const wasAtBeginning = oldTime < 1;
    const haveNotSkippedFromBeginning = !hasSkippedFromZero.value;
    const firstTimestamp = activeTimestamps.value[0];
    let shouldSkipFirstTimestamp = false;
    if (firstTimestamp) {
      if (firstTimestamp.at === 0) {
        shouldSkipFirstTimestamp = Utils.isSkipped(firstTimestamp, preferences.value);
      } else {
        // There are timestamps, but the first one is not at 0, skip to it
        shouldSkipFirstTimestamp = true;
      }
    }
    if (
      preferences.value.enableAutoSkip &&
      wasAtBeginning &&
      haveNotSkippedFromBeginning &&
      shouldSkipFirstTimestamp
    ) {
      playHistory.hasSkippedFromZero = true;
      goToNextTimestampOnTimeChange(newTime);
      void usageClient.saveEvent('skipped_timestamp', {
        fromTime: oldTime,
        toTime: newTime,
        skippedDuration: oldTime - newTime,
        typeId: oldNext.typeId,
      });
      return;
    }

    // Do nothing
    if (!preferences.value.enableAutoSkip) {
      return;
    }
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
  }
);

// Hover position

const wrapperRef = ref();

const isHovering = ref(false);
function toggleHovering(newIsHovering: boolean) {
  isHovering.value = newIsHovering;
}

const hoverNormalizedAt = ref<number>();
function updateHoverPosition(event: MouseEvent) {
  const wrapper = wrapperRef.value as HTMLDivElement;
  const bar = wrapper.querySelector('.as-slider') as HTMLDivElement | null;
  const screenWidth = document.body.clientWidth;
  const barWidth = bar?.clientWidth ?? screenWidth;
  const offsetX = (screenWidth - barWidth) / 2;
  const x = event.clientX - offsetX;
  const percent = UiUtils.boundedNumber((x / barWidth) * 100, [0, 100]);
  hoverNormalizedAt.value = percent;
}
</script>

<style lang="scss" scoped>
$translationDefault: 4px;
$translationInactiveSliderDefault: 4px;

.TimelineWrapper {
  position: relative;
  transform: scaleY(1);
  transition: 200ms;

  &.as-flipped {
    transform: scaleY(-1);
  }
  &.as-add-margin {
    margin-left: 24px;
    margin-right: 24px;
  }

  &.as-flipped .as-slider {
    top: 0px;
  }
}

.as-slider {
  --as-slider-foreground-color: #{theme('colors.timeline-foreground')};
}
</style>
