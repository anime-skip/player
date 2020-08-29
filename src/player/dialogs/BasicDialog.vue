<template>
  <transition name="dialog">
    <div
      v-if="name === activeDialog"
      class="BasicDialog"
      :id="name"
      :style="`align-items: ${gravityX}`"
      @click.stop="dismiss()"
    >
      <div class="row" :style="`justify-content: ${gravityY}`">
        <div class="dialog-root-container" @click.stop>
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Mutation, Getter, Action } from '@/common/utils/VuexDecorators';

@Component
export default class BasicDialog extends Vue {
  @Prop({ type: String, required: true }) public name!: string;
  @Prop({ type: String, default: 'center' }) public gravityX!: 'center' | 'flex-start' | 'flex-end';
  @Prop({ type: String, default: 'center' }) public gravityY!: 'center' | 'flex-start' | 'flex-end';

  @Getter() activeDialog?: string;

  @Action('showDialog') hideDialog!: () => void;

  @Watch('activeDialog')
  public onChangeActiveDialog(currentDialog: string, prevDialog: string) {
    console.log('[BasicDialog] onChangeActiveDialog', { currentDialog, prevDialog });
    if (currentDialog === prevDialog) return;

    if (this.name === currentDialog && this.name !== prevDialog) {
      this.$emit('show');
    } else if (this.name === prevDialog && this.name !== currentDialog) {
      this.$emit('hide');
    }
  }

  public dismiss(): void {
    this.hideDialog();
  }
}
</script>

<style lang="scss" scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition-property: opacity;
  transition-duration: 250ms;
}
.dialog-enter,
.dialog-leave-to {
  opacity: 0;
}
.dialog-enter-to,
.dialog-leave {
  opacity: 1;
}

.BasicDialog {
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  cursor: pointer;
  overflow: visible;
  & * {
    padding: 0;
    margin: 0;
    text-align: left;
  }

  .row {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .dialog-root-container {
    border-radius: 4px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 6px 10px rgba(0, 0, 0, 0.22),
      0 2px 5px rgba(0, 0, 0, 0.4);
    background-color: $background500;
    transform: translate(0px, 0px);
    transition: 250ms;
    transition-property: transform, opacity;
    cursor: auto;

    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: $divider #00000000;

    &::-webkit-scrollbar {
      width: 8px;
      padding: 1px;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #484848;
      border-radius: 5px;
    }
  }
}
</style>
