<template>
  <BasicDialog
    name="LoginDialog"
    class="as-bg-control-variant as-bg-opacity-medium as-z-50"
    gravity-x="center"
    gravity-y="center"
    :is-showing="isShowing"
    :hide-dialog="hideLoginOverlay"
  >
    <LogIn close-after-login :close="hideLoginOverlay" />
  </BasicDialog>
</template>

<script lang="ts" setup>
import { useIsLoggedIn } from '~/stores/useAuth';
import { useDialogState, useHideLoginOverlay } from '~/stores/useDialogState';

const dialogState = useDialogState();
const isShowing = () => dialogState.isShowingLoginOverlay;
const hideLoginOverlay = useHideLoginOverlay();

const isLoggedIn = useIsLoggedIn();

const autoclose = () => {
  if (isLoggedIn.value) {
    hideLoginOverlay();
  }
};
watch(isLoggedIn, autoclose);
onMounted(autoclose);
</script>

<style lang="scss">
@import '../utils/constants.scss';

#LoginDialog {
  padding-right: 16px;
  padding-bottom: $toolbarHeight + 4px + 8px;

  .as-dialog-root-container {
    max-width: 400px;
  }
}
</style>
