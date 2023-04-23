<script lang="ts" setup>
import { PreferencesGridView } from '../utils/preferences';
import PreferencesView from './PreferencesView';

const props = defineProps<{
  view: PreferencesGridView;
}>();
</script>

<template>
  <div
    class="grid gap-2 grid-flow-row"
    :class="{
      'grid-cols-1': view.columns === 1,
      'grid-cols-2': view.columns === 2,
      'grid-cols-3': view.columns === 3,
    }"
  >
    <PreferencesView :views="view.children" />
  </div>
</template>
