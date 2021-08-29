<template>
  <div :class="browser" class="flex items-center justify-center">
    <LogIn
      v-if="!isLoggedIn"
      :small="small"
      :close-after-login="shouldCloseAfterLogin"
      :close="close"
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

defineProps<{
  small?: boolean;
}>();

const browser = Browser.detect();

// TODO-REQ: verify no INTIAL_LOAD call works

const isLoggedIn = useIsLoggedIn();

const shouldCloseAfterLogin = computed(() => {
  const urlParams = new URLSearchParams(window?.location.search);
  const closePopupAfterLogin = urlParams.get('closeAfterLogin');
  return closePopupAfterLogin === 'true';
});

function close() {
  window.close();
}
</script>

<style scoped>
.chrome {
  min-width: 600px;
  width: 100%;
  height: 500px;
  margin: auto 0;
}
</style>
