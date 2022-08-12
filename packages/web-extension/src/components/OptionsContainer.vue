<template>
  <OptionsWebExtListeners />
</template>

<script lang="ts" setup>
import { providePlayerStorage } from '~/composables/usePlayerConfig';
import { provideAuth } from '~/stores/useAuth';
import { provideGeneralPreferences } from '~/stores/useGeneralPreferences';
import { playerWebExtStorage } from '~/utils/player-web-ext-storage';
import OptionsWebExtListeners from './OptionsWebExtListeners.vue';

provideAuth();
provideGeneralPreferences();
providePlayerStorage(playerWebExtStorage);
</script>
