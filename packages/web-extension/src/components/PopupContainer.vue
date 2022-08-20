<template>
  <Popup />
</template>

<script lang="ts" setup>
import { provideAuth } from '@anime-skip/player-ui/src/stores/useAuth';
import { provideGeneralPreferences } from '@anime-skip/player-ui/src/stores/useGeneralPreferences';

provideAuth();
provideGeneralPreferences();
</script>
