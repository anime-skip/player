<script lang="ts" setup>
import useKeepInBounds from '../composables/useKeepInBounds';

const floatingDiv = ref<HTMLDivElement>();
const style = useKeepInBounds(floatingDiv);
</script>

<template>
  <div class="relative">
    <slot name="default" />

    <div
      v-if="$slots.label"
      class="absolute w-0 bottom-full left-[50%] flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <div
        ref="floatingDiv"
        class="bg-neutral py-2 px-3 mb-2 rounded transition-transform"
        :style="style"
      >
        <slot name="label" />
      </div>
    </div>
  </div>
</template>
