<script lang="ts" setup>
import ToolbarButton from './ToolbarButton.vue';
import Settings from './Settings.vue';
import IconGear from '~icons/anime-skip/gear';

const view = useView();
const menuVisible = computed({
  get() {
    return view.value === 'settings';
  },
  set(newValue) {
    view.value = newValue ? 'settings' : undefined;
  },
});
</script>

<template>
  <div class="relative">
    <!-- Button -->
    <toolbar-button title="Settings" @click="menuVisible = !menuVisible">
      <icon-gear />
    </toolbar-button>

    <!-- Dialog -->
    <transition>
      <div
        v-if="menuVisible"
        class="bg-base-100 w-96 h-72 px-3 py-2 rounded shadow-xl fixed right-6 bottom-full mb-6"
      >
        <settings size="small" />
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
