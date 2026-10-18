<script lang="ts" setup>
defineProps<{
  title?: string;
}>();
</script>

<template>
  <div class="tooltip" :data-tip="title">
    <button
      class="flex h-[2.5rem] min-w-[3rem] items-center justify-center gap-2 rounded bg-base-content bg-opacity-0 px-3 text-xs font-bold uppercase hover:bg-opacity-20 active:bg-opacity-30"
    >
      <slot />
    </button>
  </div>
</template>
