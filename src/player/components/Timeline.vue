<template>
  <div
    ref="timeline"
    class="Timeline"
    :class="{
      vrv: service === 'vrv',
      flipped: isFlipped,
      seeking: isSeeking,
    }"
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
      v-for="timestamp of timestamps"
      :key="timestamp.id"
      class="Timestamp"
      src="ic_timestamp.svg"
      :style="{ left: `${(timestamp.at / duration) * 100}%` }"
    />
    <VueSlider
      class="slider"
      v-model="currentTime"
      height="3"
      silent
      :max="duration"
      :interval="0.5"
      :duration="0"
      tooltip="none"
      :dotSize="isFlipped ? 3 : 11"
      @change="onSeek"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import Section from './Section.vue';
import WebExtImg from '@/common/components/WebExtImg.vue';
import VueSlider from 'vue-slider-component';
import '../scss/VideoSlider.scss';
import Utils from '@/common/utils/Utils';
import { Getter } from '@/common/utils/VuexDecorators';

interface SectionData {
  timestamp: Api.Timestamp;
  endTime: number;
  isSkipped: boolean;
}

@Component({
  components: { Section, WebExtImg, VueSlider },
})
export default class Timeline extends Vue {
  @Prop(Boolean) public isFlipped?: boolean;
  @Prop(Number) public currentTime!: number;
  @Prop(Function) public updateTime!: (newTime: number, updatePlayer?: boolean) => void;
  @Prop(Array) public timestamps!: Api.Timestamp[];
  @Prop(Object) public prefs?: Api.Preferences;

  public duration: number = 0;
  public sections: SectionData[] = [];
  public completedSections: SectionData[] = [];
  public isSeeking: boolean = false;
  public seekingTime: number = 0;
  public skippedFromZero: boolean = false;
  public service = global.service;

  public constructor() {
    super();
    global.onVideoChanged(video => {
      Utils.waitForVideoLoad().then(duration => {
        this.onChangeDuration(duration);
      });
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
        (next && next.at < newTime && next.at >= oldTime)
      ) {
        if (oldTime === 0) {
          this.skippedFromZero = true;
        }
        const future = Utils.nextTimestamp(oldTime, this.timestamps, this.prefs);
        const skipToTime = future ? future.at : global.getVideo().duration;
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
      at: 0,
      id: -2,
      typeId: -2,
    };
  }

  public get endTimestamp(): Api.Timestamp {
    return {
      id: -1,
      at: this.duration || 0,
      typeId: -1,
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
  &.flipped {
    transform: scaleY(-1);
    .slider {
      transform: translateY($translationInactiveSliderDefault);
    }
  }
  & > * {
    position: absolute;
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
    top: 0;
    transform: translateX(-50%);
  }
}

// VRV specific styles
.Timeline.vrv {
  transform: scaleY(1) translateY($translationVrv);
  &.flipped {
    .slider {
      transform: translateY($translationInactiveSliderVrv);
    }
  }
}
</style>
