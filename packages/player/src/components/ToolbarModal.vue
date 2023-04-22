<script lang="ts" setup>
import { View } from '../composables/useView';

const props = defineProps<{
  /**
   * The singular "view" that this modal will show. See `useView` for more details.
   */
  view: View;
  /**
   * Class attribute of the modal, useful for specifying it's size
   */
  modalClass?: string;
}>();

const currentView = useView();

function toggle() {
  currentView.value = currentView.value === props.view ? undefined : props.view;
}
</script>

<template>
  <div class="relative">
    <slot name="button" :toggle="toggle" />

    <!-- Dialog -->
    <transition>
      <div
        v-if="currentView === props.view"
        class="bg-base-100 rounded shadow-xl absolute right-0 bottom-full mb-6"
        :class="modalClass"
      >
        <slot name="modal" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(2rem);
}
</style>
