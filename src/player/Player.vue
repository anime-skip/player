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
import { Component, Vue, Mixins } from 'vue-property-decorator';
import WebExtImg from '@/common/components/WebExtImg.vue';
import Loading from '@/common/components/Loading.vue';
import ToolBar from './components/Toolbar.vue';
import EpisodeInfo from './components/EpisodeInfo.vue';
import AccountDialog from './dialogs/AccountDialog.vue';
import TimestampsPanel from './dialogs/TimestampsPanel.vue';
import EditEpisodeDialog from './dialogs/EditEpisodeDialog.vue';
import KeyboardShortcutMixin from '@/common/mixins/KeyboardShortcuts';
import { Action, Mutation, Getter } from '@/common/utils/VuexDecorators';
import Browser from '@/common/utils/Browser';
import VideoControllerMixin from '../common/mixins/VideoController';

@Component({
  components: {
    WebExtImg,
    ToolBar,
    EpisodeInfo,
    AccountDialog,
    EditEpisodeDialog,
    Loading,
    TimestampsPanel,
  },
})
export default class Player extends Mixins(KeyboardShortcutMixin, VideoControllerMixin) {
  public playerState: PlayerState = {
    isActive: false,
    isBuffering: false,
    isPaused: global.getVideo().paused,
    isLoadingEpisodeInfo: false,
    isFullscreen: false,
    isMuted: global.getVideo().muted,
  };

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public activeTimer?: any;
  public activeTimeout = 2000;

  @Getter() playbackRate!: number;
  @Getter() isEditing!: boolean;
  @Getter() tabUrl!: string;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  @Mutation() public restoreState!: (payload: { changes: any; callback?: () => void }) => void;
  @Mutation() public changePlaybackRate!: (playbackRate: number) => void;
  @Mutation() public setTabUrl!: (url: string) => void;
  @Mutation() public setHasSkippedFromZero!: (newValue: boolean) => void;

  @Action() public loadAllEpisodeData!: (url?: string) => void;

  constructor() {
    super();
    Browser.storage.addListener((changes: Partial<VuexState>) => {
      this.restoreState({ changes });
    });
  }

  public mounted(): void {
    this.loadAllEpisodeData();

    global.onVideoChanged(video => {
      this.changePlaybackRate(this.playbackRate);
      video.onplay = () => this.onPlay();
      video.onpause = () => this.onPause();
      this.playerState.isPaused = video.paused;

      // Managing the buffer
      video.onplaying = () => {
        this.playerState.isBuffering = false;
      };
      video.onwaiting = () => {
        this.playerState.isBuffering = true;
      };
    });

    browser.runtime.onMessage.addListener(this.onReceiveMessage);
  }

  public destroyed() {
    browser.runtime.onMessage.removeListener(this.onReceiveMessage);
  }

  public get isActive(): boolean {
    return this.playerState.isActive || this.isEditing;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  public onReceiveMessage({ type, payload: url }: any) {
    if (type != '@anime-skip/changeUrl') return;

    console.debug('Change URL: ' + url);
    this.setTabUrl(url);
    this.setHasSkippedFromZero(false);
    this.loadAllEpisodeData();
  }

  public toggleActive(isActive: boolean) {
    Vue.set(this.playerState, 'isActive', isActive);
    if (this.activeTimer != null) {
      clearTimeout(this.activeTimer);
    }
    if (isActive) {
      this.activeTimer = setTimeout(() => {
        this.toggleActive(false);
      }, this.activeTimeout);
    }
  }

  public onPlay() {
    Vue.set(this.playerState, 'isPaused', false);
    this.toggleActive(true);
  }
  public onPause() {
    Vue.set(this.playerState, 'isPaused', true);
  }
}
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
