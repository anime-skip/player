<template>
  <p class="text-error">
    You need to be
    <a href="#" @click.prevent.stop="openLoginDialog" class="underline">logged in</a>
    before {{ before }}
  </p>
</template>

<script>
import useLoginDialog from '@/common/composition/useLoginDialog';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    before: String,
  },
  setup(props) {
    const { openLoginDialog } = useLoginDialog();
    return {
      openLoginDialog,
      before: props.before,
    };
  },
});
</script>

<style lang="scss" scoped></style>
