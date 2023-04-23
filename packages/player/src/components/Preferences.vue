<script lang="ts" setup>
import { allPreferencesView, smallPreferencesView } from '../utils/preferences';
import PreferencesView from './PreferencesView';

defineProps<{
  size: 'small' | 'all';
}>();
</script>

<template>
  <div class="flex flex-col gap-4">
    <preferences-view
      :views="size === 'small' ? smallPreferencesView : allPreferencesView"
    />
  </div>
</template>
