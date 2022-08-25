<template>
  <transition name="as-dialog">
    <div
      v-if="isVisible"
      class="BasicDialog as-absolute as-inset-0 as-flex as-flex-col as-cursor-pointer as-overflow-visible"
      :id="name"
      :style="`align-items: ${gravityX}; justify-content: ${gravityY}`"
      @click.stop="dismiss()"
    >
      <Card
        class="as-dialog-root-container as-bg-background as-overflow-x-hidden as-overflow-y-auto as-cursor-auto as-rounded-md"
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
import { useDialogState, useHideDialog } from '../stores/useDialogState';

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
.as-dialog-enter-active,
.as-dialog-leave-active {
  transition-property: opacity;
  transition-duration: 250ms;
}
.as-dialog-enter,
.as-dialog-leave-to {
  opacity: 0;
}
.as-dialog-enter-to,
.as-dialog-leave {
  opacity: 1;
}

.BasicDialog {
  z-index: 2;
  * {
    padding: 0;
    margin: 0;
    text-align: left;
  }

  .as-dialog-root-container {
    transform: translate(0px, 0px);
    transition: 250ms;
    transition-property: transform, opacity;
  }
}
</style>
