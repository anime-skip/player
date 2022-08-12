<template>
  <PopupWebExtListeners />
</template>

<script lang="ts" setup>
import { provideAuth } from '~/stores/useAuth';
import { provideGeneralPreferences } from '~/stores/useGeneralPreferences';
import PopupWebExtListeners from './PopupWebExtListeners.vue';

provideAuth();
provideGeneralPreferences();
</script>
