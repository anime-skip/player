<template>
  <Popup />
</template>

<script lang="ts" setup>
import { provideApiClient } from '@anime-skip/player-ui/src/composables/useApiClient';
import { provideAuth } from '@anime-skip/player-ui/src/stores/useAuth';
import { provideGeneralPreferences } from '@anime-skip/player-ui/src/stores/useGeneralPreferences';

provideAuth();
provideGeneralPreferences();
provideApiClient();
</script>
