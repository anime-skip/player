<template>
  <div class="Toast" :class="{ visible }">
    {{ message }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Toast extends Vue {
  @Prop(Boolean) public visible: boolean = false;
  @Prop(String) public message!: string;
}
</script>

<style lang="scss" scoped>
.Toast {
  max-height: 0px;
  color: $textPrimary;
  box-sizing: border-box;
  background-color: $input500;
  border-top: 0px solid $input700;
  overflow: hidden;
  padding: 0 24px;
  line-height: 48px;
  opacity: 0;
  &.visible {
    max-height: unset;
    border-top: 3px solid $input700;
    opacity: 1;
  }
}
</style>
