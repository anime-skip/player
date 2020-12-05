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
import vueMixins from 'vue-typed-mixins';
import VideoControllerMixin from '../../common/mixins/VideoController';
import KeyboardShortcutsMixin, { KeyboardShortcutMap } from '../../common/mixins/KeyboardShortcuts';
import TimestampDetails from '../components/TimestampDetails.vue';
import EditTimestamp from '../components/EditTimestamp.vue';
import BasicDialog from './BasicDialog.vue';
import mutationTypes from '@/common/store/mutationTypes';

export default vueMixins(VideoControllerMixin, KeyboardShortcutsMixin).extend({
  components: { BasicDialog, TimestampDetails, EditTimestamp },
  data() {
    return {
      initialTab: 'details' as 'edit' | 'details',
    };
  },
  computed: {
    activeTimestamp(): Api.AmbigousTimestamp | undefined {
      return this.$store.getters.activeTimestamp;
    },
  },
  methods: {
    onShow(): void {
      this.initialTab = this.activeTimestamp == null ? 'details' : 'edit';
    },
    setActiveTimestamp(timestamp: Api.AmbigousTimestamp): void {
      this.$store.commit(mutationTypes.setActiveTimestamp, timestamp);
    },
    updateTimestamp(): void {
      (this.$refs.timeSelect as HTMLDivElement | undefined)?.focus();
      if (this.activeTimestamp != null) {
        this.setActiveTimestamp({
          ...this.activeTimestamp,
          at: this.getCurrentTime(),
          edited: true,
        });
      }
    },
    setupKeyboardShortcuts(): KeyboardShortcutMap {
      return {
        advanceFrame: this.updateTimestamp,
        advanceSmall: this.updateTimestamp,
        advanceMedium: this.updateTimestamp,
        advanceLarge: this.updateTimestamp,

        rewindFrame: this.updateTimestamp,
        rewindSmall: this.updateTimestamp,
        rewindMedium: this.updateTimestamp,
        rewindLarge: this.updateTimestamp,
      };
    },
  },
});
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
