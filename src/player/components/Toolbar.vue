<template>
  <div
    class="ToolBar"
    :class="{ active: playerState.isActive, paused: playerState.isPaused }"
    @click.stop
  >
    <div class="gradient"></div>
    <div class="content">
      <Timeline
        :isFlipped="!playerState.isPaused && !playerState.isActive"
        :currentTime="currentTime"
        :updateTime="updateTime"
        :prefs="preferences"
        :timestamps="timestamps"
      />
      <div class="buttons">
        <ToolbarButton class="margin-right" @click.native="togglePlayPause()">
          <PlayPauseButton :state="playerState.isPaused ? 1 : 0" />
        </ToolbarButton>
        <ToolbarButton
          class="margin-right"
          icon="ic_next_episode.svg"
          v-if="false"
        />
        <VolumeButton />
        <div class="divider margin-right" />
        <ToolbarButton
          v-if="timestamps.length > 0"
          class="margin-right"
          icon="ic_prev_timestamp.svg"
          @click.native="previousTimestamp()"
        />
        <ToolbarButton
          v-if="timestamps.length > 0"
          class="margin-right"
          icon="ic_next_timestamp.svg"
          @click.native="nextTimestamp()"
        />
        <div class="divider margin-right" v-if="timestamps.length > 0" />
        <p class="current-time">
          {{ formattedTime }}&ensp;/&ensp;<span>{{ duration }}</span>
        </p>
        <div class="space" />
        <ToolbarButton
          class="margin-left"
          icon="ic_edit.svg"
          v-if="false"
        />
        <ToolbarButton
          v-if="!loginState"
          icon="ic-password.svg"
          @click.native="openPopup()"
        />
        <ToolbarButton
          v-else
          icon="ic-account.svg"
          @click.native="openPopup()"
        />
        <div class="divider margin-left" v-if="false" />
        <ToolbarButton
          v-if="isFullscreenEnabled"
          class="margin-left"
          @click.native="setFullscreen(!Utils.isFullscreen())"
        >
          <FullscreenButton
            :state="Utils.isFullscreen() ? 0 : 1"
            :key="isFullscreenCount"
          />
        </ToolbarButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Timeline from './Timeline.vue';
import ToolbarButton from './ToolbarButton.vue';
import PlayPauseButton from './animations/PlayPauseButton.vue';
import FullscreenButton from './animations/FullscreenButton.vue';
import VolumeButton from './animations/VolumeButton.vue';
import Utils from '@/common/utils/Utils';
import Browser from '@/common/utils/Browser';
import { Getter } from '@/common/utils/VuexDecorators';
import VideoUtils from '../VideoUtils';

@Component({
  components: {
    Timeline,
    PlayPauseButton,
    ToolbarButton,
    FullscreenButton,
    VolumeButton,
  },
})
export default class ToolBar extends Vue {
  @Prop(Object) public playerState!: PlayerState;

  public currentTime: number = 0;
  public isFullscreen: boolean = false;
  public isFullscreenCount: number = 0;
  public Utils = Utils;
  public duration: string = 'Loading...';
  public openPopup = Browser.openPopup;
  public togglePlayPause = VideoUtils.togglePlayPause;
  public isFullscreenEnabled = document.fullscreenEnabled;

  @Getter() public loginState?: boolean;
  @Getter() public timestamps!: Api.Timestamp[];
  @Getter() public preferences?: Api.Preferences;

  constructor() {
    super();
    global.onVideoChanged(video => {
      video.ontimeupdate = () => this.updateTime(video.currentTime);
    });
    VideoUtils.nextTimestamp = this.nextTimestamp;
    VideoUtils.previousTimestamp = this.previousTimestamp;
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = Utils.isFullscreen();
      this.isFullscreenCount++;
    });
    Utils.waitForVideoLoad().then(this.updateDuration);
  }

  public setFullscreen(isFullscreen: boolean): void {
    this.isFullscreen = isFullscreen;
    if (isFullscreen) {
      Utils.enterFullscreen();
    } else {
      Utils.exitFullscreen();
    }
  }

  public updateDuration(duration: number) {
    if (duration === 0) {
      this.duration = 'Loading...';
    }
    this.duration = this.formatSeconds(
      duration,
      this.playerState.isPaused ? 2 : 0
    );
  }

  public updateTime(newTime: number, updateVideo?: boolean) {
    if (updateVideo) {
      VideoUtils.setCurrentTime(newTime);
    }
    this.currentTime = newTime;
  }

  public addTime(seconds: number): void {
    this.updateTime((this.currentTime += seconds), true);
  }

  public nextTimestamp(): void {
    const nextTimestamp = this.timestamps.find(
      timestamp => timestamp.at > this.currentTime
    );
    const video = global.getVideo();
    if (nextTimestamp) {
      this.updateTime(nextTimestamp.at, true);
    } else if (video.duration) {
      this.updateTime(video.duration, true);
    } else {
      console.warn(
        'Tried to go to next timestamp, but there was not one and the duration had not been initalized'
      );
    }
  }

  public previousTimestamp(): void {
    const previousTimestamp = this.timestamps
      .filter(timestamp => timestamp.at < this.currentTime - 1)
      .pop();
    if (previousTimestamp) {
      this.updateTime(previousTimestamp.at, true);
    } else {
      this.updateTime(0, true);
    }
  }

  public formatSeconds(seconds: number, decimalPlaces: number) {
    const mins = Math.floor(seconds / 60);
    const secs = parseFloat((seconds % 60).toFixed(decimalPlaces));
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }
  public get formattedTime(): string {
    return this.formatSeconds(
      this.currentTime,
      this.playerState.isPaused ? 2 : 0
    );
  }
}
</script>

<style lang="scss" scoped>
$height: 56px;
$offsetInactive: 4px;
.ToolBar {
  position: relative;
  height: $height;
  transform: translateY($height - $offsetInactive);
  transition: 200ms;
  transition-property: transform;
  user-select: none;
  cursor: default;
  &.active,
  &.paused {
    transform: translateY(0);
  }

  .gradient {
    z-index: 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 64px;
    transition: 200ms;
    transition-property: opacity;
    opacity: 0;
    background: linear-gradient(
      transparent,
      rgba($color: $background500, $alpha: 0.75)
    );
  }
  &.active {
    .gradient {
      opacity: 1;
    }
  }
  &.paused {
    .gradient {
      opacity: 0;
    }
  }

  .content {
    z-index: 1;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    .buttons {
      padding: 0 8px;
      display: flex;
      flex-direction: row;
      align-items: center;
      flex: 1;
      .margin-left {
        margin-left: 8px;
      }
      .margin-right {
        margin-right: 8px;
      }
      .divider {
        width: 2px;
        height: 40px;
        border-radius: 1px;
        background-color: $divider;
      }
      .space {
        flex: 1;
      }
    }
    .current-time {
      margin-left: 16px;
      color: $textPrimary;
      span {
        font-weight: 600;
        color: $textSecondary;
      }
    }
  }
}
</style>
