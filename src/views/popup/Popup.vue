<template>
  <div :class="browser" class="flex items-center justify-center">
    <LogIn
      v-if="!isLoggedIn"
      :small="small"
      :close-after-login="shouldCloseAfterLogin"
      :close="closePopup"
    />
    <div v-else-if="shouldCloseAfterLogin" class="mt-20">
      <Loading />
    </div>
    <PopupPreferences v-else :small="small" />
  </div>
</template>

<script lang="ts" setup>
import { useIsLoggedIn } from '~/common/state/useAuth';
import Browser from '~/common/utils/Browser';
import UsageStats from '~/common/utils/UsageStats';

defineProps<{
  small?: boolean;
}>();

onMounted(() => {
  void UsageStats.saveEvent('opened_popup');
});

const browser = Browser.detect();

const isLoggedIn = useIsLoggedIn();

const shouldCloseAfterLogin = computed(() => {
  const urlParams = new URLSearchParams(window?.location.search);
  const closePopupAfterLogin = urlParams.get('closeAfterLogin');
  console.log('Closing after login:', closePopupAfterLogin);
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
</script>

<style scoped>
.chrome {
  min-width: 700px;
  width: 100%;
  margin: auto 0;
  min-height: 600px;
}
</style>
