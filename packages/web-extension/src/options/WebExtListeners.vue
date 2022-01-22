<template>
  <Options />
</template>

<script lang="ts" setup>
import { useInitAuthListener } from '~/common/state/useAuth';
import { useInitGeneralPreferencesListener } from '~/common/state/useGeneralPreferences';

useInitAuthListener();
useInitGeneralPreferencesListener();
</script>
