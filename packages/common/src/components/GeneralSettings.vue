<template>
  <div class="as-space-y-4">
    <h6>General Settings</h6>
    <log-in-warning v-if="!isLoggedIn && !hideLoginButton" before="all settings are available" />
    <div
      class="as-grid as-gap-3 as-items-start"
      :class="{
        'as-grid-cols-1': small,
        'as-grid-cols-2': !small,
      }"
    >
      <playback-rate-picker :show-less="!small" />
      <raised-checkbox
        label="Auto-skip sections"
        :checked="enableAutoSkip"
        @click="toggleBooleanPref('enableAutoSkip')"
        :disabled="!isLoggedIn"
      />
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useIsLoggedIn } from '../state/useAuth';
import { useGeneralPreferences, useToggleBooleanPref } from '../state/useGeneralPreferences';
import { RaisedCheckbox } from '@anime-skip/ui';
import LogInWarning from './LogInWarning.vue';
import PlaybackRatePicker from './PlaybackRatePicker.vue';

defineProps<{
  small?: boolean;
  hideLoginButton?: boolean;
}>();

const isLoggedIn = useIsLoggedIn();

const toggleBooleanPref = useToggleBooleanPref();

const preferences = useGeneralPreferences();
const enableAutoSkip = computed(() => isLoggedIn.value && preferences.value.enableAutoSkip);
</script>
