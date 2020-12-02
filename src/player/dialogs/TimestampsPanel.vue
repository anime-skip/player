<template>
  <BasicDialog
    id="TimestampsPanel"
    name="TimestampsPanel"
    gravityX="flex-end"
    gravityY="center"
    @show="onShow"
  >
    <EditTimestamp v-if="activeTimestamp != null" :initialTab="initialTab" />
    <TimestampDetails v-else />
  </BasicDialog>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import VideoControllerMixin from '../../common/mixins/VideoController';
import KeyboardShortcutsMixin from '../../common/mixins/KeyboardShortcuts';
import TimestampDetails from '../components/TimestampDetails.vue';
import EditTimestamp from '../components/EditTimestamp.vue';
import BasicDialog from './BasicDialog.vue';
import { Getter, Mutation } from '../../common/utils/VuexDecorators';

@Component({
  components: {
    BasicDialog,
    TimestampDetails,
    EditTimestamp,
  },
})
export default class TimestampsPanel extends Mixins(VideoControllerMixin, KeyboardShortcutsMixin) {
  @Getter() activeTimestamp?: Api.AmbigousTimestamp;

  @Mutation() setActiveTimestamp!: (timestamp: Api.AmbigousTimestamp) => void;

  initialTab: 'edit' | 'details' = 'details';

  keyboardShortcuts: { [action in KeyboardShortcutAction]?: () => void } = {
    advanceFrame: this.updateTimestamp,
    advanceSmall: this.updateTimestamp,
    advanceMedium: this.updateTimestamp,
    advanceLarge: this.updateTimestamp,

    rewindFrame: this.updateTimestamp,
    rewindSmall: this.updateTimestamp,
    rewindMedium: this.updateTimestamp,
    rewindLarge: this.updateTimestamp,
  };

  public updateTimestamp(): void {
    (this.$refs.timeSelect as HTMLDivElement | undefined)?.focus();
    if (this.activeTimestamp != null) {
      this.setActiveTimestamp({
        ...this.activeTimestamp,
        at: this.getCurrentTime(),
        edited: true,
      });
    }
  }

  public onShow(): void {
    this.initialTab = this.activeTimestamp == null ? 'details' : 'edit';
  }
}
</script>

<style lang="scss">
#TimestampsPanel {
  color: $textPrimarySolid;
  pointer-events: none;

  .dialog-root-container {
    width: 300px;
    min-height: 500px;
    height: 70%;
    max-height: 800px;
    margin-bottom: 36px;
    background-color: rgba($color: $background500, $alpha: 0.9);
    box-shadow: none;
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;

    @media screen and(max-height: 600px) {
      min-height: unset;
      height: 100%;
      max-height: unset;
      margin-bottom: 60px;
      border-top-left-radius: 0px;
    }

    & > * {
      padding: 14px 16px;
    }
  }
}
</style>
