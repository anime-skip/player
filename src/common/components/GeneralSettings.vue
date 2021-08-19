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
        @click="togglePreference('enableAutoSkip')"
        :disabled="!isLoggedIn"
      />
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import usePreferenceEditor from '../composition/preferenceEditor';
import useLoginDialog from '../composition/useLoginDialog';

export default defineComponent({
  props: {
    small: Boolean,
    hideLoginButton: Boolean,
  },
  setup() {
    const store = useStore();
    const isLoggedIn = computed(() => store.state.isLoggedIn);
    const { togglePreference, getBooleanPreference } = usePreferenceEditor();
    const enableAutoSkip = computed(() => getBooleanPreference('enableAutoSkip'));

    const { openLoginDialog } = useLoginDialog();

    return {
      togglePreference,
      enableAutoSkip,
      isLoggedIn,
      openLoginDialog,
    };
  },
});
</script>

<style scoped>
.remove-text {
  text-transform: none;
  letter-spacing: normal;
  font-weight: normal;
}
</style>
