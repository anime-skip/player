<template>
  <LoadingOverlay :isLoading="isLoggingOut">
    <div class="p-4 space-y-8">
      <PopupHeader title="Preferences" class="header" />
      <GeneralSettings>
        <RaisedButton dark @click="openExtensionOptions">
          <div class="flex justify-between w-full">
            <p class="remove-text body-1">All Settings</p>
          </div>
        </RaisedButton>
      </GeneralSettings>
      <SkippedSections />
      <div class="flex flex-row justify-between items-baseline">
        <a
          class="text-on-surface text-opacity-medium"
          href="https://www.anime-skip.com/support"
          target="_blank"
        >
          <span>Need help?</span>
        </a>
        <RaisedButton dark @click="logOut">Log Out</RaisedButton>
      </div>
    </div>
  </LoadingOverlay>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import PopupHeader from './PopupHeader.vue';
import SkippedSections from '../../common/components/SkippedSections.vue';
import GeneralSettings from '../../common/components/GeneralSettings.vue';
import { MutationTypes } from '@/common/store/mutationTypes';
import Messenger from '@/common/utils/Messenger';

export default defineComponent({
  components: { PopupHeader, SkippedSections, GeneralSettings },
  setup() {
    const store = useStore();

    const isLoggingOut = ref(false);
    const logOut = () => {
      isLoggingOut.value = true;
      setTimeout(() => {
        store.commit(MutationTypes.LOG_OUT);
        isLoggingOut.value = false;
      }, 500);
    };
    const openExtensionOptions = () => {
      new Messenger<RuntimeMessageTypes>('General Settings').send(
        '@anime-skip/open-options',
        undefined
      );
    };

    return {
      isLoggingOut,
      logOut,
      openExtensionOptions,
    };
  },
});
</script>
