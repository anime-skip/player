<template>
  <h5 class="pb-2">
    <span class="text-opacity-high font-bold">{{ title }}</span>
    <span class="text-opacity-low">&ensp;&bull;&ensp;</span>
    <span class="text-primary">Anime Skip</span>
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
