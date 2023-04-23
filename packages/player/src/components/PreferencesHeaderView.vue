<script lang="ts" setup>
import { PreferencesHeaderView } from '../utils/preferences';

const props = defineProps<{
  view: PreferencesHeaderView;
}>();
</script>

<template>
  <h2 class="text-lg font-bold">{{ view.text }}</h2>
</template>
