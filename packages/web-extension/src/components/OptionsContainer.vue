<template>
  <Options />
</template>

<script lang="ts" setup>
import { providePlayerStorage } from '~/composables/usePlayerConfig';
import { provideAuth } from '~/stores/useAuth';
import { provideGeneralPreferences } from '~/stores/useGeneralPreferences';
import { createPlayerWebExtStorage } from '~/utils/player-web-ext-storage';

provideAuth();
provideGeneralPreferences();
providePlayerStorage(createPlayerWebExtStorage());
</script>
