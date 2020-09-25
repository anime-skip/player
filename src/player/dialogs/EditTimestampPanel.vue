<template>
  <BasicDialog
    name="EditTimestampPanel"
    gravityX="flex-end"
    gravityY="center"
    @hide="onHide"
    @show="onShow"
  >
    <div class="top-container scroll">
      <h1 class="section-header">
        {{ title }}
        <div v-ripple class="img-button" title="Discard Changes (ESC)" @click="hideDialog()">
          <WebExtImg src="ic_close.svg" />
        </div>
      </h1>
      <h2 class="section-header">Timestamp Starts At</h2>
      <div ref="timeSelect" class="focusable button dark time-selector" tabindex="0">
        <WebExtImg class="icon" src="ic_clock.svg" :draggable="false" />
        <p class="time">
          {{ formattedAt }}
        </p>
      </div>
      <p class="label">Use J and L keys to adjust where the timestamp starts at</p>
      <h2 class="section-header section-header-spacing">Timestamp Type</h2>
      <TextInput
        ref="filterInput"
        class="flex row"
        leftIcon="ic_filter.svg"
        label="Filter..."
        v-model="typeFilter"
        @submit="onClickDone()"
        @keydown.native.up.stop.prevent="onPressUp"
        @keydown.native.down.stop.prevent="onPressDown"
      />
      <ul class="type-list">
        <li v-for="t of matchingTypes" :key="t.id" v-ripple @click="selectType(t)">
          <WebExtImg class="icon" :src="typeRadioIcon(t)" />
          <p class="name">{{ t.name }}</p>
        </li>
      </ul>
    </div>
    <div class="bottom-container">
      <input
        type="submit"
        value="Done"
        class="clickable focus button save"
        @click="onClickDone()"
        :class="{ disabled: isSaveDisabled() }"
      />
      <input
        v-if="shouldShowDelete()"
        type="submit"
        value="Delete"
        class="clickable focus invalid button delete"
        @click="onClickDelete()"
        :class="{ disabled: isSaveDisabled() }"
      />
    </div>
  </BasicDialog>
</template>

<script lang="ts">
import { Component, Watch, Mixins } from 'vue-property-decorator';
import Popup from '@/popup/Popup.vue';
import VideoControllerMixin from '../../common/mixins/VideoController';
import KeyboardShortcutsMixin from '../../common/mixins/KeyboardShortcuts';
import BasicDialog from './BasicDialog.vue';
import { Mutation, Getter, Action } from '../../common/utils/VuexDecorators';
import TextInput from '../../common/components/TextInput.vue';
import Utils from '../../common/utils/Utils';
import WebExtImg from '../../common/components/WebExtImg.vue';
import { TIMESTAMP_TYPES } from '../../common/utils/Constants';
import fuzzysort from 'fuzzysort';

@Component({
  components: {
    BasicDialog,
    Popup,
    WebExtImg,
    TextInput,
  },
})
export default class EditTimestampPanel extends Mixins(
  VideoControllerMixin,
  KeyboardShortcutsMixin
) {
  @Mutation() clearActiveTimestamp!: () => void;
  @Mutation() clearEditTimestampMode!: () => void;
  @Mutation() setActiveTimestamp!: (timestamp: Api.AmbigousTimestamp) => void;
  @Mutation() updateDraftTimestamp!: (newTimestamp: Api.AmbigousTimestamp) => void;
  @Mutation() deleteDraftTimestamp!: (deletedTimestamp: Api.AmbigousTimestamp) => void;
  @Getter() activeTimestamp?: Api.AmbigousTimestamp;
  @Action('showDialog') hideDialog!: () => void;
  @Getter() public episodeUrl?: Api.EpisodeUrl;
  @Getter() public editTimestampMode?: 'add' | 'edit';
  @Getter() activeDialog?: string;

  public typeFilter = '';
  public selectedType?: Api.TimestampType;

  public reset() {
    this.selectedType = TIMESTAMP_TYPES.find(type => type.id === this.activeTimestamp?.typeId);
    this.typeFilter = '';
  }

  @Watch('activeTimestamp')
  public onChangeActiveTimestamp(
    newTimestamp: Api.AmbigousTimestamp,
    oldTimestamp: Api.AmbigousTimestamp
  ) {
    if (newTimestamp && newTimestamp.id !== oldTimestamp?.id) {
      this.reset();
    }
  }

  public onShow() {
    this.reset();

    const interval = setInterval(() => {
      if (this.$refs.timeSelect != null) {
        (this.$refs.timeSelect as HTMLElement | undefined)?.focus();
        clearInterval(interval);
      }
    }, 200);
  }

  public onHide() {
    this.clearActiveTimestamp();
    this.clearEditTimestampMode();
    this.selectedType = undefined;
  }

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
      });
    }
  }

  public isSaveDisabled(): boolean {
    return this.activeTimestamp == null || this.selectedType == null || this.episodeUrl == null;
  }

  public get matchingTypes(): Api.TimestampType[] {
    const filter = this.typeFilter.trim();
    if (filter == '') return TIMESTAMP_TYPES;

    const results = fuzzysort.go(this.typeFilter, TIMESTAMP_TYPES, { key: 'name', limit: 5 });
    return results.map(item => item.obj);
  }

  public typeRadioIcon(type: Api.TimestampType): string {
    if (this.selectedType == null || type.id !== this.selectedType?.id) {
      return 'ic_radio_deselected.svg';
    }
    return 'ic_radio_selected.svg';
  }

  @Watch('matchingTypes')
  onChangeMatchingTypes(current: Api.TimestampType[], _old: Api.TimestampType[]) {
    if (current.length > 0) {
      this.selectType(current[0]);
    }
  }

  public selectType(type: Api.TimestampType) {
    this.selectedType = type;
    this.$forceUpdate();
  }

  public get formattedAt(): string {
    if (this.activeTimestamp == null) {
      return 'No timestamp selected';
    }
    return Utils.formatSeconds(this.activeTimestamp.at, true);
  }

  public shouldShowDelete(): boolean {
    return this.editTimestampMode === 'edit';
  }

  public get title(): string {
    if (this.editTimestampMode == null) {
      return 'ERROR';
    }
    if (this.editTimestampMode === 'add') {
      return 'Create a Timestamp';
    }
    return 'Edit Timestamp';
  }

  public onClickDone() {
    if (this.isSaveDisabled()) return;

    const base = this.activeTimestamp!;
    this.updateDraftTimestamp({
      at: base.at,
      typeId: this.selectedType!.id,
      id: base.id,
      source: base.source,
    });
    this.hideDialog();
    this.play();
  }

  public onClickDelete() {
    this.deleteDraftTimestamp(this.activeTimestamp!);
    this.hideDialog();
  }

  public onPressUp() {
    const types = this.matchingTypes;
    if (types.length === 0) return;

    const index = types.findIndex(type => type.id === this.selectedType?.id);
    const newIndex = (types.length + index - 1) % types.length;
    this.selectType(types[newIndex]);
  }

  public onPressDown() {
    const types = this.matchingTypes;
    if (types.length === 0) return;

    const index = types.findIndex(type => type.id === this.selectedType?.id);
    const newIndex = (index + 1) % types.length;
    this.selectType(types[newIndex]);
  }
}
</script>

<style lang="scss">
#EditTimestampPanel {
  pointer-events: none;
  color: $textPrimarySolid;
  text-align: start;

  h1 {
    font-weight: 500;
    font-size: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-right: -8px;

    .img-button {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    img {
      opacity: 0.48;
      transition: 250ms opacity;

      &:hover {
        opacity: 0.7;
      }
      &:hover:active {
        opacity: 1;
      }
    }
  }

  .section-header {
    margin-top: 0px;
    margin-bottom: 16px;
  }

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

  .top-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding-bottom: 0;

    .section-header-spacing {
      margin-top: 16px;
    }

    .time-selector {
      display: flex;
      flex-direction: row;
      align-items: center;
      min-height: 40px;
      padding: 0px;
      align-self: flex-start;

      .icon {
        width: 40px;
        height: 24px;
        opacity: 0.36;
      }

      .divider {
        width: 1px;
        align-self: stretch;
        background-color: $background300;
      }

      .time {
        margin-top: 4px;
        padding-left: 8px;
        padding-right: 16px;
        font-size: 18px;
        font-weight: 500;
        letter-spacing: 1px;
      }
    }

    .label {
      font-size: 14px;
      margin-top: 8px;
      color: $textSecondary;
      flex-wrap: wrap;
    }

    .type-list {
      flex-grow: 1;
      flex-basis: 0;
      display: flex;
      flex-direction: column;
      padding: 0;
      margin: 0;
      padding-top: 8px;

      li {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-top: 6px;
        padding-bottom: 6px;
        cursor: pointer;
        border-radius: 3px;
        margin-right: 4px;

        .icon {
          width: 36px;
          height: 24px;
          opacity: 0.36;
        }

        .name {
          margin: 0;
          margin-left: 8px;
          font-size: 15px;
        }
      }
    }
  }

  .scroll {
    flex-shrink: 1;
    flex-basis: 0;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: $divider #00000000;

    &::-webkit-scrollbar {
      width: 8px;
      padding: 1px;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #484848;
      border-radius: 5px;
    }
  }

  .bottom-container {
    display: flex;
    flex-direction: row-reverse;

    .save {
      margin-left: 24px;
    }

    .row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 16px;
    }
  }
}
</style>
