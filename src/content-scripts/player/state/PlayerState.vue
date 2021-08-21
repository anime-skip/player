<template>
  <slot />
</template>

<script lang="ts" setup>
import { provideDialogState } from './useDialogState';
import { provideEditingState } from './useEditingState';
import { providePlayHistory } from './usePlayHistory';
import { provideVideoState } from './useVideoState';

provideDialogState();
provideEditingState();
providePlayHistory();
provideVideoState();
</script>

<style scoped></style>
