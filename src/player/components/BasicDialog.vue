<template>
  <div
    class="BasicDialog"
    :id="name"
    :style="`align-items: ${gravityX}`"
    :class="{ visible: isVisible, dim: isDim }"
    @click.stop="dismiss()"
  >
    <div class="row" :style="`justify-content: ${gravityY}`" v-if="isVisible">
      <div class="container" @click.stop>
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Mutation, Getter, Action } from '@/common/utils/VuexDecorators';

@Component
export default class BasicDialog extends Vue {
  @Prop(String) public name!: string;
  @Prop({ type: String, default: 'center' }) public gravityX!: 'center' | 'start' | 'end';
  @Prop({ type: String, default: 'center' }) public gravityY!: 'center' | 'start' | 'end';
  @Prop(Boolean) public isDim?: boolean;

  @Getter() activeDialog?: string;

  @Action('showDialog') hideDialog!: () => void;

  public get isVisible(): boolean {
    return this.name === this.activeDialog;
  }

  public dismiss(): void {
    this.hideDialog();
  }
}
</script>

<style lang="scss" scoped>
.BasicDialog {
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0;
  transition: 250ms;
  transition-property: opacity;
  pointer-events: none;
  cursor: pointer;
  overflow: hidden;

  &.dim {
    background-color: rgba(255, 0, 0, 0.5);
  }

  &.visible {
    opacity: 1;
    pointer-events: unset;

    .container {
      transform: translate(0px, 0px);
    }
  }

  .row {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .container {
    border-radius: 4px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 6px 10px rgba(0, 0, 0, 0.22),
      0 2px 5px rgba(0, 0, 0, 0.4);
    background-color: $background500;
    transform: translate(0px, 100px);
    transition: 250ms;
    transition-property: transform, opacity;
    cursor: pointer;

    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: $divider #00000000;
  }
}
</style>
