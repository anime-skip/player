<script lang="ts" setup>
import { PlayerVisibility } from '../../types';
import { PreferencesServiceSettingsView } from '../../utils/preferences';

const props = defineProps<{
  view: PreferencesServiceSettingsView;
}>();

const { serviceName } = usePlayerOptions();

const visibility = usePlayerVisibility();
</script>

<template>
  <button class="btn" @click="visibility = PlayerVisibility.ServiceSettings">
    {{ serviceName }} Settings
  </button>
</template>
