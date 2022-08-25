<template>
  <div class="as-flex as-flex-col" :class="'as-' + browser">
    <div
      v-if="notSupportedMessage"
      class="as-self-stretch as-justify-self-start as-bg-error as-p-4 as-flex as-space-x-4 as-items-center"
    >
      <svg version="1.1" width="24" height="24" viewBox="0 0 24 24">
        <path class="as-fill-on-error" d="M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z" />
      </svg>
      <p class="as-text-on-error">{{ notSupportedMessage }}</p>
      <div class="as-flex-1" />
      <a
        class="as-text-on-error as-underline as-body-2"
        href="https://www.anime-skip.com/#supported-services"
        target="_blank"
        >Learn More</a
      >
    </div>
    <div class="as-flex-1 as-flex as-items-center as-justify-center">
      <LogIn
        v-if="!isLoggedIn"
        :small="small"
        :close-after-login="shouldCloseAfterLogin"
        :close="closePopup"
      />
      <div v-else-if="shouldCloseAfterLogin" class="as-mt-20">
        <Loading />
      </div>
      <PopupPreferences v-else :small="small" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Browser from 'webextension-polyfill';
import { usePlayerStorage } from '@anime-skip/player-ui/src/composables/usePlayerStorage';
import { isUrlSupported } from '../utils/url-supported';
import { useIsLoggedIn } from '@anime-skip/player-ui/src/stores/useAuth';
import { log } from '~/utils/log';
import UsageStats from '~/utils/UsageStats';
import { detectBrowser } from '~utils/browser';

defineProps<{
  small?: boolean;
}>();

onMounted(() => {
  void UsageStats.saveEvent('opened_popup');
});

const browser = detectBrowser();

const isLoggedIn = useIsLoggedIn();

const shouldCloseAfterLogin = computed(() => {
  const urlParams = new URLSearchParams(window?.location.search);
  const closePopupAfterLogin = urlParams.get('closeAfterLogin');
  log('Closing after login:', closePopupAfterLogin);
  return closePopupAfterLogin === 'true';
});

const autoclose = () => {
  if (isLoggedIn.value && shouldCloseAfterLogin.value) {
    setTimeout(closePopup, 500);
  }
};
watch(isLoggedIn, autoclose);
onMounted(autoclose);

function closePopup() {
  window.close();
}

const currentUrl = usePlayerStorage<string | null>('supported-website-check-url', null);
const isSupported = computed<boolean>(() => !!currentUrl.value && isUrlSupported(currentUrl.value));
const notSupportedMessage = computed(() => {
  if (isSupported.value || currentUrl.value?.startsWith(Browser.runtime.getURL('/')))
    return undefined;
  if (
    !currentUrl.value ||
    currentUrl.value.startsWith('chrome://') ||
    currentUrl.value.includes('extension://')
  )
    return 'Anime Skip does not support this website';
  return `Anime Skip does not support ${new URL(currentUrl.value!).hostname}`;
});
</script>

<style scoped>
.as-chrome {
  min-width: 700px;
  width: 100%;
  min-height: 600px;
}
</style>
