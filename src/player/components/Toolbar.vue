<template>
  <div
    class="ToolBar"
    :class="{
      active: isActive,
      paused: playerState.isPaused,
    }"
    @click.stop
  >
    <Timeline
      class="timeline"
      :class="{ 'timeline-hidden': !duration }"
      :isFlipped="!playerState.isPaused && !isActive"
      :currentTime="currentTime"
      :duration="duration"
      :updateTime="updateTime"
      :timestamps="timestamps"
    />
    <div class="buttons">
      <ToolbarButton class="margin-right" @click="togglePlayPause()">
        <PlayPauseButton :state="playerState.isPaused ? 1 : 0" />
      </ToolbarButton>
      <ToolbarButton class="margin-right" icon="ic_next_episode.svg" v-if="false" />
      <VolumeButton />
      <div class="divider margin-right" />
      <ToolbarButton
        v-if="timestamps.length > 0"
        class="margin-right"
        icon="ic_prev_timestamp.svg"
        @click="previousTimestamp()"
      />
      <ToolbarButton
        v-if="timestamps.length > 0"
        class="margin-right"
        icon="ic_next_timestamp.svg"
        @click="nextTimestamp()"
      />
      <div class="divider margin-right" v-if="timestamps.length > 0" />
      <p class="current-time">
        {{ formattedTime }}&ensp;/&ensp;<span>{{ displayDuration }}</span>
      </p>
      <div class="space" />
      <ToolbarButton
        class="margin-left"
        icon="ic_timestamps.svg"
        title="Timestamps"
        @click="toggleTimestampsDialog"
      />
      <ToolbarButton
        v-if="isSaveTimestampsAvailable"
        class="margin-left"
        icon="ic_save_changes.svg"
        title="Save Changes"
        @click="saveChanges()"
      />
      <div class="divider margin-left" />
      <ToolbarButton
        class="margin-left margin-right"
        icon="ic_more.svg"
        @click="toggleAccountDialog"
      />
      <ToolbarButton v-if="isFullscreenEnabled" @click="toggleFullscreen()">
        <FullscreenButton :state="isFullscreen ? 0 : 1" :key="isFullscreenCount" />
      </ToolbarButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Timeline from './Timeline.vue';
import ToolbarButton from './ToolbarButton.vue';
import AccountDialog from '../dialogs/AccountDialog.vue';
import PlayPauseButton from './animations/PlayPauseButton.vue';
import FullscreenButton from './animations/FullscreenButton.vue';
import VolumeButton from './animations/VolumeButton.vue';
import Utils from '@/common/utils/Utils';
import WebExtImg from '@/common/components/WebExtImg.vue';
import VideoControllerMixin from '@/common/mixins/VideoController';
import KeyboardShortcutMixin, { KeyboardShortcutMap } from '@/common/mixins/KeyboardShortcuts';
import { FRAME } from '@/common/utils/Constants';
import { MutationTypes } from '@/common/store/mutationTypes';
import { ActionTypes } from '@/common/store/actionTypes';
import { GetterTypes } from '@/common/store/getterTypes';

export default defineComponent({
  name: 'Toolbar',
  components: {
    Timeline,
    PlayPauseButton,
    ToolbarButton,
    FullscreenButton,
    VolumeButton,
    AccountDialog,
    WebExtImg,
  },
  mixins: [VideoControllerMixin, KeyboardShortcutMixin],
  props: {
    playerState: {
      type: Object as PropType<PlayerState>,
      required: true,
    },
  },
  created() {
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
  },
  data() {
    return {
      currentTime: 0,
      isFullscreen: Utils.isFullscreen(),
      isFullscreenCount: 0,
      displayDuration: 'Loading...',
      isFullscreenEnabled: document.fullscreenEnabled,
    };
  },
  computed: {
    timestamps(): Api.AmbiguousTimestamp[] {
      return this.$store.getters[GetterTypes.TIMESTAMPS];
    },
    preferences(): Api.Preferences | undefined {
      return this.$store.getters[GetterTypes.PREFERENCES];
    },
    activeDialog(): string | undefined {
      return this.$store.state.activeDialog;
    },
    isEditing(): boolean {
      return this.$store.state.isEditing;
    },
    activeTimestamp(): Api.AmbiguousTimestamp | undefined {
      return this.$store.state.activeTimestamp;
    },
    isSavingTimestamps(): boolean {
      return this.$store.getters[GetterTypes.IS_SAVING_TIMESTAMPS];
    },
    duration(): number | undefined {
      return this.$store.getters[GetterTypes.DURATION];
    },
    isActive(): boolean {
      return this.playerState.isActive || this.isEditing;
    },
    activeTimestamps(): Api.AmbiguousTimestamp[] {
      if (this.isEditing) {
        return this.$store.getters[GetterTypes.DRAFT_TIMESTAMPS];
      }
      return this.timestamps;
    },
    formattedTime(): string {
      // TODO: compose this
      return Utils.formatSeconds(this.currentTime, this.playerState.isPaused);
    },
    isSaveTimestampsAvailable(): boolean {
      return this.isEditing && !this.isSavingTimestamps;
    },
  },
  methods: {
    setActiveTimestamp(timestamp: Api.AmbiguousTimestamp): void {
      this.$store.commit(MutationTypes.SET_ACTIVE_TIMESTAMP, timestamp);
    },
    setEditTimestampMode(mode: 'add' | 'edit' | undefined): void {
      this.$store.commit(MutationTypes.SET_EDIT_TIMESTAMP_MODE, mode);
    },
    setDuration(duration?: number): void {
      this.$store.commit(MutationTypes.SET_DURATION, duration);
    },
    showDialog(dialogName?: string): void {
      this.$store.dispatch(ActionTypes.SHOW_DIALOG, dialogName);
    },
    async createNewTimestamp(): Promise<void> {
      this.$store.dispatch(ActionTypes.CREATE_NEW_TIMESTAMP, undefined);
    },
    async addMissingDurations(duration: number): Promise<void> {
      this.$store.dispatch(ActionTypes.ADD_MISSING_DURATIONS, duration);
    },
    async saveChanges(discard?: boolean): Promise<void> {
      this.$store.dispatch(ActionTypes.STOP_EDITING, discard);
    },
    toggleFullscreen(): void {
      this.isFullscreen = !Utils.isFullscreen();
      if (this.isFullscreen) {
        Utils.enterFullscreen();
      } else {
        Utils.exitFullscreen();
      }
    },
    updateDuration(duration: number) {
      this.setDuration(duration);
      if (duration === 0) {
        this.displayDuration = 'Loading...';
      }
      this.displayDuration = Utils.formatSeconds(duration, false);
      this.addMissingDurations(duration);
    },
    updateTime(newTime: number, updateVideo?: boolean) {
      if (updateVideo) {
        this.setCurrentTime(newTime);
      }
      this.currentTime = Utils.boundedNumber(newTime, [0, this.duration]);
    },
    addTime(seconds: number): void {
      this.currentTime = Utils.boundedNumber(this.currentTime + seconds, [0, this.duration]);
      this.updateTime(this.currentTime, true);
    },
    nextTimestamp(): void {
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
          this.showDialog('TimestampsPanel');
        }
      } else if (video.duration) {
        this.updateTime(video.duration, true);
      } else {
        console.warn(
          'Tried to go to next timestamp, but there was not one and the duration had not been initalized'
        );
      }
    },
    previousTimestamp(): void {
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
          this.showDialog('TimestampsPanel');
        }
      } else {
        this.updateTime(0, true);
      }
    },
    toggleAccountDialog(): void {
      this.showDialog(this.activeDialog === 'AccountDialog' ? undefined : 'AccountDialog');
    },
    toggleTimestampsDialog(): void {
      this.showDialog(this.activeDialog === 'TimestampsPanel' ? undefined : 'TimestampsPanel');
    },
    setupKeyboardShortcuts(): KeyboardShortcutMap {
      return {
        // General Controls
        playPause: () => this.togglePlayPause(),
        toggleFullscreen: () => this.toggleFullscreen(),
        hideDialog: this.showDialog,
        nextTimestamp: () => this.nextTimestamp(),
        previousTimestamp: () => this.previousTimestamp(),
        // Advance Time
        advanceFrame: () => this.addTime(FRAME),
        advanceSmall: () => this.addTime(2),
        advanceMedium: () => this.addTime(5),
        advanceLarge: () => this.addTime(90),
        // Rewind Time
        rewindFrame: () => this.addTime(-FRAME),
        rewindSmall: () => this.addTime(-2),
        rewindMedium: () => this.addTime(-5),
        rewindLarge: () => this.addTime(-85),
        // Editing
        createTimestamp: () => {
          if (this.activeTimestamp == null) {
            this.createNewTimestamp();
          }
        },
        saveTimestamps: () => {
          if (!this.isSaveTimestampsAvailable) return;
          this.saveChanges();
        },
        discardChanges: () => {
          if (!this.isSaveTimestampsAvailable) return;
          this.saveChanges(true);
        },
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.ToolBar {
  position: relative;
  // hide 1px of the timeline under the video's bounding box
  transform: translateY($toolbarHeight + 1px);
  transition: 200ms;
  transition-property: transform;
  user-select: none;
  cursor: default;

  &.active,
  &.paused {
    transform: translateY(0px);
  }

  &::before {
    content: '';
    z-index: -1;
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
    &::before {
      opacity: 1;
    }
  }
  &.paused {
    &::before {
      opacity: 0;
    }
  }

  .timeline {
    // Line bottom of background with top of buttons
    margin-bottom: -2px;
  }

  .timeline-hidden {
    opacity: 0;
    pointer-events: none;
  }

  .buttons {
    height: $toolbarHeight;
    padding: 0 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
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
</style>
