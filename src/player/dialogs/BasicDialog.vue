<template>
  <transition name="dialog">
    <div
      v-if="name === activeDialog"
      class="BasicDialog"
      :id="name"
      :style="`align-items: ${gravityX}; justify-content: ${gravityY}`"
      @click.stop="dismiss()"
    >
      <div class="dialog-root-container" @click.stop>
        <slot />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { ActionTypes } from '@/common/store/actionTypes';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    name: { type: String, required: true },
    gravityX: {
      type: String as PropType<'center' | 'flex-start' | 'flex-end'>,
      default: 'center',
    },
    gravityY: {
      type: String as PropType<'center' | 'flex-start' | 'flex-end'>,
      default: 'center',
    },
  },
  emits: ['show', 'hide'],
  watch: {
    activeDialog(currentDialog?: string, prevDialog?: string) {
      if (currentDialog === prevDialog) return;

      if (this.name === currentDialog && this.name !== prevDialog) {
        this.$emit('show');
      } else if (this.name === prevDialog && this.name !== currentDialog) {
        this.$emit('hide');
      }
    },
  },
  computed: {
    activeDialog(): string | undefined {
      return this.$store.state.activeDialog;
    },
  },
  methods: {
    dismiss(): void {
      this.$store.dispatch(ActionTypes.SHOW_DIALOG, undefined);
    },
  },
});
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
    overflow-x: hidden;

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
