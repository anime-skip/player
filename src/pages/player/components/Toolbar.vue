<template>
  <div
    class="ToolBar"
    :class="{ active: isActive, paused: isPaused }"
    @click.stop="onClick()"
  >
    <div class="gradient"></div>
    <div class="content">
      <Timeline :isActive="isActive" />
      <div class="buttons">
        <ToolbarButton @click.native="setPaused(!isPaused)">
          <PlayPauseButton :isPaused="isPaused" />
        </ToolbarButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Timeline from './Timeline.vue';
import ToolbarButton from './ToolbarButton.vue';
import PlayPauseButton from './animations/PlayPauseButton.vue';

@Component({
  components: { Timeline, PlayPauseButton, ToolbarButton },
})
export default class ToolBar extends Vue {
  @Prop(Boolean) public isActive!: boolean;
  @Prop(Boolean) public isPaused!: boolean;
  @Prop(Boolean) public setPaused!: (isPaused: boolean) => void;

  public onClick(): void {
    // event.preventDefault();
    // event.stopPropagation();
    console.log('Clicked');
  }
}
</script>

<style lang="scss" scoped>
$height: 56px;
.ToolBar {
  position: relative;
  height: $height;
  transform: translateY($height - 3px);
  transition: 200ms;
  transition-property: transform;
  cursor: unset;
  &.active,
  &.paused {
    transform: translateY(0);
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
    background: linear-gradient(
      transparent,
      rgba($color: $background500, $alpha: 0.75)
    );
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
    .buttons {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
}
</style>
