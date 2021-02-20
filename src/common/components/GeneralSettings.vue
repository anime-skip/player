<template>
  <div class="space-y-4">
    <h6>General Settings</h6>
    <p v-if="!isLoggedIn && !hideLoginButton" class="text-error body-2">
      Some settings are disabled until you've
      <a href="#" @click.prevent.stop="openLoginDialog" class="underline">logged in</a>
    </p>
    <div
      class="grid gap-3 items-start"
      :class="{
        'grid-cols-1': small,
        'grid-cols-2': !small,
      }"
    >
      <PlaybackRatePicker :showLess="!small" />
      <RaisedCheckbox
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
import PlaybackRatePicker from './PlaybackRatePicker.vue';

export default defineComponent({
  components: { PlaybackRatePicker },
  props: {
    small: Boolean,
    hideLoginButton: Boolean,
  },
  setup() {
    const store = useStore();
    const isLoggedIn = computed(() => store.state.account != null);
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

<style scoped lang="scss">
@import '@anime-skip/ui/theme.scss';

.remove-text {
  text-transform: none;
  letter-spacing: normal;
  font-weight: normal;
}

.text-error {
  color: $textColor-error;
}
</style>
