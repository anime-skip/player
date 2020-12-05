<template>
  <div class="EditTimestamp">
    <header>
      <h1 class="section-header">
        <div v-ripple class="img-button" title="Discard changes" @click="clearActiveTimestamp">
          <WebExtImg src="ic_chevron_left.svg" />
        </div>
        {{ title }}
      </h1>
      <h2 class="section-header">Starts At</h2>
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
    </header>
    <div class="middle-container scroll">
      <ul class="type-list">
        <li v-for="t of matchingTypes" :key="t.id" v-ripple @click="selectType(t)">
          <WebExtImg class="icon" :src="typeRadioIcon(t)" />
          <p class="name">{{ t.name }}</p>
        </li>
      </ul>
    </div>
    <footer class="bottom-container">
      <input
        type="submit"
        value="Done"
        class="clickable focus button save"
        @click="onClickDone()"
        :class="{ disabled: isSaveDisabled }"
      />
      <input
        v-if="shouldShowDelete"
        type="submit"
        value="Delete"
        class="clickable focus invalid button delete"
        @click="onClickDelete()"
        :class="{ disabled: isSaveDisabled }"
      />
    </footer>
  </div>
</template>

<script lang="ts">
import vueMixins from 'vue-typed-mixins';
import VideoControllerMixin from '../../common/mixins/VideoController';
import KeyboardShortcutsMixin from '../../common/mixins/KeyboardShortcuts';
import TextInput from '../../common/components/TextInput.vue';
import Utils from '../../common/utils/Utils';
import WebExtImg from '../../common/components/WebExtImg.vue';
import { TIMESTAMP_TYPES, TIMESTAMP_TYPE_NOT_SELECTED } from '../../common/utils/Constants';
import fuzzysort from 'fuzzysort';
import { PropValidator } from 'vue/types/options';
import actionTypes from '@/common/store/actionTypes';
import mutationTypes from '@/common/store/mutationTypes';

export default vueMixins(VideoControllerMixin, KeyboardShortcutsMixin).extend({
  components: { WebExtImg, TextInput },
  props: {
    initialTab: { type: String, required: true } as PropValidator<'edit' | 'details'>,
  },
  mounted() {
    this.reset();
    // Because this happens after the render, we have to render again, otherwise when you click edit
    // on the list ite, it will not start with a type selected on this component. This should be
    // solved by vue3/composition
    this.$forceUpdate();

    const interval = setInterval(() => {
      if (this.$refs.timeSelect != null) {
        (this.$refs.timeSelect as HTMLElement | undefined)?.focus();
        clearInterval(interval);
      }
    }, 200);
  },
  destroyed() {
    this.clearActiveTimestamp();
    this.clearEditTimestampMode();
    this.selectedType = undefined;
  },
  watch: {
    activeTimestamp(newTimestamp: Api.AmbigousTimestamp, oldTimestamp: Api.AmbigousTimestamp) {
      if (newTimestamp && newTimestamp.id !== oldTimestamp?.id) {
        this.reset();
      }
    },
    matchingTypes(current: Api.TimestampType[], _old: Api.TimestampType[]) {
      if (current.length > 0) {
        this.selectType(current[0]);
      }
    },
  },
  data() {
    return {
      typeFilter: '',
      selectedType: undefined as Api.TimestampType | undefined,
    };
  },
  computed: {
    activeTimestamp(): Api.AmbigousTimestamp | undefined {
      return this.$store.getters.activeTimestamp;
    },
    episodeUrl(): Api.EpisodeUrlNoEpisode | undefined {
      return this.$store.getters.episodeUrl;
    },
    editTimestampMode(): 'add' | 'edit' | undefined {
      return this.$store.getters.editTimestampMode;
    },
    activeDialog(): string | undefined {
      return this.$store.getters.activeDialog;
    },
    isSaveDisabled(): boolean {
      // Don't have the info to save it
      if (this.activeTimestamp == null || this.episodeUrl == null) {
        return true;
      }
      if (typeof this.activeTimestamp.id === 'number') {
        return this.selectedType == null;
      }
      return this.activeTimestamp.typeId == TIMESTAMP_TYPE_NOT_SELECTED;
    },
    matchingTypes(): Api.TimestampType[] {
      const filter = this.typeFilter.trim();
      if (filter == '') return TIMESTAMP_TYPES;

      const results = fuzzysort.go(this.typeFilter, TIMESTAMP_TYPES, { key: 'name', limit: 5 });
      return results.map(item => item.obj);
    },
    formattedAt(): string {
      if (this.activeTimestamp == null) {
        return 'No timestamp selected';
      }
      return Utils.formatSeconds(this.activeTimestamp.at, true);
    },
    shouldShowDelete(): boolean {
      return this.editTimestampMode === 'edit';
    },
    title(): string {
      if (this.editTimestampMode == null) return 'ERROR';
      if (this.editTimestampMode === 'add') return 'Create a Timestamp';
      return 'Edit Timestamp';
    },
  },
  methods: {
    hideDialog(): void {
      this.$store.dispatch(actionTypes.showDialog, undefined);
    },
    clearActiveTimestamp(): void {
      this.$store.commit(mutationTypes.clearActiveTimestamp, undefined);
    },
    clearEditTimestampMode(): void {
      this.$store.commit(mutationTypes.clearEditTimestampMode, undefined);
    },
    setActiveTimestamp(timestamp: Api.AmbigousTimestamp): void {
      this.$store.commit(mutationTypes.setActiveTimestamp, timestamp);
    },
    updateTimestampInDrafts(newTimestamp: Api.AmbigousTimestamp): void {
      this.$store.commit(mutationTypes.updateTimestampInDrafts, newTimestamp);
    },
    deleteDraftTimestamp(deletedTimestamp: Api.AmbigousTimestamp): void {
      this.$store.commit(mutationTypes.deleteDraftTimestamp, deletedTimestamp);
    },
    reset() {
      this.selectedType = TIMESTAMP_TYPES.find(type => type.id === this.activeTimestamp?.typeId);
      this.typeFilter = '';
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
    typeRadioIcon(type: Api.TimestampType): string {
      if (this.selectedType == null || type.id !== this.selectedType?.id) {
        return 'ic_radio_deselected.svg';
      }
      return 'ic_radio_selected.svg';
    },
    selectType(type: Api.TimestampType) {
      this.selectedType = type;
      this.$forceUpdate();
    },
    leaveDialog(): void {
      this.play();
      if (this.initialTab === 'edit') {
        this.hideDialog();
      } else {
        this.clearActiveTimestamp();
      }
    },
    onClickDone() {
      const base = this.activeTimestamp!;
      const updatedTimestamp: Api.AmbigousTimestamp = {
        at: base.at,
        typeId: this.selectedType!.id,
        id: base.id,
        source: base.source,
        edited: true,
      };
      this.setActiveTimestamp(updatedTimestamp);
      this.updateTimestampInDrafts(updatedTimestamp);
      this.leaveDialog();
    },
    onClickDelete() {
      this.deleteDraftTimestamp(this.activeTimestamp!);
      this.leaveDialog();
    },
    onPressUp() {
      const types = this.matchingTypes;
      if (types.length === 0) return;

      const index = types.findIndex(type => type.id === this.selectedType?.id);
      const newIndex = (types.length + index - 1) % types.length;
      this.selectType(types[newIndex]);
    },
    onPressDown() {
      const types = this.matchingTypes;
      if (types.length === 0) return;

      const index = types.findIndex(type => type.id === this.selectedType?.id);
      const newIndex = (index + 1) % types.length;
      this.selectType(types[newIndex]);
    },
  },
});
</script>

<style scoped lang="scss">
.EditTimestamp {
  text-align: start;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  flex: 1;

  .section-header {
    margin-top: 0px;
    margin-bottom: 16px;
  }

  .section-header-spacing {
    margin-top: 16px;
  }

  header {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding-bottom: 0;

    h1 {
      font-weight: 500;
      font-size: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: -8px;

      .img-button {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 6px;
        margin-right: 6px;
      }

      img {
        opacity: 0.9;
        transition: 200ms opacity;

        &:hover:active {
          opacity: 1;
        }
      }
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
  }

  .middle-container {
    flex: 1;

    .type-list {
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

  footer {
    display: flex;
    flex-direction: row-reverse;
    flex-shrink: 0;
    padding-top: 16px;

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
