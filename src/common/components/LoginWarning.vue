<template>
  <p class="as-text-error body-1">
    You need to be
    <a href="#" @click.prevent.stop="onClickLogin" class="as-underline">logged in</a>
    before {{ before }}
  </p>
</template>

<script lang="ts" setup>
import Messenger from '~/common/utils/Messenger';
import { useShowLoginOverlay } from '~/content-scripts/player/state/useDialogState';

defineProps<{ before?: string }>();

const showLoginOverlay = useShowLoginOverlay();

const onClickLogin = () => {
  const isInInjectedPlayer = !window.location.protocol.includes('extension');
  if (isInInjectedPlayer) {
    showLoginOverlay();
  } else {
    new Messenger<RuntimeMessageTypes>('General Settings').send(
      '@anime-skip/open-login',
      undefined
    );
  }
};
</script>
