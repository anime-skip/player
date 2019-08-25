<template>
  <div
    id="AnimeSkipPlayer"
    :class="{
      active: playerState.isActive,
      paused: playerState.isPaused,
      buffering: playerState.isBuffering,
    }"
    @mouseenter.prevent="toggleActive(true)"
    @mouseleave.prevent="toggleActive(false)"
    @mousemove.prevent="toggleActive(true)"
    @click="togglePlayPause()"
  >
    <div class="left-content">
      <EpisodeInfo :episode="episode" />
    </div>
    <div class="right-content"></div>
    <ToolBar
      class="bottom-content"
      :playerState="playerState"
      :setPaused="setPaused"
      :timestamps="timestamps"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Img from '@Shared/components/Img.vue';
import ToolBar from './components/Toolbar.vue';
import EpisodeInfo from './components/EpisodeInfo.vue';
import KeyboardShortcuts from './mixins/KeyboardShortcuts';
import { Action, Mutation } from '../../shared/utils/VuexDecorators';
import Browser from '../../shared/utils/Browser';
import VideoUtils from './VideoUtils';

@Component({
  components: { Img, ToolBar, EpisodeInfo },
  mixins: [KeyboardShortcuts],
})
export default class Player extends Vue {
  public playerState: PlayerState = {
    isActive: false,
    isEditing: false,
    isBuffering: false,
    isPaused: getVideo().paused,
    isLoadingEpisodeInfo: false,
    isFullscreen: false,
    isMuted: getVideo().muted,
  };
  public activeTimer?: number;
  public activeTimeout: number = 2000;
  public timestamps?: Api.Timestamp[];
  public togglePlayPause = VideoUtils.togglePlayPause;

  public episode?: Api.Episode;

  @Action() public initialLoad!: () => void;
  @Action() public fetchEpisode!: (url: string) => void;
  @Mutation() public restoreState!: (storageChanges: any) => void;

  constructor() {
    super();
    onVideoChanged(video => {
      video.onplay = () => this.onPlay();
      video.onpause = () => this.onPause();
    });
    this.initialLoad();
    Browser.storage.addListener((changes: Partial<VuexState>) => {
      console.log('data changed');
      this.restoreState(changes);
    });
    // fetchEpisode();
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
@import url('https://fonts.googleapis.com/css?family=Overpass:300,400,600&display=swap');

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
    background-color: rgba($color: $input700, $alpha: 0.75);
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
}
</style>
