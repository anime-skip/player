<template>
  <h5 class="as-pb-2">
    <span class="as-text-opacity-high as-font-bold">{{ title }}</span>
    <span class="as-text-opacity-low">&ensp;&bull;&ensp;</span>
    <span class="as-text-primary">Anime Skip</span>
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
