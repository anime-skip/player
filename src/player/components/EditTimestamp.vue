<template>
  <div class="text-left h-full flex flex-col">
    <header
      class="flex flex-col flex-shrink-0 -mx-4 -mt-2 pl-2 pb-2 border-b border-opacity-divider border-on-surface"
    >
      <div class="mt-0 flex flex-row items-center">
        <div
          class="p-2 rounded-full select-none bg-on-surface bg-opacity-0 hover:bg-opacity-hover"
          title="Discard changes"
          @click="clearActiveTimestamp"
        >
          <WebExtImg class="w-6 h-6" src="ic_chevron_left.svg" :draggable="false" />
        </div>
        <h6 class="ml-2 pt-0.5">{{ title }}</h6>
      </div>
    </header>
    <div class="flex flex-col flex-1 space-y-2 pt-4 -mx-4 px-4 pb-2 overflow-y-hidden">
      <p class="subtitle-1">Starts At</p>
      <div class="flex flex-row space-x-4 py-2 items-center">
        <div
          ref="timeSelect"
          class="self-start flex-shrink-0 rounded-sm ring-primary no-firefox-dots"
          :class="{
            'ring ring-opacity-low': isTimeSelectFocused,
          }"
          tabindex="0"
          @focus="isTimeSelectFocused = true"
          @blur="isTimeSelectFocused = false"
          @click.stop.prevent="focusOnTimeSelect"
        >
          <RaisedContainer :down="isTimeSelectFocused" dark tabindex="-1" class="no-firefox-dots">
            <div class="w-full h-10 pl-3 pr-4 flex items-center space-x-3 no-firefox-dots">
              <WebExtImg class="icon" src="ic_clock.svg" :draggable="false" />
              <p class="time">
                {{ formattedAt }}
              </p>
            </div>
          </RaisedContainer>
        </div>
        <p class="body-2 text-opacity-medium text-on-surface">
          Use J and L keys to move left and right
        </p>
      </div>
      <p class="subtitle-1 py-2">Timestamp type</p>
      <TextInput
        ref="filterInput"
        class="flex row -mb-2"
        placeholder="Filter..."
        v-model:value="typeFilter"
        @submit="onClickDone()"
        @keydown.up.stop.prevent="onPressUp"
        @keydown.down.stop.prevent="onPressDown"
      >
        <template v-slot:left-icon="slotProps">
          <Icon
            :disabled="slotProps.disabled"
            :active="slotProps.focused"
            path="M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z"
          />
        </template>
      </TextInput>
      <div class="flex flex-col flex-1 rounded overflow-y-hidden">
        <p v-if="matchingTypes.length === 0" class="px-4 py-6 text-error body-2 text-center">
          No results
        </p>
        <ul v-else class="scroll overflow-y-auto">
          <li
            v-for="t of matchingTypes"
            :key="t.id"
            class="flex flex-row space-x-4 px-3 py-2 bg-on-surface bg-opacity-0 hover:bg-opacity-hover cursor-pointer"
            @click="selectType(t)"
          >
            <Icon
              v-if="isTypeSelected(t)"
              class="fill-secondary opacity-100"
              path="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z"
            />
            <Icon
              v-else
              path="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
            />
            <p
              :class="{
                'text-opacity-100': isTypeSelected(t),
                'text-opacity-medium': !isTypeSelected(t),
              }"
            >
              {{ t.name }}
            </p>
          </li>
        </ul>
      </div>
    </div>
    <footer class="pt-2 flex flex-row-reverse justify-between flex-shrink-0">
      <RaisedButton @click="onClickDone" :disabled="isSaveDisabled">Save</RaisedButton>
      <RaisedButton v-if="shouldShowDelete" error @click="onClickDelete" :disabled="isSaveDisabled"
        >Delete</RaisedButton
      >
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import VideoControllerMixin from '@/common/mixins/VideoController';
import KeyboardShortcutsMixin from '@/common/mixins/KeyboardShortcuts';
import Utils from '@/common/utils/Utils';
import WebExtImg from '@/common/components/WebExtImg.vue';
import { TIMESTAMP_TYPES, TIMESTAMP_TYPE_NOT_SELECTED } from '@/common/utils/Constants';
import fuzzysort from 'fuzzysort';
import { ActionTypes } from '@/common/store/actionTypes';
import { MutationTypes } from '@/common/store/mutationTypes';
import { GetterTypes } from '@/common/store/getterTypes';

export default defineComponent({
  name: 'EditTimestamp',
  components: { WebExtImg },
  mixins: [VideoControllerMixin, KeyboardShortcutsMixin],
  props: {
    initialTab: {
      type: String as PropType<'edit' | 'details'>,
      required: true,
    },
  },
  mounted() {
    this.reset();
    // Because this happens after the render, we have to render again, otherwise when you click edit
    // on the list ite, it will not start with a type selected on this component. This should be
    // solved by vue3/composition
    this.$forceUpdate();

    this.focusOnTimeSelect();
  },
  unmounted() {
    this.clearActiveTimestamp();
    this.clearEditTimestampMode();
    this.selectedType = undefined;
  },
  watch: {
    activeTimestamp(newTimestamp: Api.AmbiguousTimestamp, oldTimestamp: Api.AmbiguousTimestamp) {
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
      isTimeSelectFocused: false,
    };
  },
  computed: {
    activeTimestamp(): Api.AmbiguousTimestamp | undefined {
      return this.$store.state.activeTimestamp;
    },
    episodeUrl(): Api.EpisodeUrlNoEpisode | undefined {
      return this.$store.state.episodeUrl;
    },
    editTimestampMode(): 'add' | 'edit' | undefined {
      return this.$store.state.editTimestampMode;
    },
    activeDialog(): string | undefined {
      return this.$store.state.activeDialog;
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
      this.$store.dispatch(ActionTypes.SHOW_DIALOG, undefined);
    },
    clearActiveTimestamp(): void {
      this.$store.commit(MutationTypes.CLEAR_ACTIVE_TIMESTAMP, undefined);
    },
    clearEditTimestampMode(): void {
      this.$store.commit(MutationTypes.CLEAR_EDIT_TIMESTAMP_MODE, undefined);
    },
    setActiveTimestamp(timestamp: Api.AmbiguousTimestamp): void {
      this.$store.commit(MutationTypes.SET_ACTIVE_TIMESTAMP, timestamp);
    },
    updateTimestampInDrafts(newTimestamp: Api.AmbiguousTimestamp): void {
      this.$store.commit(MutationTypes.UPDATE_TIMESTAMP_IN_DRAFTS, newTimestamp);
    },
    deleteDraftTimestamp(deletedTimestamp: Api.AmbiguousTimestamp): void {
      this.$store.commit(MutationTypes.DELETE_DRAFT_TIMESTAMP, deletedTimestamp);
    },
    reset() {
      this.selectedType = TIMESTAMP_TYPES.find(type => type.id === this.activeTimestamp?.typeId);
      this.typeFilter = '';
    },
    updateTimestamp(): void {
      (this.$refs.timeSelect as HTMLDivElement | undefined)?.focus();
      if (this.activeTimestamp != null) {
        const newTimestamp = {
          ...this.activeTimestamp,
          at: this.getCurrentTime(),
        };
        this.setActiveTimestamp(
          this.$store.getters[GetterTypes.APPLY_TIMESTAMP_DIFF](newTimestamp)
        );
      }
    },
    isTypeSelected(type: Api.TimestampType): boolean {
      return this.selectedType != null && type.id === this.selectedType.id;
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
      const updatedTimestamp: Api.AmbiguousTimestamp = this.$store.getters[
        GetterTypes.APPLY_TIMESTAMP_DIFF
      ]({
        at: base.at,
        typeId: this.selectedType!.id,
        id: base.id,
        source: base.source,
      });
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
    focusOnTimeSelect(): void {
      if (this.$refs.timeSelect != null) {
        (this.$refs.timeSelect as HTMLElement).focus();
      } else {
        const interval = setInterval(() => {
          if (this.$refs.timeSelect != null) {
            (this.$refs.timeSelect as HTMLElement).focus();
            clearInterval(interval);
          }
        }, 200);
      }
    },
  },
});
</script>

<style scoped lang="scss">
@import '@anime-skip/ui/theme.scss';

.opacity-100 {
  opacity: 1 !important;
}

.scroll {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba($color: $backgroundColor-primary, $alpha: $opacity-low) transparent;
  &::-webkit-scrollbar {
    width: 8px;
    padding: 1px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: $backgroundColor-control-disabled;
    border-radius: 5px;
  }
}

.no-firefox-dots::-moz-focus-inner {
  border: 0;
}
</style>
