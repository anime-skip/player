<template>
  <p class="as-text-error body-1">
    You need to be
    <a href="#" @click.prevent.stop="onClickLogin" class="as-underline">logged in</a>
    before {{ before }}
  </p>
</template>

<script lang="ts" setup>
import { useDialogStore } from '../stores/useDialogStore';

defineProps<{ before?: string }>();

const dialogs = useDialogStore();

const onClickLogin = () => {
  const isInInjectedPlayer = !window.location.protocol.includes('extension');
  if (isInInjectedPlayer) {
    dialogs.showLoginOverlay();
  } else {
    window.open('popup.html?closeAfterLogin=true', '_blank');
  }
};
</script>
