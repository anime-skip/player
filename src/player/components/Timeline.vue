<template>
  <div
    ref="timeline"
    class="Timeline"
    :class="{
      vrv: service === 'vrv',
      flipped: isFlipped,
      seeking: isSeeking,
      'add-margin': isEditing,
    }"
    @click.stop
  >
    <Section
      v-for="section of sections"
      :key="section.timestamp.id"
      :timestamp="section.timestamp"
      :endTime="section.endTime"
      :duration="duration"
      :skipped="section.isSkipped"
    />
    <Section
      v-for="section of completedSections"
      :key="'completed' + section.timestamp.id"
      :timestamp="section.timestamp"
      :endTime="section.endTime"
      :duration="duration"
      :currentTime="currentTime"
      completed
    />
    <WebExtImg
      v-for="timestamp of activeTimestamps"
      :key="`t${timestamp.id}`"
      class="Timestamp"
      :class="timestampClass(timestamp)"
      :src="timestampIcon(timestamp)"
      :style="{ left: `${(timestamp.at / duration) * 100}%` }"
    />
    <VueSlider
      v-if="duration > 0"
      class="slider"
      :value="normalizedTime"
      height="3"
      :min="0"
      :max="100"
      :interval="0.01"
      :duration="0"
      tooltip="none"
      :dotSize="isFlipped ? 3 : 11"
      dragOnClick
      :useKeyboard="false"
      @change="onSeek"
    />
  </div>
</template>

<script lang="ts">
import vueMixins from 'vue-typed-mixins';
import Section from './Section.vue';
import WebExtImg from '@/common/components/WebExtImg.vue';
import VueSlider from 'vue-slider-component';
import '../scss/VideoSlider.scss';
import Utils from '@/common/utils/Utils';
import VideoControllerMixin from '@/common/mixins/VideoController';
import KeyboardShortcutMixin from '@/common/mixins/KeyboardShortcuts';
import { PropValidator } from 'vue/types/options';
import mutationTypes from '@/common/store/mutationTypes';

interface SectionData {
  timestamp: Api.Timestamp;
  endTime: number;
  isSkipped: boolean;
}

export default vueMixins(VideoControllerMixin, KeyboardShortcutMixin).extend({
  components: { Section, WebExtImg, VueSlider },
  props: {
    isFlipped: Boolean,
    currentTime: { type: Number, required: true },
    duration: Number,
    updateTime: { type: Function, required: true } as PropValidator<
      (newTime: number, updatePlayer?: boolean) => void
    >, // TODO: Optional?
    timestamps: { type: Array, required: true } as PropValidator<Api.Timestamp[]>,
  },
  data() {
    return {
      isSeeking: false,
      seekingTime: 0,
      service: global.service,
    };
  },
  watch: {
    currentTime(newTime: number, oldTime: number) {
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
      return this.$store.getters.isEditing;
    },
    hasEpisode(): boolean {
      return this.$store.getters.hasEpisode;
    },
    isLoggedIn(): boolean {
      return this.$store.getters.isLoggedIn;
    },
    activeTimestamp(): Api.AmbigousTimestamp | undefined {
      return this.$store.getters.activeTimestamp;
    },
    hoveredTimestamp(): Api.AmbigousTimestamp | undefined {
      return this.$store.getters.hoveredTimestamp;
    },
    draftTimestamps(): Api.AmbigousTimestamp[] {
      return this.$store.getters.draftTimestamps;
    },
    preferences(): Api.Preferences | undefined {
      return this.$store.getters.preferences;
    },
    preferencesLastUpdatedAt(): number {
      return this.$store.getters.preferencesLastUpdatedAt;
    },
    hasSkippedFromZero(): boolean {
      return this.$store.getters.hasSkippedFromZero;
    },
    playbackRate(): number {
      return this.$store.getters.playbackRate;
    },
    activeTimestamps(): Api.AmbigousTimestamp[] {
      return this.$store.getters.activeTimestamps;
    },
    normalizedTime(): number {
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
      if (!this.sections) {
        return [];
      }
      return this.sections.filter(section => {
        return (
          section.timestamp.at < this.currentTime &&
          !Utils.isSkipped(section.timestamp, this.preferences)
        );
      });
    },
  },
  methods: {
    setHasSkippedFromZero(newValue: boolean): void {
      this.$store.commit(mutationTypes.setHasSkippedFromZero, newValue);
    },
    toggleEditMode(isEditing: boolean): void {
      this.$store.commit(mutationTypes.toggleEditMode, isEditing);
    },
    timestampClass(timestamp: Api.AmbigousTimestamp): Record<string, boolean> {
      return {
        active:
          timestamp.id === this.activeTimestamp?.id || timestamp.id === this.hoveredTimestamp?.id,
      };
    },
    timestampIcon(timestamp: Api.AmbigousTimestamp): string {
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
      this.updateTime(newNext?.at ?? this.duration, true);
    },
    onSeek(newTime: number) {
      this.$emit('seek', (newTime / 100) * this.duration);
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
  height: 11px;
  position: relative;
  cursor: pointer;
  transform: scaleY(1) translateY($translationDefault);
  transition: 200ms;

  &.flipped {
    transform: scaleY(-1);
    .slider {
      transform: translateY($translationInactiveSliderDefault);
    }
  }
  & > * {
    position: absolute;
  }
  &.add-margin {
    margin-left: 24px;
    margin-right: 24px;
  }

  .slider {
    top: -1px;
    left: 0;
    right: 0;
    transition: top;
  }
  &.flipped .slider {
    top: 0px;
  }

  .Timestamp {
    height: 6px;
    width: 12px;
    top: 4px;
    transform: translateX(-50%);
    transition: 250ms ease transform;

    &.active {
      transform: translateX(-50%) translateY(-12px);
    }
  }
}

// VRV specific styles
.Timeline.vrv {
  transform: scaleY(1) translateY($translationVrv);
  &.flipped {
    transform: scaleY(-1) translateY(-7px);
    .slider {
      transform: translateY($translationInactiveSliderVrv);
    }
  }
}
</style>
