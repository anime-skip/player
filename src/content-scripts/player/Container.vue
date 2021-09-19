<template>
  <WebExtListeners />
</template>

<script lang="ts" setup>
import { provideAuth } from '~/common/state/useAuth';
import { provideGeneralPreferences } from '~/common/state/useGeneralPreferences';
import { provideTimestampsPanelState } from './dialogs/TimestampsPanel/useTimestampPanelState';
import { provideDialogState } from './state/useDialogState';
import { provideEditingState } from './state/useEditingState';
import { provideEpisodeState } from './state/useEpisodeState';
import { provideHoveredTimestamp } from './state/useHoveredTimestamp';
import { provideInferEpisodeState } from './state/useInferredEpisodeState';
import { providePlayHistory } from './state/usePlayHistory';
import { provideTemplateState } from './state/useTemplateState';
import { provideVideoState } from './state/useVideoState';
import WebExtListeners from './WebExtListeners.vue';

provideAuth();
provideGeneralPreferences();
provideTimestampsPanelState();
provideDialogState();
provideEditingState();
provideEpisodeState();
provideHoveredTimestamp();
provideInferEpisodeState();
providePlayHistory();
provideTemplateState();
provideVideoState();
</script>
