<template>
  <div class="flex flex-col h-full">
    <header
      class="pl-2 pr-2 pb-2 -mt-1.5 -mx-4 border-b border-on-surface border-opacity-divider flex-shrink-0"
    >
      <h6 class="section-header flex flex-row items-center justify-between">
        <div
          v-if="mode == 'back'"
          class="p-2 rounded-full select-none bg-on-surface bg-opacity-0 hover:bg-opacity-hover"
          title="Discard changes"
          @click="$emit('back')"
        >
          <WebExtImg class="w-6 h-6" src="ic_chevron_left.svg" :draggable="false" />
        </div>
        <span class="flex-1 pl-2 pt-0.5">{{ title }}</span>
        <ToolbarButton v-if="mode == 'close'" icon="ic_close.svg" @click="$emit('close')" />
      </h6>
    </header>
    <div class="scroll -mx-4 select-none pt-2 flex-1">
      <slot name="content" />
    </div>
    <footer
      v-if="$slots['footer'] != null"
      class="flex flex-row-reverse justify-center flex-shrink-0 space-x-4 space-x-reverse"
    >
      <slot name="footer" />
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    title: { type: String, required: true },
    mode: { type: String as PropType<'close' | 'back'>, required: true },
  },
  emits: ['back', 'close'],
});
</script>

<style scoped lang="scss">
@import '@anime-skip/ui/variables-theme.scss';

.scroll {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba($color: $backgroundColor-primary, $alpha: $opacity-low) transparent;
  &::-webkit-scrollbar {
    width: 8px;
    padding: 1px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: $backgroundColor-control-disabled;
    border-radius: 5px;
  }
}

.no-firefox-dots::-moz-focus-inner {
  border: 0;
}
</style>
