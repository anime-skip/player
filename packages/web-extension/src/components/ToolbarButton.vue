<template>
  <FlatButton
    transparent
    class="as-h-10 as-px-0 as-outline-none as-border-none as-overflow-y-hidden"
    @click="onClick"
  >
    <slot v-if="icon == null" />
    <span v-if="title" class="as-pl-2 as-normal-case">{{ title }}</span>
  </FlatButton>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  emits: {
    click: () => true,
  },
  props: {
    icon: { type: String, default: undefined },
    title: { type: String, default: undefined },
  },
  methods: {
    onClick() {
      this.$emit('click');
      (document.activeElement as HTMLInputElement | HTMLElement | undefined)?.blur();
    },
  },
});
</script>

<style scoped>
.as-border-none::-moz-focus-inner,
.as-outline-none::-moz-focus-inner {
  border: 0;
}

.as-opacity-100 {
  opacity: 1 !important;
}
</style>
