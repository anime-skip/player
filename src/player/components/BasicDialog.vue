<template>
  <div
    class="BasicDialog"
    :style="`align-items: ${gravityX}`"
    :class="{ visible: isVisible }"
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
import { Mutation, Getter } from '@/common/utils/VuexDecorators';

@Component
export default class BasicDialog extends Vue {
  @Prop(String) public name!: string;
  @Prop({ type: String, default: 'center' }) public gravityX!:
    | 'center'
    | 'start'
    | 'end';
  @Prop({ type: String, default: 'center' }) public gravityY!:
    | 'center'
    | 'start'
    | 'end';

  @Getter() activeDialog?: string;

  @Mutation('showDialog') hideDialog!: () => void;

  public get isVisible(): boolean {
    return this.name === this.activeDialog;
  }

  public dismiss(): void {
    console.log('dismissing');
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
  background-color: rgba(0, 0, 0, 0.5);
  padding-bottom: 32px;
  opacity: 0;
  transition: 500ms;
  transition-property: opacity;
  pointer-events: none;

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
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    background-color: $background500;
    transform: translate(0px, 100px);
    transition: 500ms;
    transition-property: transform, opacity;
  }
}
</style>
