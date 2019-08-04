<template>
  <div
    id="AnimeSkipPlayer"
    :class="{ active: isActive, paused: isPaused, buffering: isLoading }"
    @mouseenter.prevent="toggleActive(true)"
    @mouseleave.prevent="toggleActive(false)"
    @mousemove.prevent="toggleActive(true)"
    @click="setPaused(!isPaused)"
  >
    <div class="left-content">
      <EpisodeInfo :episode="episode" />
    </div>
    <div class="right-content"></div>
    <ToolBar
      class="bottom-content"
      :isActive="isActive"
      :isPaused="isPaused"
      :setPaused="setPaused"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Img from '@Shared/components/Img.vue';
import ToolBar from './components/Toolbar.vue';
import EpisodeInfo from './components/EpisodeInfo.vue';

@Component({
  components: { Img, ToolBar, EpisodeInfo },
})
export default class Player extends Vue {
  public isActive: boolean = false;
  public isEditing: boolean = false;
  public isLoading: boolean = false;
  public isPaused: boolean = true;
  public activeTimer?: number;
  public activeTimeout: number = 2000;

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

  public toggleActive(isActive: boolean) {
    this.isActive = isActive;
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
    console.log('playing');
    this.isPaused = false;
    video.play();
    this.toggleActive(true);
  }
  public pause() {
    console.log('pausing');
    this.isPaused = true;
    video.pause();
  }
  public setPaused(isPaused: boolean) {
    isPaused ? this.pause() : this.play();
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
    cursor: pointer;
  }
  &.paused,
  &.buffering {
    background-color: rgba($color: $background500, $alpha: 0.75);
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
