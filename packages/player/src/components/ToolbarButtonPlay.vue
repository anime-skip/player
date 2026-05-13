<script lang="ts" setup>
import IconPause from '~icons/anime-skip/pause';
import IconPlay from '~icons/anime-skip/play';

import ToolbarButton from './ToolbarButton.vue';

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
