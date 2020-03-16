<template>
  <BasicDialog name="AccountDialog" gravityX="end" gravityY="end">
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
export default class ToolBar extends Vue {}
</script>

<style lang="scss">
#AccountDialog {
  margin-right: 16px;
  margin-bottom: $toolbarHeight + 4px + 8px;

  .dialog-root-container {
    max-height: 300px;
    max-width: 400px;
    & > * {
      padding: 14px 16px;
    }
  }
}
</style>
