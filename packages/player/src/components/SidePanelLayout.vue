<script lang="ts" setup>
import IconClose from '~icons/anime-skip/close';
import IconArrowLeft from '~icons/anime-skip/arrow-left';

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
    class="bg-base-100 flex flex-col h-full"
    @submit.prevent.stop="emits('formSubmit')"
  >
    <header
      class="flex items-center pl-4 pr-2 py-2 gap-2 shrink-0 border-b border-base-content border-opacity-20"
    >
      <button
        v-if="mode === 'back'"
        class="btn btn-ghost btn-circle -ml-2"
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
        class="btn btn-ghost btn-circle"
        type="button"
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

    <div v-if="$slots['bottom-content']">
      <slot name="bottom-content" />
    </div>

    <footer
      v-if="$slots.buttons"
      class="flex flex-row-reverse shrink-0 p-2 gap-2 border-t border-base-content border-opacity-20"
    >
      <slot name="buttons" />
    </footer>
  </form>
</template>
