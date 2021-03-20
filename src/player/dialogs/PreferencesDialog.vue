<template>
  <BasicDialog name="PreferencesDialog" gravity-x="flex-end" gravity-y="flex-end">
    <GeneralSettings small>
      <RaisedButton dark @click="openExtensionOptions">
        <div class="flex justify-between w-full">
          <p class="remove-text body-1">All Settings</p>
        </div>
      </RaisedButton>
    </GeneralSettings>
    <SkippedSections two-columns />
  </BasicDialog>
</template>

<script lang="ts">
import GeneralSettings from '@/common/components/GeneralSettings.vue';
import SkippedSections from '@/common/components/SkippedSections.vue';
import Messenger from '@/common/utils/Messenger';
import { defineComponent } from 'vue';
import BasicDialog from './BasicDialog.vue';

export default defineComponent({
  components: {
    BasicDialog,
    GeneralSettings,
    SkippedSections,
  },
  setup() {
    const openExtensionOptions = () => {
      new Messenger<RuntimeMessageTypes>('General Settings').send(
        '@anime-skip/open-options',
        undefined
      );
    };
    return {
      openExtensionOptions,
    };
  },
});
</script>

<style lang="scss">
@import '../../common/css/constants.scss';

#PreferencesDialog {
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
