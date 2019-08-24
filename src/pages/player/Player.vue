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
    @click="setPaused(!playerState.isPaused)"
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
import { TIMESTAMP_ARRAY } from '../../extension/data/timestamps';
import { Action } from '../../shared/utils/VuexDecorators';
import Browser from '../../shared/utils/Browser';

@Component({
  components: { Img, ToolBar, EpisodeInfo },
  mixins: [KeyboardShortcuts],
})
export default class Player extends Vue {
  public playerState: PlayerState = {
    isActive: false,
    isEditing: false,
    isBuffering: false,
    isPaused: video.paused,
    isLoadingEpisodeInfo: false,
    isFullscreen: false,
    isMuted: video.muted,
  };
  public activeTimer?: number;
  public activeTimeout: number = 2000;
  public timestamps?: Api.Timestamp[] = TIMESTAMP_ARRAY;

  public episode: Api.Episode = {
    id: 0,
    name: 'The Demon Tree',
    season: 3,
    absoluteNumber: 49,
    number: 1,
    show: {
      id: 0,
      name: 'Sword Art Online',
    },
  };

  @Action('initialLoad') public initialLoad!: () => void;

  constructor() {
    super();
    video.togglePlayPause = this.togglePlayPause;
    video.onplay = () => this.play();
    video.onpause = () => this.pause();
    this.initialLoad();
    Browser.storage.addListener((changes: Partial<VuexState>) => {
      this.$store.commit('restoreState', changes);
    });
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

  public play() {
    try {
      video.play();
      Vue.set(this.playerState, 'isPaused', false);
      this.toggleActive(true);
    } catch (err) {
      console.error('Failed to play video: ' + err.message, err);
    }
  }
  public pause() {
    try {
      video.pause();
      Vue.set(this.playerState, 'isPaused', true);
    } catch (err) {
      console.error('Failed to pause video: ' + err.message, err);
    }
  }
  public setPaused(isPaused: boolean) {
    isPaused ? this.pause() : this.play();
  }
  public togglePlayPause(): void {
    this.setPaused(!this.playerState.isPaused);
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
