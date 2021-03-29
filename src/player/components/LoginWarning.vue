<template>
  <p class="text-error">
    You need to be
    <a href="#" @click.prevent.stop="onClickLogin" class="underline">logged in</a>
    before {{ before }}
  </p>
</template>

<script lang="ts">
import useLoginDialog from '@/common/composition/useLoginDialog';
import { defineComponent } from 'vue';
import Messenger from '@/common/utils/Messenger';

export default defineComponent({
  props: {
    before: { type: String, default: undefined },
  },
  setup() {
    const { openLoginDialog: openPlayerLoginDialog } = useLoginDialog();
    const onClickLogin = () => {
      const isInInjectedPlayer = window.location.protocol.includes('http');
      if (isInInjectedPlayer) {
        openPlayerLoginDialog();
      } else {
        new Messenger<RuntimeMessageTypes>('General Settings').send(
          '@anime-skip/open-login',
          undefined
        );
      }
    };
    return {
      onClickLogin,
    };
  },
});
</script>

<style lang="scss" scoped></style>
