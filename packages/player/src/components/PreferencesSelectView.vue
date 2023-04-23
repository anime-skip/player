<script lang="ts" setup>
import usePreference from '../composables/usePreference';
import { PreferencesSelectView } from '../utils/preferences';

const props = defineProps<{
  view: PreferencesSelectView;
}>();

const { pref } = usePreference(props.view.preferenceKey, props.view.isLocal);

const value = computed({
  get() {
    return pref.value;
  },
  set(newRate) {
    // Sometimes it's an empty string?
    if (!newRate) return;

    pref.value = newRate;
  },
});
</script>

<template>
  <div class="form-control">
    <div class="input-group">
      <span>{{ view.label }}</span>
      <select
        class="select select-bordered focus:select-primary"
        v-model="value"
      >
        <option disabled>{{ view.selectLabel ?? 'Select one:' }}</option>
        <option
          v-for="option of view.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.display }}
        </option>
      </select>
    </div>
  </div>
</template>
