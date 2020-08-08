<template>
  <BasicDialog name="AccountDialog" gravityX="flex-end" gravityY="flex-end">
    <Popup small />
  </BasicDialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Popup from '@/popup/Popup.vue';
import BasicDialog from './BasicDialog.vue';

@Component({
  components: {
    BasicDialog,
    Popup,
  },
})
export default class AccountDialog extends Vue {}
</script>

<style lang="scss">
#AccountDialog {
  padding-right: 16px;
  padding-bottom: $toolbarHeight + 4px + 8px;

  .dialog-root-container {
    max-height: 300px;
    max-width: 400px;
    & > * {
      padding: 14px 16px;
    }
  }
}
</style>
