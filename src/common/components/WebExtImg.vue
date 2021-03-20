<template>
  <img :src="webExtSrc" :draggable="draggable" ondragstart="return false;" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Browser from '@/common/utils/Browser';

export default defineComponent({
  props: {
    src: { type: String, default: undefined },
    draggable: Boolean,
  },
  computed: {
    webExtSrc(): string {
      return Browser.resolveUrl('assets/' + this.src);
    },
  },
});
</script>
