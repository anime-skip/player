<template>
  <Player />
</template>

<script lang="ts" setup>
import { provideDialogState } from './state/useDialogState';
import { provideEditingState } from './state/useEditingState';
import { provideEpisodeState } from './state/useEpisodeState';
import { provideHoveredTimestamp } from './state/useHoveredTimestamp';
import { provideInferEpisodeState } from './state/useInferredEpisodeState';
import { providePlayHistory } from './state/usePlayHistory';
import { provideTemplateState } from './state/useTemplateState';
import { provideVideoState } from './state/useVideoState';

provideDialogState();
provideEditingState();
provideEpisodeState();
provideHoveredTimestamp();
provideInferEpisodeState();
providePlayHistory();
provideTemplateState();
provideVideoState();
</script>

<style scoped></style>
