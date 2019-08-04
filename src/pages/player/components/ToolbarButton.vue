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
  height: 24px;
  padding: 5px 8px;
  background-color: transparent;
  border-radius: 4px;
  transition: 200ms;
  transition-property: background-color;
  cursor: pointer;
  &:hover {
    background-color: rgba($color: #ffffff, $alpha: 0.06);
  }
  &:hover:active {
    background-color: rgba($color: #ffffff, $alpha: 0.12);
  }
}
</style>
