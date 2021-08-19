<template>
  <BasicDialog
    name="LoginDialog"
    class="bg-control-variant bg-opacity-medium z-50"
    gravity-x="center"
    gravity-y="center"
    v-bind="{ isShowing, hideDialog }"
  >
    <LogIn close-after-login :close="hideDialog" />
  </BasicDialog>
</template>

<script lang="ts">
import useLoginDialog from '~/common/composition/useLoginDialog';
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();
    const isShowing = computed(() => store.state.isShowingLoginDialog);
    const { closeLoginDialog } = useLoginDialog();
    return {
      isShowing: () => isShowing.value,
      hideDialog: closeLoginDialog,
    };
  },
});
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
