<template>
  <BasicDialog
    name="LoginDialog"
    class="bg-control-variant bg-opacity-medium z-50"
    gravity-x="center"
    gravity-y="center"
    v-bind="{ isShowing, hideLoginOverlay }"
  >
    <LogIn close-after-login :close="hideLoginOverlay" />
  </BasicDialog>
</template>

<script lang="ts" setup>
import { useDialogState, useHideLoginOverlay } from '../state/useDialogState';

const dialogState = useDialogState();
const isShowing = () => dialogState.isShowingLoginOverlay; // TODO: This was a computed with another arrow function layered on top of this. Does the login overlay still show up and dismiss correctly?
const hideLoginOverlay = useHideLoginOverlay();
</script>

<style lang="scss">
@import '../utils/constants.scss';

#LoginDialog {
  padding-right: 16px;
  padding-bottom: $toolbarHeight + 4px + 8px;

  .dialog-root-container {
    max-width: 400px;
    padding: 16px;
  }
}
</style>
