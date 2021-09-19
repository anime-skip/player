<template>
  <FlatButton
    transparent
    class="h-10 px-0 outline-none border-none overflow-y-hidden"
    @click="onClick"
  >
    <slot v-if="icon == null" />
    <template v-else>
      <WebExtImg
        v-if="icon.endsWith('svg')"
        class="inline fill-on-surface opacity-100"
        :src="icon"
      />
      <Icon v-else class="inline fill-on-surface opacity-100" :path="icon" :draggable="false" />
    </template>
    <span v-if="title" class="pl-2 normal-case">{{ title }}</span>
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

<style lang="css" scoped>
.border-none::-moz-focus-inner,
.outline-none::-moz-focus-inner {
  border: 0;
}

.px-3 {
  padding-left: 0.75rem !important;
  padding-right: 0.75rem !important;
}

.opacity-100 {
  opacity: 1 !important;
}
</style>
