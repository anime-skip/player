<script lang="ts" setup>
import { PreferencesAlertView } from '../utils/preferences';
import IconMdiAlertCircle from '~icons/mdi/alert-circle';

const props = defineProps<{
  view: PreferencesAlertView;
}>();
</script>

<template>
  <div class="alert alert-info shadow-lg">
    <div>
      <icon-mdi-alert-circle class="opacity-50 flex-shrink-0 w-6 h-6" />
      <div>
        <p>{{ view.title }}</p>
        <p class="text-sm text-info-content">
          {{ view.message }}
        </p>
      </div>
    </div>
  </div>
</template>
