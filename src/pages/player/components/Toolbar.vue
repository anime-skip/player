<template>
  <div class="ToolBar" :class="{ active: isActive, paused: isPaused }">
    <div class="gradient"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Img from '@Shared/components/Img.vue';

@Component
export default class ToolBar extends Vue {

  @Prop(Boolean) public isActive!: boolean;
  @Prop(Boolean) public isPaused!: boolean;
  @Prop(Boolean) public togglePlayPause!: () => void;

}
</script>

<style lang="scss" scoped>
$height: 56px;
.ToolBar {
  position: relative;
  height: $height;
  transform: translateY($height);
  transition: 200ms;
  transition-property: transform;
  &.active, &.paused {
    transform: translateY(0);
  }
  &.paused {
    .gradient {
      background: linear-gradient(transparent, transparent);
    }
  }

  .gradient {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 64px;
    background: linear-gradient(transparent, rgba($color: $background500, $alpha: 0.75));
  }
}
</style>
