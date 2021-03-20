<template>
  <div
    id="AnimeSkipPlayer"
    class="absolute inset-0 grid overflow-hidden bg-background bg-opacity-0"
    :class="{
      active: isActive,
      'paused bg-opacity-medium': playerState.isPaused,
      'buffering bg-opacity-medium': playerState.isBuffering,
      showing: isEpisodeInfoShowing,
    }"
    @mouseenter.prevent="toggleActive(true)"
    @mouseleave.prevent="toggleActive(false)"
    @mousemove.prevent="toggleActive(true)"
    @click="togglePlayPause()"
  >
    <div
      v-if="playerState.isBuffering && !playerState.isPaused"
      class="absolute inset-0 flex items-center justify-center"
    >
      <Loading />
    </div>
    <div class="left-content opacity-0 pointer-events-none pl-8 pt-8 box-border">
      <EpisodeInfo />
    </div>
    <div class="right-content" />
    <ToolBar class="bottom-content" :player-state="playerState" />

    <!-- Dialogs -->
    <TimestampsPanel />
    <PreferencesDialog />
    <EditEpisodeDialog />
    <LoginDialog />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ToolBar from './components/Toolbar.vue';
import EpisodeInfo from './components/EpisodeInfo.vue';
import LoginDialog from './dialogs/LoginDialog.vue';
import PreferencesDialog from './dialogs/PreferencesDialog.vue';
import TimestampsPanel from './dialogs/TimestampsPanel.vue';
import EditEpisodeDialog from './dialogs/EditEpisodeDialog/index.vue';
import KeyboardShortcutMixin from '@/common/mixins/KeyboardShortcuts';
import Browser from '@/common/utils/Browser';
import VideoControllerMixin from '@/common/mixins/VideoController';
import { MutationTypes } from '@/common/store/mutationTypes';
import { ActionTypes } from '@/common/store/actionTypes';
import { PLAYER_ACTIVITY_TIMEOUT } from '@/common/utils/Constants';
import { GetterTypes } from '@/common/store/getterTypes';
import { State } from '@/common/store/state';
import { Store } from '@/common/store';

export default defineComponent({
  name: 'Player',
  components: {
    ToolBar,
    EpisodeInfo,
    LoginDialog,
    PreferencesDialog,
    EditEpisodeDialog,
    TimestampsPanel,
  },
  mixins: [KeyboardShortcutMixin, VideoControllerMixin],
  created() {
    Browser.storage.addListener(this.onStorageChanged);
    browser.runtime.onMessage.addListener(this.onReceiveMessage);
    global.onVideoChanged(this.onVideoChanged);
  },
  mounted(): void {
    this.loadAllEpisodeData();
  },
  unmounted() {
    browser.runtime.onMessage.removeListener(this.onReceiveMessage);
  },
  data() {
    return {
      activeTimer: undefined as number | undefined,
    };
  },
  computed: {
    playerState(): Store['state']['playerState'] {
      return this.$store.state.playerState;
    },
    playbackRate(): number {
      return this.$store.state.playbackRate;
    },
    isEditing(): boolean {
      return this.$store.state.isEditing;
    },
    tabUrl(): string {
      return this.$store.getters[GetterTypes.TAB_URL];
    },
    isActive(): boolean {
      return this.playerState.isActive || this.isEditing;
    },
    isEpisodeInfoShowing(): boolean {
      return (
        this.playerState.isPaused ||
        (this.playerState.isBuffering && this.$store.state.isInitialBuffer)
      );
    },
  },
  methods: {
    onStorageChanged(changes: Partial<State>): void {
      this.$store.commit(MutationTypes.RESTORE_STATE, { changes }); // TODO! test
    },
    onVideoChanged(video: HTMLVideoElement): void {
      this.changePlaybackRate(this.playbackRate);
      video.onplay = () => this.onPlay();
      video.onpause = () => this.onPause();
      this.$store.commit(MutationTypes.SET_IS_PAUSED, video.paused);

      // Managing the buffer
      video.onplaying = () => {
        this.$store.commit(MutationTypes.SET_IS_BUFFERING, false);
        if (this.$store.state.isInitialBuffer) {
          this.$store.commit(MutationTypes.SET_IS_INITIAL_BUFFER, false);
        }
      };
      video.onwaiting = () => {
        this.$store.commit(MutationTypes.SET_IS_BUFFERING, true);
      };
    },
    changePlaybackRate(playbackRate: number): void {
      this.$store.commit(MutationTypes.CHANGE_PLAYBACK_RATE, playbackRate);
    },
    setTabUrl(url: string): void {
      this.$store.commit(MutationTypes.SET_TAB_URL, url);
    },
    setHasSkippedFromZero(newValue: boolean): void {
      this.$store.commit(MutationTypes.SET_HAS_SKIPPED_FROM_ZERO, newValue);
    },
    loadAllEpisodeData(url?: string): void {
      this.$store.dispatch(ActionTypes.LOAD_ALL_EPISODE_DATA, url);
    },
    onReceiveMessage({ type, payload: url }: { type: string; payload: unknown }) {
      if (type != '@anime-skip/changeUrl') return;

      console.debug('Change URL: ' + url);
      this.setTabUrl(url as string);
      this.setHasSkippedFromZero(false);
      this.loadAllEpisodeData();
    },
    toggleActive(isActive: boolean) {
      this.$store.commit(MutationTypes.SET_IS_ACTIVE, isActive);
      if (this.activeTimer != null) {
        window.clearTimeout(this.activeTimer);
      }
      if (isActive) {
        this.activeTimer = window.setTimeout(() => {
          this.toggleActive(false);
        }, PLAYER_ACTIVITY_TIMEOUT);
      }
    },
    onPlay() {
      this.$store.commit(MutationTypes.SET_IS_PAUSED, false);
      this.toggleActive(true);
    },
    onPause() {
      this.$store.commit(MutationTypes.SET_IS_PAUSED, true);
    },
  },
});
</script>

<style lang="scss">
#AnimeSkipPlayer {
  transition: 200ms;
  transition-property: background-color;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;
  grid-template-areas: 'left-content right-content' 'toolbar toolbar';
  cursor: none;
  &.active,
  &.paused {
    cursor: unset;
  }

  .left-content {
    z-index: 1;
    grid-area: left-content;
    transition: 200ms;
    transition-property: opacity;
  }
  &.showing {
    .left-content {
      opacity: 1;
      pointer-events: unset;
    }
  }

  .right-content {
    z-index: 1;
    grid-area: right-content;
  }

  .bottom-content {
    z-index: 1;
    grid-area: toolbar;
  }
}
</style>
