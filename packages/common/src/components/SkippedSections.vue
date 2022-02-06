<template>
  <div class="as-space-y-4">
    <h6>What do you want to watch?</h6>
    <p v-if="autoSkipDisabled" class="as-text-error as-body-2">Auto-skipping has been turned off</p>
    <div
      class="as-grid as-gap-3"
      :class="{
        'as-grid-cols-2': twoColumns,
        'as-grid-cols-3': !twoColumns,
      }"
    >
      <RaisedCheckbox
        class="as-checkbox"
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
import { SKIPPABLE_PREFERENCES } from '~/common/utils/constants';
import { useIsLoggedIn } from '../state/useAuth';
import { useGeneralPreferences, useToggleBooleanPref } from '../state/useGeneralPreferences';

defineProps({
  twoColumns: Boolean,
});

const isLoggedIn = useIsLoggedIn();

const preferences = useGeneralPreferences();
const toggleBooleanPref = useToggleBooleanPref();
const autoSkipDisabled = computed<boolean>(
  () => !isLoggedIn.value || !preferences.value.enableAutoSkip
);
</script>

<style scoped>
.as-checkbox {
  min-width: 11rem;
}
</style>
