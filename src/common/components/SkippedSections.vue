<template>
  <div class="space-y-4">
    <h6 class="section-header">What do you want to watch?</h6>
    <p v-if="autoSkipDisabled" class="text-error body-2">Auto-skipping has been turned off</p>
    <div
      class="grid gap-3"
      :class="{
        'grid-cols-2': twoColumns,
        'grid-cols-3': !twoColumns,
      }"
    >
      <RaisedCheckbox
        class="checkbox"
        v-for="preference in SKIPPABLE_PREFERENCES"
        :key="preference.key"
        :checked="!preferences[preference.key]"
        :disabled="autoSkipDisabled"
        :label="preference.title"
        @click="toggleBooleanPref(preference.key)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { SKIPPABLE_PREFERENCES } from '~/common/utils/Constants';
import { useGeneralPreferences, useToggleBooleanPref } from '../state/useGeneralPreferences';

defineProps({
  twoColumns: Boolean,
});

const preferences = useGeneralPreferences();
const toggleBooleanPref = useToggleBooleanPref();
const autoSkipDisabled = computed<boolean>(() => !preferences.value.enableAutoSkip);
</script>

<style scoped>
.checkbox {
  min-width: 11rem;
}
</style>
