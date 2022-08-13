<template>
  <LoadingOverlay :is-loading="isLoggingOut">
    <div class="as-p-4 as-space-y-8">
      <PopupHeader title="Preferences" class="as-header" />
      <GeneralSettings>
        <RaisedButton dark @click="openExtensionOptions">
          <div class="as-flex as-justify-between as-w-full">
            <p class="as-remove-text as-body-1">All Settings</p>
          </div>
        </RaisedButton>
      </GeneralSettings>
      <SkippedSections />
      <div class="as-flex as-flex-row as-justify-between as-items-baseline">
        <a
          class="as-text-on-surface as-text-opacity-medium as-body-1"
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

<script lang="ts" setup>
import useRequestState from 'vue-use-request-state';
import { useLogout } from '~/composables/useLogout';
import { sendMessage } from 'webext-bridge';

const { wrapRequest, isLoading: isLoggingOut } = useRequestState();
const logOut = wrapRequest(useLogout());

const openExtensionOptions = () => {
  void sendMessage('@anime-skip/open-all-settings', undefined);
};
</script>
