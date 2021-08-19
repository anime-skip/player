<template>
  <div class="space-y-4">
    <h6 class="section-header">What do you want to watch?</h6>
    <p v-if="autoPlayDisabled" class="text-error body-2">Auto-skipping has been turned off</p>
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
        :checked="!getBooleanPreference(preference.key)"
        :disabled="autoPlayDisabled"
        :label="preference.title"
        @click="togglePreference(preference.key)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { SKIPPABLE_PREFERENCES } from '~/common/utils/Constants';
import usePreferenceEditor from '../composition/preferenceEditor';

export default defineComponent({
  props: {
    twoColumns: Boolean,
  },
  setup() {
    const { togglePreference, getBooleanPreference } = usePreferenceEditor();
    const autoPlayDisabled = computed<boolean>(() => !getBooleanPreference('enableAutoSkip'));

    return {
      getBooleanPreference,
      togglePreference,
      autoPlayDisabled,
    };
  },
  data() {
    return {
      SKIPPABLE_PREFERENCES,
    };
  },
});
</script>

<style scoped>
.checkbox {
  min-width: 11rem;
}
</style>
