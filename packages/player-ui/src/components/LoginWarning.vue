<template>
  <p class="as-text-error body-1">
    You need to be
    <a href="#" @click.prevent.stop="onClickLogin" class="as-underline">logged in</a>
    before {{ before }}
  </p>
</template>

<script lang="ts" setup>
import { useShowLoginOverlay } from '../stores/useDialogState';

defineProps<{ before?: string }>();

const showLoginOverlay = useShowLoginOverlay();

const onClickLogin = () => {
  const isInInjectedPlayer = !window.location.protocol.includes('extension');
  if (isInInjectedPlayer) {
    showLoginOverlay();
  } else {
    window.open('popup.html?closeAfterLogin=true', '_blank');
  }
};
</script>
