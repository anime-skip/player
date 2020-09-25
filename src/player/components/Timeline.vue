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
      :src="isEditing ? 'ic_timestamp_draft.svg' : 'ic_timestamp.svg'"
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
    <EditTimestampHandle
      v-if="canAddTimestamp"
      :style="{ left: `${(currentTime / duration) * 100}%` }"
      @click="onClickTimestampHandle"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator';
import Section from './Section.vue';
import WebExtImg from '@/common/components/WebExtImg.vue';
import VueSlider from 'vue-slider-component';
import '../scss/VideoSlider.scss';
import Utils from '@/common/utils/Utils';
import { Getter, Mutation, Action } from '@/common/utils/VuexDecorators';
import EditTimestampHandle from '@/player/components/EditTimestampHandle.vue';
import VideoControllerMixin from '@/common/mixins/VideoController';
import KeyboardShortcutMixin from '@/common/mixins/KeyboardShortcuts';

interface SectionData {
  timestamp: Api.Timestamp;
  endTime: number;
  isSkipped: boolean;
}

@Component({
  components: { Section, WebExtImg, VueSlider, EditTimestampHandle },
})
export default class Timeline extends Mixins(VideoControllerMixin, KeyboardShortcutMixin) {
  @Prop(Boolean) public isFlipped?: boolean;
  @Prop(Number) public currentTime!: number;
  @Prop(Number) public duration!: number;
  @Prop(Function) public updateTime!: (newTime: number, updatePlayer?: boolean) => void;
  @Prop(Array) public timestamps!: Api.Timestamp[];

  public sections: SectionData[] = [];
  public completedSections: SectionData[] = [];
  public isSeeking = false;
  public seekingTime = 0;
  public service = global.service;

  @Getter() isEditing!: boolean;
  @Getter() activeDialog!: boolean;
  @Getter() hasEpisode!: boolean;
  @Getter() isLoggedIn!: boolean;
  @Getter() activeTimestamp?: Api.Timestamp;
  @Getter() draftTimestamps!: Api.Timestamp[];
  @Getter('preferences') prefs?: Api.Preferences;
  @Getter() preferencesLastUpdatedAt!: number;
  @Getter() hasSkippedFromZero!: boolean;
  @Getter() playbackRate!: number;

  @Mutation() setActiveTimestamp!: (timestamp: Api.AmbigousTimestamp) => void;
  @Mutation() setEditTimestampMode!: (mode: 'add' | 'edit' | undefined) => void;
  @Mutation() setHasSkippedFromZero!: (newValue: boolean) => void;
  @Mutation() toggleEditMode!: (isEditing: boolean) => void;

  @Action() showDialog!: (dialog: string) => void;
  @Action() startEditing!: () => void;

  public get normalizedTime(): number {
    return Math.max(0, Math.min(100, (this.currentTime / this.duration) * 100));
  }

  @Watch('currentTime')
  public onChangeCurrentTime(newTime: number, oldTime: number): void {
    this.completedSections = this.getCompletedSections();

    // Do nothing
    const currentTimestamp = Utils.previousTimestamp(oldTime, this.timestamps, undefined);
    const insideSkippedSection =
      currentTimestamp != null && Utils.isSkipped(currentTimestamp, this.prefs);
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
    const shouldSkipFirstTimestamp = Utils.isSkipped(this.timestamps[0], this.prefs);
    if (wasAtBeginning && haveNotSkippedFromBeginning && shouldSkipFirstTimestamp) {
      this.setHasSkippedFromZero(true);
      this.goToNextTimestampOnTimeChange(newTime);
      return;
    }

    // Do nothing
    const willNotPastATimestamp = oldNext!.at > newTime + timeDiff; // look forward a time update so we don't show the user a frame of the skipped section
    const notSkippingThePassedTimestamp = !Utils.isSkipped(oldNext!, this.prefs);
    if (willNotPastATimestamp || notSkippingThePassedTimestamp) {
      return;
    }
    const jumpedDirectlyToTimestamp =
      this.timestamps.find(timestamp => Math.abs(timestamp.at - oldTime) < 0.0001) != null;
    if (jumpedDirectlyToTimestamp) {
      return;
    }

    this.goToNextTimestampOnTimeChange(newTime);
  }

  public async onClickTimestampHandle(): Promise<void> {
    if (!this.isEditing) {
      await this.startEditing();
    } else {
      this.pause();
    }

    if (this.activeDialog == null) {
      this.setActiveTimestamp({
        at: this.currentTime,
        typeId: '',
        id: Utils.randomId(),
        source: 'ANIME_SKIP',
      });
      this.setEditTimestampMode('add');
      this.showDialog('EditTimestampPanel');
    }
  }

  keyboardShortcuts: { [action in KeyboardShortcutAction]?: () => void } = {
    createTimestamp: () => {
      if (this.activeTimestamp == null) {
        this.onClickTimestampHandle();
      }
    },
  };

  /**
   * Get the timestamp to go to, then go there or the end of the video if there isn't another time
   * stamp to go to
   */
  public goToNextTimestampOnTimeChange(newTime: number) {
    const newNext = Utils.nextTimestamp(newTime, this.timestamps, this.prefs);
    this.updateTime(newNext?.at ?? this.duration, true);
  }

  public get activeTimestamps(): Api.Timestamp[] {
    if (this.isEditing) {
      return this.draftTimestamps;
    }
    return this.timestamps;
  }

  public get canAddTimestamp(): boolean {
    return this.isEditing && this.activeTimestamp == null;
  }

  public onSeek(newTime: number) {
    this.$emit('seek', (newTime / 100) * this.duration);
  }

  public onChangeDuration(newDuration?: number) {
    this.duration = newDuration || 0;
    this.updateSections();
  }

  @Watch('timestamps')
  @Watch('duration')
  @Watch('isEditing')
  @Watch('preferencesLastUpdatedAt')
  public updateSections(): void {
    this.sections = this.getSections();
    this.completedSections = this.getCompletedSections();
  }

  public get unknownTimestamp(): Api.Timestamp {
    return {
      id: 'unknown',
      at: 0,
      typeId: 'unknown',
      source: 'ANIME_SKIP',
    };
  }

  public get endTimestamp(): Api.Timestamp {
    return {
      id: 'end',
      at: this.duration || 0,
      typeId: 'end',
      source: 'ANIME_SKIP',
    };
  }

  public getSections(): SectionData[] {
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
        isSkipped: Utils.isSkipped(timestamp, this.prefs),
      })
    );
  }
  public getCompletedSections(): SectionData[] {
    if (!this.sections) {
      return [];
    }
    return this.sections.filter(section => {
      return (
        section.timestamp.at < this.currentTime && !Utils.isSkipped(section.timestamp, this.prefs)
      );
    });
  }
}
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
