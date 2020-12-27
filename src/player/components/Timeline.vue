<template>
  <div
    class="Timeline"
    :class="{
      vrv: service === 'vrv',
      flipped: isFlipped,
      seeking: isSeeking,
      'add-margin': isEditing,
    }"
    @click.stop
  >
    <Slider
      v-if="duration != null && duration > 0"
      class="slider"
      :progress="normalizedTime"
      :max="100"
      :inactiveThumbSize="isFlipped ? 3 : undefined"
      disableUpdateDuringSeek
      @seek="onSeek"
    >
      <template v-slot:background>
        <Section
          v-for="section of sections"
          :key="section.timestamp.id"
          :timestamp="section.timestamp"
          :endTime="section.endTime"
          :duration="duration"
          :skipped="section.isSkipped"
        />
      </template>
      <template v-slot:foreground="slotProps" v-if="activeTimestamps.length > 0">
        <Section
          v-for="section of completedSections"
          :key="'completed' + section.timestamp.id"
          :timestamp="section.timestamp"
          :endTime="section.endTime"
          :duration="duration"
          :currentTime="(slotProps.progress / 100) * (duration || 0)"
          completed
        />
        <WebExtImg
          v-for="timestamp of activeTimestamps"
          :key="`t${timestamp.id}`"
          class="Timestamp"
          :class="timestampClass(timestamp)"
          :src="timestampIcon(timestamp)"
          :style="timestampStyle(timestamp)"
        />
      </template>
    </Slider>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import Section from './Section.vue';
import WebExtImg from '@/common/components/WebExtImg.vue';
import Utils from '@/common/utils/Utils';
import { MutationTypes } from '@/common/store/mutationTypes';
import { GetterTypes } from '@/common/store/getterTypes';
import Slider from './Slider.vue';
import { useStore } from 'vuex';
import { Store } from '@/common/store';
import { useVideoController } from '@/common/mixins/VideoController';

interface SectionData {
  timestamp: Api.AmbiguousTimestamp;
  endTime: number;
  isSkipped: boolean;
}

export default defineComponent({
  name: 'Timeline',
  components: { Section, WebExtImg, Slider },
  props: {
    isFlipped: Boolean,
    duration: Number,
  },
  emits: ['seek'],
  setup(props) {
    const store: Store = useStore();
    const service = global.service;
    const preferences = computed(() => store.getters[GetterTypes.PREFERENCES]);
    const { setCurrentTime } = useVideoController();
    const currentTime = computed(() => store.state.playerState.currentTime);

    // Editing
    const isEditing = computed(() => store.state.isEditing);
    const canAddTimestamp = computed(() => isEditing.value && store.state.activeTimestamp == null);

    // Timestamps
    const activeTimestamps = computed(() => store.getters[GetterTypes.ACTIVE_TIMESTAMPS]);
    const timestampStyle = (timestamp: Api.AmbiguousTimestamp) => {
      if (!props.duration) {
        return {
          left: '0',
        };
      }
      return {
        left: `${(timestamp.at / props.duration) * 100}%`,
      };
    };
    const timestampClass = (timestamp: Api.AmbiguousTimestamp): Record<string, boolean> => {
      return {
        active:
          timestamp.id === store.state.activeTimestamp?.id ||
          timestamp.id === store.state.hoveredTimestamp?.id,
      };
    };
    const timestampIcon = (timestamp: Api.AmbiguousTimestamp): string => {
      if (!isEditing.value) return 'ic_timestamp.svg';
      if (!timestamp.edited) return 'ic_timestamp_draft.svg';
      return 'ic_timestamp_draft_edited.svg';
    };
    const goToNextTimestampOnTimeChange = (newTime: number): void => {
      const newNext = Utils.nextTimestamp(newTime, activeTimestamps.value, preferences.value);
      const goToTime = newNext?.at ?? props.duration;
      if (goToTime != null) {
        setCurrentTime(goToTime);
      }
    };

    // Sections
    const unknownTimestamp = (): Api.AmbiguousTimestamp => ({
      id: 'unknown',
      at: 0,
      typeId: 'unknown',
      source: 'ANIME_SKIP',
    });
    const endTimestamp = (): Api.Timestamp => ({
      id: 'end',
      at: props.duration || 0,
      typeId: 'end',
      source: 'ANIME_SKIP',
    });
    const sections = computed<SectionData[]>(() => {
      if (!props.duration) return [];

      if (activeTimestamps.value.length === 0 || isEditing.value) {
        return [
          {
            timestamp: unknownTimestamp(),
            endTime: props.duration,
            isSkipped: false,
          },
        ];
      }
      const withEnd = [...activeTimestamps.value, endTimestamp()];
      return activeTimestamps.value.map<SectionData>(
        (timestamp: Api.AmbiguousTimestamp, index: number): SectionData => ({
          timestamp: timestamp,
          endTime: withEnd[index + 1].at,
          isSkipped: Utils.isSkipped(timestamp, preferences.value),
        })
      );
    });
    const completedSections = computed<SectionData[]>(() => {
      return sections.value.filter(
        section => !Utils.isSkipped(section.timestamp, preferences.value)
      );
    });

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
      const oldNext = Utils.nextTimestamp(oldTime, activeTimestamps.value, undefined);

      // Do nothing
      const timeDiff = Math.abs(oldTime - newTime);
      const hasNoMoreTimestamsps = oldNext == null;
      const isSeeking = timeDiff > 1 * store.state.playbackRate; // Multiple the base number, 1s, by the speed so that high playback rates don't "skip" over timestamps
      const isAtEnd = newTime >= props.duration;
      if (hasNoMoreTimestamsps || isSeeking || isAtEnd || isEditing.value) {
        return;
      }

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
      const willNotPastATimestamp = oldNext!.at > newTime + timeDiff; // look forward a time update so we don't show the user a frame of the skipped section
      const notSkippingThePassedTimestamp = !Utils.isSkipped(oldNext!, preferences.value);
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
      timestampStyle,
      timestampClass,
      timestampIcon,
      onSeek,
      sections,
      completedSections,
      activeTimestamps,
    };
  },
});
</script>

<style lang="scss" scoped>
$translationDefault: 4px;
$translationInactiveSliderDefault: 4px;

$translationVrv: 0px;
$translationInactiveSliderVrv: 3px;

.Timeline {
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

  .slider {
    top: 0;
    left: 0;
    right: 0;
    transition: top;

    .slider-foreground {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }
  }
  &.flipped .slider {
    top: 0px;
  }

  .Timestamp {
    position: absolute;
    height: 6px;
    width: 12px;
    transform: translateX(-50%);
    transition: 250ms ease transform;

    &.active {
      transform: translateX(-50%) translateY(-12px);
    }
  }
}
</style>
