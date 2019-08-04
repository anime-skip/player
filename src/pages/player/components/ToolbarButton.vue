<template>
  <div class="ToolbarButton">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ToolbarButton extends Vue {}
</script>

<style lang="scss" scoped>
.ToolbarButton {
  height: 33px;
  background-color: transparent;
  border-radius: 4px;
  transition: 200ms;
  transition-property: background-color;
  &:hover {
    background-color: rgba($color: #ffffff, $alpha: 0.06);
  }
  &:hover:active {
    background-color: rgba($color: #ffffff, $alpha: 0.12);
  }
}
</style>
