<script lang="ts" setup>
import ToolbarButton from './ToolbarButton.vue';
import IconPlay from '~icons/anime-skip/play';
import IconPause from '~icons/anime-skip/pause';

const { playing } = useVideoControls();
</script>

<template>
  <toolbar-button
    @click="playing = !playing"
    :title="playing ? 'Pause' : 'Play'"
  >
    <icon-pause v-if="playing" />
    <icon-play v-else />
  </toolbar-button>
</template>
