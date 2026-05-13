<script lang="ts" setup>
import IconArrowLeft from '~icons/anime-skip/arrow-left';
import IconClose from '~icons/anime-skip/close';

const props = defineProps<{
  mode?: 'close' | 'back';
}>();

const emits = defineEmits<{
  (event: 'formSubmit'): void;
}>();

const { view, goBack } = useView();
</script>

<template>
  <form
    class="flex h-full flex-col bg-base-100"
    @submit.prevent.stop="emits('formSubmit')"
  >
    <header
      class="flex shrink-0 items-center gap-2 border-b border-base-content border-opacity-20 py-2 pl-4 pr-2"
    >
      <button
        v-if="mode === 'back'"
        class="btn btn-circle btn-ghost -ml-2"
        type="button"
        @click="goBack"
        title="Close"
      >
        <icon-arrow-left />
      </button>
      <h2 class="flex-1 text-xl">
        <slot name="title" />
      </h2>
      <button
        v-if="mode !== 'back'"
        class="btn btn-circle btn-ghost"
        type="button"
        @click="view = undefined"
        title="Close"
      >
        <icon-close />
      </button>
    </header>

    <div
      class="flex-1 divide-y divide-base-content divide-opacity-20 overflow-y-auto"
    >
      <slot name="content" />
    </div>

    <div v-if="$slots['bottom-content']">
      <slot name="bottom-content" />
    </div>

    <footer
      v-if="$slots.buttons"
      class="flex shrink-0 flex-row-reverse gap-2 border-t border-base-content border-opacity-20 p-2"
    >
      <slot name="buttons" />
    </footer>
  </form>
</template>
