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

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import Utils from '~/common/utils/Utils';
import { MutationTypes } from '~/common/store/mutationTypes';
import { GetterTypes } from '~/common/store/getterTypes';
import { useStore } from 'vuex';
import { Store } from '~/common/store';
import { useVideoController } from '~/common/mixins/VideoController';
import TimestampColors from '~/content-scripts/player/utils/TimelineColors';

export default defineComponent({
  props: {
    isFlipped: Boolean,
    duration: { type: Number, default: undefined },
  },
  setup(props) {
    const store: Store = useStore();
    const { service } = window;
    const preferences = computed(() => store.getters[GetterTypes.PREFERENCES]);
    const { setCurrentTime } = useVideoController();
    const currentTime = computed(() => store.state.playerState.currentTime);

    // Styles
    const thumbSize = computed(() => (props.isFlipped ? 3 : 11));

    // Editing
    const isEditing = computed(() => store.state.isEditing);
    const timestampBeingEdited = computed(() => store.state.activeTimestamp);
    const canAddTimestamp = computed(() => isEditing.value && timestampBeingEdited.value == null);

    // Timestamps
    const activeTimestamps = computed(() => store.getters[GetterTypes.ACTIVE_TIMESTAMPS]);
    const timelineData = computed(() => {
      const duration = props.duration;
      if (duration == null) return [];

      return activeTimestamps.value.map(timestamp => ({
        key: timestamp.id,
        normalizedAt: (timestamp.at / duration) * 100,
        skipped: !isEditing.value && Utils.isSkipped(timestamp, preferences.value),
        color:
          typeof timestamp.id === 'number'
            ? TimestampColors.new
            : timestamp.edited
            ? TimestampColors.edited
            : TimestampColors.default,
        active:
          store.state.hoveredTimestamp?.id === timestamp.id ||
          timestamp.id === timestampBeingEdited.value?.id,
      }));
    });
    const goToNextTimestampOnTimeChange = (newTime: number): void => {
      const newNext = Utils.nextTimestamp(newTime, activeTimestamps.value, preferences.value);
      const goToTime = newNext?.at ?? props.duration;
      if (goToTime != null) {
        setCurrentTime(goToTime);
      }
    };

    // On time change
    const isSeeking = ref(false);
    const seekingTime = ref(0);
    const onSeek = (newNormalizedTime: number): void => {
      if (!props.duration) return;
      const newTime = (newNormalizedTime / 100) * props.duration;
      setCurrentTime(newTime);
    };
    const normalizedTime = computed(() => {
      if (!props.duration) return 0;
      return Utils.boundedNumber((currentTime.value / props.duration) * 100, [0, 100]);
    });
    const hasSkippedFromZero = computed({
      get: () => store.state.hasSkippedFromZero,
      set: value => store.commit(MutationTypes.SET_HAS_SKIPPED_FROM_ZERO, value),
    });
    watch(currentTime, (newTime, oldTime) => {
      if (!props.duration) return;

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
      const isSeeking = timeDiff > 1 * store.state.playbackRate; // Multiple the base number, 1s, by the speed so that high playback rates don't "skip" over timestamps
      const isAtEnd = newTime >= props.duration;
      if (hasNoMoreTimestamsps || isSeeking || isAtEnd || isEditing.value) {
        return;
      }
      oldNext = oldNext as Api.AmbiguousTimestamp;

      // Skip timestamp at 0:00 if we haven't yet
      const wasAtBeginning = oldTime === 0;
      const haveNotSkippedFromBeginning = !hasSkippedFromZero.value;
      const shouldSkipFirstTimestamp = Utils.isSkipped(
        activeTimestamps.value[0],
        preferences.value
      );
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

    return {
      isSeeking,
      isEditing,
      service,
      seekingTime,
      canAddTimestamp,
      normalizedTime,
      onSeek,
      activeTimestamps,
      timelineData,
      thumbSize,
    };
  },
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
