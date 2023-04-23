<script lang="ts" setup>
import { PreferencesPlaybackRateView } from '../utils/preferences';

const props = defineProps<{
  view: PreferencesPlaybackRateView;
}>();

const currentView = useView();
</script>

<template>
  <button class="btn" @click="currentView = 'all-preferences'">
    All Settings
  </button>
</template>
