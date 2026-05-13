<script lang="ts" setup>
import IconMdiAlertCircle from '~icons/mdi/alert-circle';

import { PreferencesAlertView } from '../utils/preferences';

const props = defineProps<{
  view: PreferencesAlertView;
}>();
</script>

<template>
  <div class="alert alert-info shadow-lg">
    <div>
      <icon-mdi-alert-circle class="h-6 w-6 flex-shrink-0 opacity-50" />
      <div>
        <p>{{ view.title }}</p>
        <p class="text-sm text-info-content">
          {{ view.message }}
        </p>
      </div>
    </div>
  </div>
</template>
