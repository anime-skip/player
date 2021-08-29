<template>
  <transition name="dialog">
    <div
      v-if="isVisible"
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

<script lang="ts" setup>
import { PropType } from 'vue';
import { useDialogState, useHideDialog } from '../state/useDialogState';

const props = defineProps({
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
  hideDialog: { type: Function as PropType<() => void>, default: undefined },
});
const emits = defineEmits({
  show: () => true,
  hide: () => true,
});

const dialogState = useDialogState();
const isVisible = computed(() => {
  return (
    props.isShowing?.(props.name, dialogState.activeDialog) ??
    props.name === dialogState.activeDialog
  );
});
watch(
  () => dialogState.activeDialog,
  (newDialog, oldDialog) => {
    if (newDialog === oldDialog) return;

    if (props.name === newDialog && props.name !== oldDialog) {
      emits('show');
    } else if (props.name === oldDialog && props.name !== newDialog) {
      emits('hide');
    }
  }
);

const hideDialog = useHideDialog();
function dismiss() {
  props.hideDialog?.() ?? hideDialog();
}
</script>

<style lang="scss" scoped>
@import '@anime-skip/ui/variables-theme.scss';

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
