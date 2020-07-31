<template>
  <BasicDialog
    name="EditTimestampPanel"
    gravityX="end"
    gravityY="center"
    @hide="onHide"
    @show="reset()"
  >
    <div class="top-container">
      <h2 class="section-header">{{ title }}</h2>
      <div class="clickable down button dark time-selector">
        <WebExtImg class="icon" src="ic_clock.svg" :draggable="false" />
        <div class="divider" />
        <p class="time">
          {{ formattedAt }}
        </p>
      </div>
      <p class="label">Use J and L keys to adjust where the timestamp is at</p>
      <h2 class="section-header section-header-spacing">Timestamp Type</h2>
      <TextInput
        ref="filterInput"
        class="flex row"
        leftIcon="ic-filter.svg"
        label="Filter..."
        v-model="typeFilter"
        @submit="onClickSave()"
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
        v-if="shouldShowDelete()"
        type="submit"
        value="Delete"
        class="clickable focus invalid button delete"
      />
      <input
        type="submit"
        value="Cancel"
        class="clickable dark focus button cancel"
        @click="hideDialog"
      />
      <input
        type="submit"
        value="Save"
        class="clickable focus button save"
        @click="onClickSave()"
        :class="{ 'disabled transparent': isSaveDisabled() }"
      />
    </div>
  </BasicDialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from 'vue-property-decorator';
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
  @Getter() activeTimestamp?: Api.AmbigousTimestamp;
  @Action('showDialog') hideDialog!: () => void;
  @Getter() public episodeUrl?: Api.EpisodeUrl;
  @Getter() public editTimestampMode?: 'add' | 'edit';

  public typeFilter = '';
  public selectedType?: Api.TimestmampType;

  mounted() {
    this.reset();
  }

  reset() {
    this.selectedType = TIMESTAMP_TYPES.find(type => type.id === this.activeTimestamp?.typeId);
  }

  onHide() {
    this.clearActiveTimestamp();
    this.clearEditTimestampMode();
    this.selectedType = undefined;
  }

  keyboardShortcuts = {
    J: this.updateTimestamp,
    L: this.updateTimestamp,

    R: this.updateTimestamp,
    F: this.updateTimestamp,
    V: this.updateTimestamp,

    W: this.updateTimestamp,
    S: this.updateTimestamp,
    X: this.updateTimestamp,
  };

  public updateTimestamp(): boolean {
    if (this.activeTimestamp != null) {
      this.setActiveTimestamp({
        ...this.activeTimestamp,
        at: this.getCurrentTime(),
      });
    }
    return true;
  }

  public isSaveDisabled(): boolean {
    return this.activeTimestamp == null || this.selectedType == null || this.episodeUrl == null;
  }

  public get matchingTypes(): Api.TimestmampType[] {
    const filter = this.typeFilter.trim();
    if (filter == '') return TIMESTAMP_TYPES;

    const results = fuzzysort.go(this.typeFilter, TIMESTAMP_TYPES, { key: 'name', limit: 5 });
    return results.map(item => item.obj);
  }

  public typeRadioIcon(type: Api.TimestmampType): string {
    if (this.selectedType == null || type.id !== this.selectedType?.id) {
      return 'ic_radio_deselected.svg';
    }
    return 'ic_radio_selected.svg';
  }

  @Watch('matchingTypes')
  onChangeMatchingTypes(current: Api.TimestmampType[], old: Api.TimestmampType[]) {
    if (current.length === 1) {
      this.selectType(current[0]);
    }
  }

  public selectType(type: Api.TimestmampType) {
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
      return 'Add Timestamp At';
    }
    return 'Edit Timestamp At';
  }

  public onClickSave() {
    if (this.isSaveDisabled()) return;

    const base = this.activeTimestamp!;
    this.updateDraftTimestamp({
      at: base.at,
      typeId: this.selectedType!.id,
      id: base.id,
    });
    this.hideDialog();
    this.play();
  }
}
</script>

<style lang="scss">
#EditTimestampPanel {
  pointer-events: none;
  color: $textPrimarySolid;

  .section-header {
    margin-top: 0px;
    margin-bottom: 16px;
  }

  .dialog-root-container {
    width: 250px;
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
      height: 40px;
      padding: 0px;
      align-self: flex-start;
      cursor: not-allowed;

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
        padding: 0 16px;
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
      overflow-y: auto;
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
          margin-left: 8px;
          font-size: 15px;
        }
      }
    }
  }

  .bottom-container {
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: auto;
    grid-template-areas: 'cancel delete save';
    column-gap: 16px;

    .cancel {
      grid-area: cancel;
    }
    .delete {
      grid-area: delete;
    }
    .save {
      grid-area: save;
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
