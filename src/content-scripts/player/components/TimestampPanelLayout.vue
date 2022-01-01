<template>
  <div class="as-flex as-flex-col as-h-full as-overflow-y-hidden">
    <header
      class="as-p-2 as-border-b as-border-on-surface as-border-opacity-divider as-flex-shrink-0"
    >
      <h6 class="as-flex as-flex-row as-items-center as-justify-between">
        <div
          v-if="mode == 'back'"
          class="as-p-2 as-rounded-full as-bg-on-surface as-bg-opacity-0 hover:as-bg-opacity-hover as-cursor-pointer"
          title="Discard changes"
          @click="$emit('back')"
        >
          <WebExtImg
            class="as-w-6 as-h-6 as-select-none"
            src="ic_chevron_left.svg"
            :draggable="false"
          />
        </div>
        <span class="as-flex-1 as-pt-0.5 as-px-2">{{ title }}</span>
        <div
          v-if="mode == 'close'"
          class="as-p-2 as-rounded-full as-bg-on-surface as-bg-opacity-0 hover:as-bg-opacity-hover as-cursor-pointer"
          title="Discard changes"
          @click="$emit('close')"
        >
          <WebExtImg class="as-w-6 as-h-6 as-select-none" src="ic_close.svg" :draggable="false" />
        </div>
      </h6>
    </header>
    <div class="as-flex-1 as-min-h-0 as-pt-2 as-scroll">
      <slot name="content" />
    </div>
    <footer
      v-if="$slots['footer'] != null"
      class="as-flex as-flex-row-reverse as-justify-center as-flex-shrink-0 as-space-x-4 as-space-x-reverse as-px-4 as-pb-4"
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

<style lang="scss" scoped>
.as-scroll {
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
    padding: 1px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #{theme('colors.control-disabled')};
    border-radius: 5px;
  }
}
</style>
