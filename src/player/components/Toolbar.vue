<template>
  <div
    class="ToolBar"
    :class="{
      vrv: service === 'vrv',
      active: isActive,
      paused: playerState.isPaused,
    }"
    @click.stop
  >
    <div class="gradient" />
    <div class="content">
      <Timeline
        :isFlipped="!playerState.isPaused && !isActive"
        :currentTime="currentTime"
        :duration="duration"
        :updateTime="updateTime"
        :timestamps="timestamps"
        @seek="onSeek"
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
          {{ formattedTime }}&ensp;/&ensp;<span>{{ displayDuration }}</span>
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
          icon="ic_save_changes.svg"
          title="Save Timestamps"
          @click.native="stopEditing()"
        />
        <ToolbarButton
          v-if="isEditing"
          class="margin-left"
          icon="ic_discard_changes.svg"
          title="Discard Changes"
          @click.native="stopEditing(true)"
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
import AccountDialog from '../dialogs/AccountDialog.vue';
import PlayPauseButton from './animations/PlayPauseButton.vue';
import FullscreenButton from './animations/FullscreenButton.vue';
import VolumeButton from './animations/VolumeButton.vue';
import Utils from '@/common/utils/Utils';
import Browser from '@/common/utils/Browser';
import { Getter, Action, Mutation } from '@/common/utils/VuexDecorators';
import WebExtImg from '@/common/components/WebExtImg.vue';
import VideoControllerMixin from '@/common/mixins/VideoController';
import KeyboardShortcutMixin from '../../common/mixins/KeyboardShortcuts';
import { FRAME } from '../../common/utils/Constants';

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
  public displayDuration: string = 'Loading...';
  public duration: number = 0;
  public isFullscreenEnabled = document.fullscreenEnabled;
  public service = global.service;

  @Getter() public timestamps!: Api.Timestamp[];
  @Getter() public preferences?: Api.Preferences;
  @Getter() public activeDialog?: string;
  @Getter() public isEditing!: boolean;
  @Getter() public episodeUrl!: boolean;
  @Getter() public isLoggedIn?: boolean;

  @Action() public startEditing!: () => void;
  @Action() public stopEditing!: (discard: boolean) => void;

  @Action() public showDialog!: (dialogName?: string) => void;
  @Mutation() public setActiveTimestamp!: (timestamp: Api.AmbigousTimestamp) => void;
  @Mutation() public setEditTimestampMode!: (mode: 'add' | 'edit' | undefined) => void;

  constructor() {
    super();
    global.onVideoChanged(video => {
      video.addEventListener('durationchange', (event: Event) => {
        this.updateDuration((event.target as HTMLVideoElement).duration);
      });
      this.updateTime(video.currentTime);
      video.ontimeupdate = () => {
        this.updateTime(video.currentTime);
      };
    });
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = Utils.isFullscreen();
      this.isFullscreenCount++;
    });
    Utils.waitForVideoLoad().then(this.updateDuration);
  }

  public get isActive(): boolean {
    return this.playerState.isActive || this.isEditing;
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
    this.duration = duration;
    if (duration === 0) {
      this.displayDuration = 'Loading...';
    }
    this.displayDuration = Utils.formatSeconds(duration, false);
  }

  public updateTime(newTime: number, updateVideo?: boolean) {
    if (updateVideo) {
      console.log('Setting time to: ' + newTime);
      this.setCurrentTime(newTime);
    }
    this.currentTime = newTime;
  }

  public onSeek(newTime: number) {
    this.currentTime = newTime;
    this.updateTime(newTime, true);
  }

  public addTime(seconds: number): void {
    this.updateTime((this.currentTime += seconds), true);
  }

  public get activeTimestamps(): Api.AmbigousTimestamp[] {
    if (this.isEditing) {
      return this.$store.getters.draftTimestamps;
    }
    return this.timestamps;
  }

  public nextTimestamp(): void {
    const nextTimestamp = Utils.nextTimestamp(
      this.currentTime + 0.1,
      this.activeTimestamps,
      undefined
    );
    const video = global.getVideo();
    if (nextTimestamp) {
      this.updateTime(nextTimestamp.at, true);
      if (this.isEditing) {
        this.pause();
        this.setActiveTimestamp(nextTimestamp);
        this.setEditTimestampMode('edit');
        this.showDialog('EditTimestampPanel');
      }
    } else if (video.duration) {
      this.updateTime(video.duration, true);
    } else {
      console.warn(
        'Tried to go to next timestamp, but there was not one and the duration had not been initalized'
      );
    }
  }

  public previousTimestamp(): void {
    const previousTimestamp = Utils.previousTimestamp(
      this.currentTime,
      this.activeTimestamps,
      undefined
    );
    if (previousTimestamp) {
      this.updateTime(previousTimestamp.at, true);
      if (this.isEditing) {
        this.pause();
        this.setActiveTimestamp(previousTimestamp);
        this.setEditTimestampMode('edit');
        this.showDialog('EditTimestampPanel');
      }
    } else {
      this.updateTime(0, true);
    }
  }

  // prettier-ignore
  keyboardShortcuts: { [combination: string]: () => void } = {
    // General Controls
    'D': () => this.togglePlayPause(),
    'ESC': this.showDialog,
    // Advance Time
    'L': () => {
      this.addTime(FRAME);
      return true;
    },
    'V': () => this.addTime(2),
    'F': () => this.addTime(5),
    'R': () => this.addTime(90),
    'E': () => this.nextTimestamp(),
    // Rewind Time
    'J': () => {
      this.addTime(-FRAME);
      return true;
      },
    'X': () => this.addTime(-2),
    'S': () => this.addTime(-5),
    'W': () => this.addTime(-85),
    'C': () => this.previousTimestamp(),
  }

  public toggleAccountDialog(): void {
    this.showDialog(this.activeDialog === 'AccountDialog' ? undefined : 'AccountDialog');
  }

  public get formattedTime(): string {
    return Utils.formatSeconds(this.currentTime, this.playerState.isPaused);
  }

  // Edit Mode

  public startEditMode() {
    this.startEditing();

    if (!this.episodeUrl) {
      this.showEditEpisodeDialog();
    }
  }

  public showEditEpisodeDialog() {
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
    background: linear-gradient(transparent, rgba($color: $background500, $alpha: 0.6));
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
