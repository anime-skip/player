<template>
  <OptionsWebExtListeners />
</template>

<script lang="ts" setup>
import { provideAuth } from '~/stores/useAuth';
import { provideGeneralPreferences } from '~/stores/useGeneralPreferences';
import OptionsWebExtListeners from './OptionsWebExtListeners.vue';

provideAuth();
provideGeneralPreferences();
</script>
