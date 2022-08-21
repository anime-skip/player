<template>
  <h5 class="as-pb-2">
    <span class="as-text-primary as-font-bold">Anime Skip</span>
    <span class="as-text-opacity-medium"> &bull; </span>
    <span class="as-text-opacity-medium">{{ title }}</span>
  </h5>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: { type: String, required: true },
  },
});
</script>
