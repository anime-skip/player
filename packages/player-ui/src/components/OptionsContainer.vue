<template>
  <Options />
</template>

<script lang="ts" setup>
import { provideAuth } from '../stores/useAuth';
import { provideGeneralPreferences } from '../stores/useGeneralPreferences';

provideAuth();
provideGeneralPreferences();
</script>
