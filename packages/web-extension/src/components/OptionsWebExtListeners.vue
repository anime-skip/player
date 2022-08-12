<template>
  <Options />
</template>

<script lang="ts" setup>
import { useInitAuthListener } from '~/stores/useAuth';
import { useInitGeneralPreferencesListener } from '~/stores/useGeneralPreferences';

useInitAuthListener();
useInitGeneralPreferencesListener();
</script>
