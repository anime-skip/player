<template>
  <LoadingOverlay :is-loading="isLoggingOut">
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
          class="text-on-surface text-opacity-medium body-1"
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
import { useClearTokens } from '~/common/state/useAuth';
import { useResetPreferences } from '~/common/state/useGeneralPreferences';
import { sleep } from '~/common/utils/EventLoop';
import Messenger from '~/common/utils/Messenger';

const clearTokens = useClearTokens();
const resetPreferences = useResetPreferences();

const { wrapRequest, isLoading: isLoggingOut } = useRequestState();
const logOut = wrapRequest(async () => {
  await sleep(500);
  clearTokens();
  resetPreferences();
});

const openExtensionOptions = () => {
  new Messenger<RuntimeMessageTypes>('General Settings').send(
    '@anime-skip/open-all-settings',
    undefined
  );
};
</script>
