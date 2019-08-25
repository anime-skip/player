<template>
  <div
    ref="timeline"
    class="Timeline"
    :class="{ flipped: isFlipped, seeking: isSeeking }"
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
      :key="section.timestamp.id"
      :timestamp="section.timestamp"
      :endTime="section.endTime"
      :duration="duration"
      :currentTime="currentTime"
      completed
    />
    <Img
      v-for="timestamp of timestamps"
      :key="timestamp.id"
      class="Timestamp"
      src="img/ic_timestamp.svg"
      :style="{ left: `${(timestamp.time / duration) * 100}%` }"
    />
    <VueSlider
      class="slider"
      v-model="currentTime"
      height="3"
      silent
      :max="duration"
      interval="0.5"
      duration="0"
      tooltip="none"
      :dotSize="isFlipped ? 3 : 11"
      @change="onSeek"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import Section from './Section.vue';
import Img from '../../../shared/components/Img.vue';
import VueSlider from 'vue-slider-component';
import '../scss/VideoSlider.scss';
import Utils from '../../../shared/utils/Utils';
import Api from '../../../shared/utils/Api';
import { Getter } from '../../../shared/utils/VuexDecorators';

interface SectionData {
  timestamp: Api.Timestamp;
  endTime: number;
  isSkipped: boolean;
}

@Component({
  components: { Section, Img, VueSlider },
})
export default class Timeline extends Vue {
  @Prop(Boolean) public isFlipped?: boolean;
  @Prop(Number) public currentTime!: number;
  @Prop(Function) public updateTime!: (
    newTime: number,
    updatePlayer?: boolean
  ) => void;
  @Prop(Array) public timestamps!: Api.Timestamp[];
  @Prop(Object) public prefs?: Api.Preferences;

  public duration: number = 0;
  public sections: SectionData[] = [];
  public completedSections: SectionData[] = [];
  public isSeeking: boolean = false;
  public seekingTime: number = 0;
  public skippedFromZero: boolean = false;

  public constructor() {
    super();
    Utils.waitForVideoLoad().then(duration => {
      this.onChangeDuration(duration);
    });
  }

  @Watch('perfs')
  public onPrefsChange(): void {
    this.updateSections();
  }

  @Watch('timestamps')
  public onTimestampsChange(): void {
    this.updateSections();
  }

  @Watch('currentTime')
  public onChangeCurrentTime(newTime: number, oldTime: number): void {
    if (this.timestamps.length > 0 && Math.abs(oldTime - newTime) < 1) {
      const next = Utils.nextTimestamp(oldTime, this.timestamps);
      if (
        (oldTime === 0 && !this.skippedFromZero) ||
        (next && next.time < newTime && next.time >= oldTime)
      ) {
        if (oldTime === 0) {
          this.skippedFromZero = true;
        }
        const future = Utils.nextTimestamp(
          oldTime,
          this.timestamps,
          this.prefs
        );
        const skipToTime = future ? future.time : getVideo().duration;
        this.updateTime(skipToTime, true);
      }
    }
    this.completedSections = this.getCompletedSections();
  }

  public onSeek(newTime: number) {
    this.updateTime(newTime, true);
  }

  public onChangeDuration(newDuration?: number) {
    this.duration = newDuration || 0;
    this.updateSections();
  }

  public updateSections(): void {
    this.sections = this.getSections();
    this.completedSections = this.getCompletedSections();
  }

  public get unknownTimestamp(): Api.Timestamp {
    return {
      time: 0,
      id: -2,
      _typeId: -2,
    };
  }
  public get endTimestamp(): Api.Timestamp {
    return {
      id: -1,
      time: this.duration || 0,
      _typeId: -1,
    };
  }

  public getSections(): SectionData[] {
    if (this.timestamps.length === 0) {
      return [
        {
          timestamp: this.unknownTimestamp,
          endTime: Number.MAX_SAFE_INTEGER / 2,
          isSkipped: false,
        },
      ];
    }
    const withEnd = [...this.timestamps, this.endTimestamp];
    return this.timestamps.map<SectionData>(
      (timestamp: Api.Timestamp, index: number): SectionData => ({
        timestamp: timestamp,
        endTime: withEnd[index + 1].time,
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
        section.timestamp.time < this.currentTime &&
        !Utils.isSkipped(section.timestamp, this.prefs)
      );
    });
  }
}
</script>

<style lang="scss" scoped>
.Timeline {
  height: 11px;
  margin-top: -4px;
  margin-bottom: -1px;
  position: relative;
  cursor: pointer;
  transform: scaleY(1);
  &.flipped {
    transform: scaleY(-1);
  }
  & > * {
    position: absolute;
  }

  .slider {
    top: -5px;
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
    top: 0;
    transform: translateX(-50%);
  }
}
</style>
