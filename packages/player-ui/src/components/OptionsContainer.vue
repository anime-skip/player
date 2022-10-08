<template>
  <Options />
</template>

<script lang="ts" setup>
import { provideApiClient } from '../composables/useApiClient';
import { provideAuth } from '../stores/useAuth';
import { provideGeneralPreferences } from '../stores/useGeneralPreferences';

provideAuth();
provideGeneralPreferences();
provideApiClient();
</script>
