<template>
  <div
    class="ToolBar"
    :class="{
      vrv: service === 'vrv',
      active: playerState.isActive,
      paused: playerState.isPaused,
    }"
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
        <ToolbarButton class="margin-right" icon="ic_next_episode.svg" v-if="false" />
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
          v-if="!isEditing && isLoggedIn"
          class="margin-left"
          icon="ic_edit.svg"
          @click.native="startEditMode"
        />
        <ToolbarButton
          v-if="isEditing"
          class="margin-left"
          icon="ic_edit.svg"
          title="Edit Episode Info"
          @click.native="openEpisodeEditorDialog"
        />
        <ToolbarButton
          v-if="isEditing"
          class="margin-left"
          icon="ic_save_changes.svg"
          title="Save Timestamps"
          @click.native="toggleEditMode(false)"
        />
        <div v-if="isLoggedIn" class="divider margin-left" />
        <ToolbarButton
          class="margin-left margin-right"
          icon="ic_more.svg"
          @click.native="toggleAccountDialog"
        />
        <ToolbarButton
          v-if="isFullscreenEnabled"
          @click.native="setFullscreen(!Utils.isFullscreen())"
        >
          <FullscreenButton :state="Utils.isFullscreen() ? 0 : 1" :key="isFullscreenCount" />
        </ToolbarButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import Timeline from './Timeline.vue';
import ToolbarButton from './ToolbarButton.vue';
import AccountDialog from './AccountDialog.vue';
import PlayPauseButton from './animations/PlayPauseButton.vue';
import FullscreenButton from './animations/FullscreenButton.vue';
import VolumeButton from './animations/VolumeButton.vue';
import Utils from '@/common/utils/Utils';
import Browser from '@/common/utils/Browser';
import { Getter, Action, Mutation } from '@/common/utils/VuexDecorators';
import WebExtImg from '@/common/components/WebExtImg.vue';
import VideoControllerMixin from '@/common/mixins/VideoController';
import KeyboardShortcutMixin from '../../common/mixins/KeyboardShortcuts';

@Component({
  components: {
    Timeline,
    PlayPauseButton,
    ToolbarButton,
    FullscreenButton,
    VolumeButton,
    AccountDialog,
    WebExtImg,
  },
})
export default class ToolBar extends Mixins(VideoControllerMixin, KeyboardShortcutMixin) {
  @Prop(Object) public playerState!: PlayerState;

  public currentTime: number = 0;
  public isFullscreen: boolean = false;
  public isFullscreenCount: number = 0;
  public Utils = Utils;
  public duration: string = 'Loading...';
  public isFullscreenEnabled = document.fullscreenEnabled;
  public service = global.service;

  @Getter() public timestamps!: Api.Timestamp[];
  @Getter() public preferences?: Api.Preferences;
  @Getter() public activeDialog?: string;
  @Getter() public isEditing!: boolean;
  @Getter() public episodeUrl!: boolean;
  @Getter() public isLoggedIn?: boolean;

  @Mutation() public toggleEditMode!: (isEditing: boolean) => void;

  @Action() public showDialog!: (dialogName?: string) => void;

  constructor() {
    super();
    global.onVideoChanged(video => {
      video.ontimeupdate = () => this.updateTime(video.currentTime);
    });
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
    this.duration = this.formatSeconds(duration, this.playerState.isPaused ? 2 : 0);
  }

  public updateTime(newTime: number, updateVideo?: boolean) {
    if (updateVideo) {
      this.setCurrentTime(newTime);
    }
    this.currentTime = newTime;
  }

  public addTime(seconds: number): void {
    this.updateTime((this.currentTime += seconds), true);
  }

  public nextTimestamp(): void {
    const nextTimestamp = this.timestamps.find(timestamp => timestamp.at > this.currentTime);
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

  // prettier-ignore
  keyboardShortcuts: { [combination: string]: () => void } = {
    // General Controls
    'D': () => this.togglePlayPause(),
    // Advance Time
    'L': () => this.addTime(1 / 24),
    'V': () => this.addTime(2),
    'F': () => this.addTime(5),
    'R': () => this.addTime(90),
    'E': () => this.nextTimestamp(),
    // Rewind Time
    'J': () => this.addTime(-1 / 24),
    'X': () => this.addTime(-2),
    'S': () => this.addTime(-5),
    'W': () => this.addTime(-85),
    'C': () => this.previousTimestamp(),
  }

  public toggleAccountDialog(): void {
    this.showDialog(this.activeDialog === 'AccountDialog' ? undefined : 'AccountDialog');
  }

  public formatSeconds(seconds: number, decimalPlaces: number) {
    const mins = Math.floor(seconds / 60);
    const secs = parseFloat((seconds % 60).toFixed(decimalPlaces));
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  public get formattedTime(): string {
    return this.formatSeconds(this.currentTime, this.playerState.isPaused ? 2 : 0);
  }

  // Edit Mode

  public startEditMode() {
    this.toggleEditMode(true);
    if (!this.episodeUrl) {
      this.openEpisodeEditorDialog();
    }
  }

  public openEpisodeEditorDialog() {
    this.showDialog('EpisodeEditorDialog');
  }
}
</script>

<style lang="scss" scoped>
$offsetInactiveDefault: 6px;
$offsetActiveDefault: 0px;
$offsetInactiveVrv: 6px;
$offsetActiveVrv: 3px;

.ToolBar {
  position: relative;
  height: $toolbarHeight;
  transform: translateY($toolbarHeight - $offsetInactiveDefault);
  transition: 200ms;
  transition-property: transform;
  user-select: none;
  cursor: default;

  &.active,
  &.paused {
    transform: translateY($offsetActiveDefault);
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
    background: linear-gradient(transparent, rgba($color: $background500, $alpha: 0.75));
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
        height: 32px;
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

// VRV specific styles
.ToolBar.vrv {
  transform: translateY($toolbarHeight - $offsetInactiveVrv);

  &.active,
  &.paused {
    transform: translateY($offsetActiveVrv);
  }
}
</style>
