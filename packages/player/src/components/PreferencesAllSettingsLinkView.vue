<script lang="ts" setup>
import { PreferencesAllSettingsLinkView } from '../utils/preferences';

const props = defineProps<{
  view: PreferencesAllSettingsLinkView;
}>();

const { view: currentView } = useView();
</script>

<template>
  <button class="btn" @click="currentView = 'all-preferences'">
    All Settings
  </button>
</template>
