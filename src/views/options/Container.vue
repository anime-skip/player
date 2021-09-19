<template>
  <WebExtListeners />
</template>

<script lang="ts" setup>
import { provideAuth } from '~/common/state/useAuth';
import { provideGeneralPreferences } from '~/common/state/useGeneralPreferences';
import WebExtListeners from './WebExtListeners.vue';

provideAuth();
provideGeneralPreferences();
</script>
