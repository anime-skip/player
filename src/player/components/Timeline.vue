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
import { defineComponent, PropType } from 'vue';
import Section from './Section.vue';
import WebExtImg from '@/common/components/WebExtImg.vue';
import Utils from '@/common/utils/Utils';
import VideoControllerMixin from '@/common/mixins/VideoController';
import KeyboardShortcutMixin from '@/common/mixins/KeyboardShortcuts';
import { MutationTypes } from '@/common/store/mutationTypes';
import { GetterTypes } from '@/common/store/getterTypes';
import Slider from './Slider.vue';

interface SectionData {
  timestamp: Api.Timestamp;
  endTime: number;
  isSkipped: boolean;
}

export default defineComponent({
  name: 'Timeline',
  components: { Section, WebExtImg, Slider },
  mixins: [VideoControllerMixin, KeyboardShortcutMixin],
  props: {
    isFlipped: Boolean,
    currentTime: { type: Number, required: true },
    duration: Number,
    updateTime: {
      type: Function as PropType<(newTime: number, updatePlayer?: boolean) => void>,
      required: true,
    },
    timestamps: {
      type: Array as PropType<Api.Timestamp[]>,
      required: true,
    },
  },
  emits: ['seek'],
  data() {
    return {
      isSeeking: false,
      seekingTime: 0,
      service: global.service,
    };
  },
  watch: {
    currentTime(newTime: number, oldTime: number) {
      if (!this.duration) return;

      // Do nothing
      const currentTimestamp = Utils.previousTimestamp(oldTime, this.timestamps, undefined);
      const insideSkippedSection =
        currentTimestamp != null && Utils.isSkipped(currentTimestamp, this.preferences);
      if (insideSkippedSection) {
        return;
      }

      // Get the next timestamp AFTER the oldTime, regardless of if it's skipped
      const oldNext = Utils.nextTimestamp(oldTime, this.timestamps, undefined);

      // Do nothing
      const timeDiff = Math.abs(oldTime - newTime);
      const hasNoMoreTimestamsps = oldNext == null;
      const isSeeking = timeDiff > 1 * this.playbackRate; // Multiple the base number, 1s, by the speed so that high playback rates don't "skip" over timestamps
      const isAtEnd = newTime >= this.duration;
      if (hasNoMoreTimestamsps || isSeeking || isAtEnd || this.isEditing) {
        return;
      }

      // Skip timestamp at 0:00 if we haven't yet
      const wasAtBeginning = oldTime === 0;
      const haveNotSkippedFromBeginning = !this.hasSkippedFromZero;
      const shouldSkipFirstTimestamp = Utils.isSkipped(this.timestamps[0], this.preferences);
      if (wasAtBeginning && haveNotSkippedFromBeginning && shouldSkipFirstTimestamp) {
        this.setHasSkippedFromZero(true);
        this.goToNextTimestampOnTimeChange(newTime);
        return;
      }

      // Do nothing
      const willNotPastATimestamp = oldNext!.at > newTime + timeDiff; // look forward a time update so we don't show the user a frame of the skipped section
      const notSkippingThePassedTimestamp = !Utils.isSkipped(oldNext!, this.preferences);
      if (willNotPastATimestamp || notSkippingThePassedTimestamp) {
        return;
      }
      const jumpedDirectlyToTimestamp =
        this.timestamps.find(timestamp => Math.abs(timestamp.at - oldTime) < 0.0001) != null;
      if (jumpedDirectlyToTimestamp) {
        return;
      }

      this.goToNextTimestampOnTimeChange(newTime);
    },
  },
  computed: {
    isEditing(): boolean {
      return this.$store.state.isEditing;
    },
    hasEpisode(): boolean {
      return this.$store.getters[GetterTypes.HAS_EPISODE];
    },
    isLoggedIn(): boolean {
      return this.$store.state.isLoggedIn;
    },
    activeTimestamp(): Api.AmbiguousTimestamp | undefined {
      return this.$store.state.activeTimestamp;
    },
    hoveredTimestamp(): Api.AmbiguousTimestamp | undefined {
      return this.$store.state.hoveredTimestamp;
    },
    draftTimestamps(): Api.AmbiguousTimestamp[] {
      return this.$store.getters[GetterTypes.DRAFT_TIMESTAMPS];
    },
    preferences(): Api.Preferences | undefined {
      return this.$store.getters[GetterTypes.PREFERENCES];
    },
    preferencesLastUpdatedAt(): number {
      return this.$store.state.preferencesLastUpdatedAt;
    },
    hasSkippedFromZero(): boolean {
      return this.$store.state.hasSkippedFromZero;
    },
    playbackRate(): number {
      return this.$store.state.playbackRate;
    },
    activeTimestamps(): Api.AmbiguousTimestamp[] {
      return this.$store.getters[GetterTypes.ACTIVE_TIMESTAMPS];
    },
    normalizedTime(): number {
      if (!this.duration) return 0;
      return Math.max(0, Math.min(100, (this.currentTime / this.duration) * 100));
    },
    canAddTimestamp(): boolean {
      return this.isEditing && this.activeTimestamp == null;
    },
    unknownTimestamp(): Api.Timestamp {
      return {
        id: 'unknown',
        at: 0,
        typeId: 'unknown',
        source: 'ANIME_SKIP',
      };
    },
    endTimestamp(): Api.Timestamp {
      return {
        id: 'end',
        at: this.duration || 0,
        typeId: 'end',
        source: 'ANIME_SKIP',
      };
    },
    sections(): SectionData[] {
      if (!this.duration) return [];

      if (this.timestamps.length === 0 || this.isEditing) {
        return [
          {
            timestamp: this.unknownTimestamp,
            endTime: this.duration,
            isSkipped: false,
          },
        ];
      }
      const withEnd = [...this.timestamps, this.endTimestamp];
      return this.timestamps.map<SectionData>(
        (timestamp: Api.Timestamp, index: number): SectionData => ({
          timestamp: timestamp,
          endTime: withEnd[index + 1].at,
          isSkipped: Utils.isSkipped(timestamp, this.preferences),
        })
      );
    },
    completedSections(): SectionData[] {
      return this.sections.filter(section => {
        return !Utils.isSkipped(section.timestamp, this.preferences);
      });
    },
  },
  methods: {
    setHasSkippedFromZero(newValue: boolean): void {
      this.$store.commit(MutationTypes.SET_HAS_SKIPPED_FROM_ZERO, newValue);
    },
    toggleEditMode(isEditing: boolean): void {
      this.$store.commit(MutationTypes.TOGGLE_EDIT_MODE, isEditing);
    },
    timestampClass(timestamp: Api.AmbiguousTimestamp): Record<string, boolean> {
      return {
        active:
          timestamp.id === this.activeTimestamp?.id || timestamp.id === this.hoveredTimestamp?.id,
      };
    },
    timestampIcon(timestamp: Api.AmbiguousTimestamp): string {
      if (!this.isEditing) return 'ic_timestamp.svg';
      if (!timestamp.edited) return 'ic_timestamp_draft.svg';
      return 'ic_timestamp_draft_edited.svg';
    },
    /**
     * Get the timestamp to go to, then go there or the end of the video if there isn't another time
     * stamp to go to
     */
    goToNextTimestampOnTimeChange(newTime: number) {
      const newNext = Utils.nextTimestamp(newTime, this.timestamps, this.preferences);
      const goToTime = newNext?.at ?? this.duration;
      if (goToTime != null) {
        this.updateTime(goToTime, true);
      }
    },
    onSeek(normalizedTime: number) {
      if (!this.duration) return;
      const newTime = (normalizedTime / 100) * this.duration;
      this.updateTime(newTime, true);
    },
    timestampStyle(timestamp: Api.AmbiguousTimestamp): object {
      if (!this.duration) {
        return {
          left: '0',
        };
      }
      return {
        left: `${(timestamp.at / this.duration) * 100}%`,
      };
    },
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
