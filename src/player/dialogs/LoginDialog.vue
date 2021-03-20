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
import LogIn from '@/popup/components/LogIn.vue';
import useLoginDialog from '@/common/composition/useLoginDialog';
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import BasicDialog from './BasicDialog.vue';

export default defineComponent({
  components: {
    BasicDialog,
    LogIn,
  },
  setup() {
    const store = useStore();
    const isShowing = computed(() => store.state.isShowingLoginDialog);
    const { closeLoginDialog } = useLoginDialog();
    console.info({ closeLoginDialog });
    return {
      isShowing: () => isShowing.value,
      hideDialog: closeLoginDialog,
    };
  },
});
</script>

<style lang="scss">
@import '../../common/css/constants.scss';

#LoginDialog {
  padding-right: 16px;
  padding-bottom: $toolbarHeight + 4px + 8px;

  .dialog-root-container {
    max-height: 300px;
    max-width: 400px;
    padding: 16px;
  }
}
</style>
