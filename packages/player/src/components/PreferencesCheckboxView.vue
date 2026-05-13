<script lang="ts" setup>
import { PreferencesCheckboxView } from '../utils/preferences';

const props = defineProps<{
  view: PreferencesCheckboxView;
}>();

const { pref } = usePreference(props.view.preferenceKey, props.view.isLocal);
const checked = computed({
  get() {
    if (props.view.invert) return !pref.value;
    return pref.value;
  },
  set(newChecked) {
    if (props.view.invert) pref.value = !newChecked;
    else pref.value = newChecked;
  },
});
</script>

<template>
  <div class="form-control" :title="view.description">
    <label
      class="btn label h-[2.5rem] min-h-[2.5rem] cursor-pointer justify-start gap-3 px-2 text-left font-medium normal-case transition-all"
      :class="{ 'btn-primary': checked }"
    >
      <input
        type="checkbox"
        v-model="checked"
        class="checkbox-pref checkbox checkbox-sm"
      />
      <span
        class="label-text flex-1"
        :class="{
          'text-base-content text-opacity-70': !checked,
          'text-primary-content text-opacity-100': checked,
        }"
        >{{ view.text }}</span
      >
    </label>
  </div>
</template>
