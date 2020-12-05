<template>
  <div
    id="AnimeSkipPlayer"
    :class="{
      active: isActive,
      paused: playerState.isPaused,
      buffering: playerState.isBuffering,
    }"
    @mouseenter.prevent="toggleActive(true)"
    @mouseleave.prevent="toggleActive(false)"
    @mousemove.prevent="toggleActive(true)"
    @click="togglePlayPause()"
  >
    <Loading
      v-if="playerState.isBuffering && !playerState.isPaused"
      class="buffer-loading-container"
    />
    <div class="left-content">
      <EpisodeInfo />
    </div>
    <div class="right-content"></div>
    <ToolBar class="bottom-content" :playerState="playerState" />

    <!-- Dialogs -->
    <TimestampsPanel />
    <AccountDialog />
    <EditEpisodeDialog />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import vueMixins from 'vue-typed-mixins';
import WebExtImg from '@/common/components/WebExtImg.vue';
import Loading from '@/common/components/Loading.vue';
import ToolBar from './components/Toolbar.vue';
import EpisodeInfo from './components/EpisodeInfo.vue';
import AccountDialog from './dialogs/AccountDialog.vue';
import TimestampsPanel from './dialogs/TimestampsPanel.vue';
import EditEpisodeDialog from './dialogs/EditEpisodeDialog/index.vue';
import KeyboardShortcutMixin from '@/common/mixins/KeyboardShortcuts';
import Browser from '@/common/utils/Browser';
import VideoControllerMixin from '../common/mixins/VideoController';
import mutationTypes from '@/common/store/mutationTypes';
import actionTypes from '@/common/store/actionTypes';
import { PLAYER_ACTIVITY_TIMEOUT } from '@/common/utils/Constants';

export default vueMixins(KeyboardShortcutMixin, VideoControllerMixin).extend({
  components: {
    WebExtImg,
    ToolBar,
    EpisodeInfo,
    AccountDialog,
    EditEpisodeDialog,
    Loading,
    TimestampsPanel,
  },
  created() {
    Browser.storage.addListener(this.onStorageChanged);
    browser.runtime.onMessage.addListener(this.onReceiveMessage);
    global.onVideoChanged(this.onVideoChanged);
  },
  mounted(): void {
    this.loadAllEpisodeData();
  },
  destroyed() {
    browser.runtime.onMessage.removeListener(this.onReceiveMessage);
  },
  data() {
    // TODO: Put in store
    // TODO: use Vue.set...
    const playerState: PlayerState = {
      isActive: false,
      isBuffering: false,
      isPaused: global.getVideo().paused,
      isLoadingEpisodeInfo: false,
      isFullscreen: false,
      isMuted: global.getVideo().muted,
    };
    return {
      playerState,
      activeTimer: undefined as number | undefined,
    };
  },
  computed: {
    playbackRate(): number {
      return this.$store.state.playbackRate;
    },
    isEditing(): boolean {
      return this.$store.state.isEditing;
    },
    tabUrl(): string {
      return this.$store.getters.tabUrl;
    },
    isActive(): boolean {
      return this.playerState.isActive || this.isEditing;
    },
  },
  methods: {
    onStorageChanged(changes: Partial<VuexState>): void {
      this.$store.commit(mutationTypes.restoreState, changes);
    },
    onVideoChanged(video: HTMLVideoElement): void {
      this.changePlaybackRate(this.playbackRate);
      video.onplay = () => this.onPlay();
      video.onpause = () => this.onPause();
      Vue.set(this.playerState, 'isPaused', video.paused);

      // Managing the buffer
      video.onplaying = () => {
        Vue.set(this.playerState, 'isBuffering', false);
      };
      video.onwaiting = () => {
        Vue.set(this.playerState, 'isBuffering', true);
      };
    },
    changePlaybackRate(playbackRate: number): void {
      this.$store.commit(mutationTypes.changePlaybackRate, playbackRate);
    },
    setTabUrl(url: string): void {
      this.$store.commit(mutationTypes.setTabUrl, url);
    },
    setHasSkippedFromZero(newValue: boolean): void {
      this.$store.commit(mutationTypes.setHasSkippedFromZero, newValue);
    },
    loadAllEpisodeData(url?: string): void {
      this.$store.dispatch(actionTypes.loadAllEpisodeData, url);
    },
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    onReceiveMessage({ type, payload: url }: any) {
      if (type != '@anime-skip/changeUrl') return;

      console.debug('Change URL: ' + url);
      this.setTabUrl(url);
      this.setHasSkippedFromZero(false);
      this.loadAllEpisodeData();
    },
    toggleActive(isActive: boolean) {
      Vue.set(this.playerState, 'isActive', isActive);
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
      Vue.set(this.playerState, 'isPaused', false);
      this.toggleActive(true);
    },
    onPause() {
      Vue.set(this.playerState, 'isPaused', true);
    },
  },
});
</script>

<style lang="scss">
#AnimeSkipPlayer {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: grid;
  transition: 200ms;
  transition-property: background-color;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;
  grid-template-areas: 'left-content right-content' 'toolbar toolbar';
  overflow: hidden;
  cursor: none;
  &.active,
  &.paused {
    cursor: unset;
  }
  &.paused,
  &.buffering {
    background-color: rgba($color: $input700, $alpha: 0.48);
  }
  * {
    font-family: 'Overpass', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .buffer-loading-container {
    position: absolute;
    z-index: 0;
    display: flex;
    flex-direction: column;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba($color: $background500, $alpha: 0.5);

    * {
      background-color: transparent;
    }
  }

  .left-content {
    z-index: 1;
    opacity: 0;
    pointer-events: none;
    grid-area: left-content;
    transition: 200ms;
    transition-property: opacity;
    padding-left: 32px;
    padding-top: 32px;
    box-sizing: border-box;
  }
  &.paused {
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
