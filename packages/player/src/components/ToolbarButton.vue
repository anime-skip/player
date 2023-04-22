<script lang="ts" setup>
defineProps<{
  title?: string;
}>();
</script>

<template>
  <div class="tooltip" :data-tip="title">
    <button
      class="min-w-[3rem] h-[2.5rem] flex items-center justify-center gap-2 px-3 bg-base-content bg-opacity-0 rounded hover:bg-opacity-20 active:bg-opacity-30 uppercase text-xs font-bold"
    >
      <slot />
    </button>
  </div>
</template>
