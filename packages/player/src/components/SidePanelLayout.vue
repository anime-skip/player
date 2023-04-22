<script lang="ts" setup>
import IconClose from '~icons/anime-skip/close';

const view = useView();
</script>

<template>
  <div class="bg-base-100 flex flex-col h-full">
    <header
      class="flex items-center pl-4 pr-2 py-2 gap-4 shrink-0 border-b border-base-content border-opacity-20"
    >
      <h2 class="flex-1 truncate text-xl">
        <slot name="title" />
      </h2>
      <button
        class="btn btn-ghost btn-circle"
        @click="view = undefined"
        title="Close"
      >
        <icon-close />
      </button>
    </header>

    <div
      class="flex-1 overflow-y-auto divide-y divide-base-content divide-opacity-20"
    >
      <slot name="content" />
    </div>

    <footer
      v-if="$slots.buttons"
      class="flex flex-row-reverse shrink-0 p-2 gap-2 border-t border-base-content border-opacity-20"
    >
      <slot name="buttons" />
    </footer>
  </div>
</template>
