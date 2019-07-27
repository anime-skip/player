<template>
  <div
    id="AnimeSkipPlayer"
    :class="{ active: isActive, paused: isPaused }"
    @mouseenter.prevent="toggleActive(true)"
    @mouseleave.prevent="toggleActive(false)"
    @mousemove.prevent="toggleActive(true)"
    @click.prevent="togglePlayPause()"
  >
    <div class="left-content">
    </div>
    <div class="right-content">
    </div>
    <ToolBar
      class="bottom-content"
      :isActive="isActive"
      :isPaused="isPaused"
      :togglePlayPause="togglePlayPause"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Img from '@Shared/components/Img.vue';
import ToolBar from './components/Toolbar.vue';

@Component({
  components: { Img, ToolBar },
})
export default class Player extends Vue {

  public isActive: boolean = false;
  public isEditing: boolean = false;
  public isLoading: boolean = false;
  public isPaused: boolean = true;
  public activeTimer?: number;
  public activeTimeout: number = 2000;

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
    this.isPaused = false;
    video.play();
  }
  public pause() {
    this.isPaused = true;
    video.pause();
  }
  public togglePlayPause() {
    this.isPaused ? this.play() : this.pause();
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
  grid-template-areas: "left-content right-content" "toolbar toolbar";
  overflow: hidden;
  cursor: none;
  &.active, &.paused {
    cursor: pointer;
  }
  &.paused {
    background-color: rgba($color: $background500, $alpha: 0.48);
  }

  .left-content {
    grid-area: left-content;
  }

  .right-content {
    grid-area: right-content;
  }

  .bottom-content {
    grid-area: toolbar;
  }
}
</style>
