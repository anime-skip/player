<template>
  <div class="as-space-y-4">
    <h6>General Settings</h6>
    <login-warning
      v-if="!auth.isLoggedIn && !hideLoginButton"
      before="all settings are available"
    />
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
        @click="togglePref('enableAutoSkip')"
        :disabled="!auth.isLoggedIn"
      />
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useToggleBooleanPreferenceMutation } from '../state/composables/useToggleBooleanPreferenceMutation';
import { useAuthStore } from '../state/stores/useAuthStore';
import { usePreferencesStore } from '../state/stores/usePreferencesStore';

defineProps<{
  small?: boolean;
  hideLoginButton?: boolean;
}>();

const auth = useAuthStore();
const prefsStore = usePreferencesStore();
const { preferences } = storeToRefs(prefsStore);

const { mutate: togglePref } = useToggleBooleanPreferenceMutation();

const enableAutoSkip = computed(() => auth.isLoggedIn && preferences.value.enableAutoSkip);
</script>
