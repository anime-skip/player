<template>
  <div class="space-y-4">
    <h6>General Settings</h6>
    <login-warning v-if="!isLoggedIn && !hideLoginButton" before="all settings are available" />
    <div
      class="grid gap-3 items-start"
      :class="{
        'grid-cols-1': small,
        'grid-cols-2': !small,
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

defineProps<{
  small?: boolean;
  hideLoginButton?: boolean;
}>();

const isLoggedIn = useIsLoggedIn();

const toggleBooleanPref = useToggleBooleanPref();

const preferences = useGeneralPreferences();
const enableAutoSkip = computed(() => preferences.value.enableAutoSkip);
</script>

<style scoped>
.remove-text {
  text-transform: none;
  letter-spacing: normal;
  font-weight: normal;
}
</style>
