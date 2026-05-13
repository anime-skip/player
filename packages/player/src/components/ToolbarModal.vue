<script lang="ts" setup>
import { View } from '../composables/useView';

const props = defineProps<{
  /**
   * The singular "view" that this modal will show. See `useView` for more
   * details.
   */
  view: View;
  /** Class attribute of the modal, useful for specifying it's size */
  modalClass?: string;
}>();

const { view: currentView } = useView();

function toggle() {
  currentView.value = currentView.value === props.view ? undefined : props.view;
}
</script>

<template>
  <div class="relative">
    <slot name="button" :toggle="toggle" />

    <!-- Dialog -->
    <transition name="slide-up">
      <div
        v-if="currentView === props.view"
        class="absolute bottom-full right-0 mb-6 overflow-y-auto rounded bg-base-100 shadow-xl"
        :class="modalClass"
      >
        <slot name="modal" />
      </div>
    </transition>
  </div>
</template>
