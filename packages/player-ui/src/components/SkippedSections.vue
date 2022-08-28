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
        :disabled="!auth.isLoggedIn"
        :label="preference.title"
        @click="togglePref.mutate(preference.key)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useToggleBooleanPreferenceMutation } from '../state/composables/useToggleBooleanPreferenceMutation';
import { useAuthStore } from '../state/stores/useAuthStore';
import { usePreferencesStore } from '../state/stores/usePreferencesStore';
import { SKIPPABLE_PREFERENCES } from '../utils/constants';

defineProps({
  twoColumns: Boolean,
});

const auth = useAuthStore();
const { preferences } = storeToRefs(usePreferencesStore());

const togglePref = useToggleBooleanPreferenceMutation();
const autoSkipDisabled = computed<boolean>(
  () => !auth.isLoggedIn || !preferences.value.enableAutoSkip
);
</script>

<style scoped>
.as-checkbox {
  min-width: 11rem;
}
</style>
