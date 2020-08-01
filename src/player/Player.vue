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
    <div class="left-content">
      <EpisodeInfo />
    </div>
    <div class="right-content"></div>
    <ToolBar class="bottom-content" :playerState="playerState" />

    <!-- Dialogs -->
    <EditTimestampPanel />
    <AccountDialog />
    <EpisodeEditorDialog />
    <Loading v-if="buffering" class="buffer-loading-container" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import WebExtImg from '@/common/components/WebExtImg.vue';
import Loading from '@/common/components/Loading.vue';
import ToolBar from './components/Toolbar.vue';
import EpisodeInfo from './components/EpisodeInfo.vue';
import AccountDialog from './dialogs/AccountDialog.vue';
import EditTimestampPanel from './dialogs/EditTimestampPanel.vue';
import EpisodeEditorDialog from './dialogs/EpisodeEditorDialog.vue';
import KeyboardShortcutMixin from '@/common/mixins/KeyboardShortcuts';
import { Action, Mutation, Getter } from '@/common/utils/VuexDecorators';
import Browser from '@/common/utils/Browser';
import Messenger from '@/common/utils/Messenger';
import VideoControllerMixin from '../common/mixins/VideoController';

@Component({
  components: {
    WebExtImg,
    ToolBar,
    EpisodeInfo,
    AccountDialog,
    EpisodeEditorDialog,
    Loading,
    EditTimestampPanel,
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
  public activeTimer?: any;
  public activeTimeout: number = 2000;
  public buffering = false;

  @Getter() playbackRate!: number;
  @Getter() isEditing!: boolean;

  @Mutation() public restoreState!: (payload: { changes: any; callback?: () => void }) => void;
  @Mutation() public changePlaybackRate!: (playbackRate: number) => void;

  @Action() public initialLoad!: (callback?: () => void) => void;
  @Action() public fetchEpisodeByUrl!: (url: string) => void;

  constructor() {
    super();
    Browser.storage.addListener((changes: Partial<VuexState>) => {
      this.restoreState({ changes });
    });
  }

  public created(): void {
    this.initialLoad();
  }

  public mounted(): void {
    global.onVideoChanged(video => {
      this.changePlaybackRate(this.playbackRate);
      this.fetchEpisodeInfo();
      video.onplay = () => this.onPlay();
      video.onpause = () => this.onPause();

      // Managing the buffer
      video.onplaying = () => {
        this.buffering = false;
      };
      video.onwaiting = () => {
        this.buffering = true;
      };
    });
  }

  public get isActive(): boolean {
    return this.playerState.isActive || this.isEditing;
  }

  public fetchEpisodeInfo(): void {
    this.fetchEpisodeByUrl(Browser.getURL());
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

  .left-content {
    opacity: 0;
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
    }
  }

  .right-content {
    grid-area: right-content;
  }

  .bottom-content {
    grid-area: toolbar;
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
}
</style>
