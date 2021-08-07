<template>
  <transition name="dialog">
    <div
      v-if="visible"
      class="BasicDialog absolute inset-0 flex flex-col cursor-pointer overflow-visible"
      :id="name"
      :style="`align-items: ${gravityX}; justify-content: ${gravityY}`"
      @click.stop="dismiss()"
    >
      <Card
        class="dialog-root-container overflow-x-hidden overflow-y-auto cursor-auto rounded-md"
        :elevation="8"
        @click.stop
      >
        <slot />
      </Card>
    </div>
  </transition>
</template>

<script lang="ts">
import { ActionTypes } from '@/common/store/actionTypes';
import { defineComponent, PropType } from 'vue';
import { Store } from '@/common/store';

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
    isShowing: {
      type: Function as PropType<(dialogName: string, activeDialog?: string) => boolean>,
      default: undefined,
    },
    hideDialog: { type: Function as PropType<(store: Store) => void>, default: undefined },
  },
  emits: {
    show: () => true,
    hide: () => true,
  },
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
    visible(): boolean {
      if (this.isShowing) {
        return this.isShowing(this.name, this.activeDialog);
      }
      return this.name === this.activeDialog;
    },
  },
  methods: {
    dismiss(): void {
      if (this.hideDialog) {
        this.hideDialog(this.$store);
      } else {
        this.$store.dispatch(ActionTypes.SHOW_DIALOG, undefined);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import '@anime-skip/ui/theme.scss';

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
  z-index: 2;
  * {
    padding: 0;
    margin: 0;
    text-align: left;
  }

  .dialog-root-container {
    background-color: $backgroundColor-background !important;
    transform: translate(0px, 0px);
    transition: 250ms;
    transition-property: transform, opacity;

    scrollbar-width: thin;
    scrollbar-color: rgba($color: $backgroundColor-primary, $alpha: $opacity-low)
      $backgroundColor-background;

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
