<template>
  <WebExtListeners />
</template>

<script lang="ts" setup>
import { provideAuth } from '~/stores/useAuth';
import { provideGeneralPreferences } from '~/stores/useGeneralPreferences';
import WebExtListeners from './WebExtListeners.vue';

provideAuth();
provideGeneralPreferences();
</script>
