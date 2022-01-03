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
import { useWebExtensionStorageValue } from '~/common/hooks/useWebExtensionStorage';
import { isUrlSupported } from '~/common/state/url-supported';
import { useIsLoggedIn } from '~/common/state/useAuth';
import { detectBrowser } from '~/common/utils/browser';
import { log } from '~/common/utils/log';
import UsageStats from '~/common/utils/UsageStats';

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

const { value: currentUrl } = useWebExtensionStorageValue<string | null>(
  'supported-website-check-url',
  null,
  'local'
);
const isSupported = computed<boolean>(() => !!currentUrl.value && isUrlSupported(currentUrl.value));
const notSupportedMessage = computed(() => {
  if (isSupported.value) return undefined;
  if (!currentUrl.value) return 'Anime Skip does not support this website';
  if (currentUrl.value.includes('extension://'))
    return 'Anime Skip does not support other extensions';
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
