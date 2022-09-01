<template>
  <BasicDialog
    name="LoginDialog"
    class="as-bg-control-variant as-bg-opacity-medium as-z-50"
    gravity-x="center"
    gravity-y="center"
    :visible="dialogs.isLoginOverlayVisible"
    @dismiss="dialogs.hideLoginOverlay()"
  >
    <LogIn @logged-in="dialogs.hideLoginOverlay()" />
  </BasicDialog>
</template>

<script lang="ts" setup>
import { useAuthStore } from '../stores/useAuthStore';
import { useDialogStore } from '../stores/useDialogStore';

const dialogs = useDialogStore();
const auth = useAuthStore();

// Close the dialog when the user logs in
watch(
  () => auth.isLoggedIn,
  () => {
    if (auth.isLoggedIn) {
      dialogs.hideLoginOverlay();
      dialogs.isLoginOverlayVisible = false;
    }
  },
  { immediate: true }
);
</script>

<style lang="scss">
@import '../assets/constants.scss';

#LoginDialog {
  padding-right: 16px;
  padding-bottom: $toolbarHeight + 4px + 8px;

  .as-dialog-root-container {
    max-width: 400px;
  }
}
</style>
