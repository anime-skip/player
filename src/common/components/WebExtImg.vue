<template>
  <img :src="webExtSrc" :draggable="draggable" ondragstart="return false;" />
</template>

<script lang="ts">
import Vue from 'vue';
import Browser from '@/common/utils/Browser';

export default Vue.extend({
  props: {
    src: String,
    draggable: Boolean,
  },
  computed: {
    webExtSrc(): string {
      return Browser.resolveUrl('assets/' + this.src);
    },
  },
});
</script>
