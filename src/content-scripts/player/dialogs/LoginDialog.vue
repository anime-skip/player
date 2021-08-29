<template>
  <BasicDialog
    name="LoginDialog"
    class="bg-control-variant bg-opacity-medium z-50"
    gravity-x="center"
    gravity-y="center"
    :is-showing="isShowing"
    :hide-dialog="hideLoginOverlay"
  >
    <LogIn close-after-login :close="hideLoginOverlay" />
  </BasicDialog>
</template>

<script lang="ts" setup>
import { useDialogState, useHideLoginOverlay } from '../state/useDialogState';

const dialogState = useDialogState();
const isShowing = () => dialogState.isShowingLoginOverlay;
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
