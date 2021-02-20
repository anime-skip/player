<template>
  <LoadingOverlay class="h-full" :isLoading="isSavingTimestamps">
    <div class="flex flex-col h-full">
      <header
        class="pl-4 pr-2 pb-2 -mt-1.5 -mx-4 border-b border-on-surface border-opacity-divider flex-shrink-0"
      >
        <h6 class="section-header flex flex-row items-center justify-between">
          <span>Timestamps</span>
          <ToolbarButton icon="ic_close.svg" @click="hideDialog()" />
        </h6>
      </header>
      <div class="scroll -mx-4 select-none pt-2 flex-1">
        <table class="w-full">
          <tr>
            <td colspan="4" class="px-4 text-center">
              <ToolbarButton
                v-if="isEditing"
                class="w-full"
                title="New timestamp"
                icon="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                @click="onClickAddNew"
              />
              <p v-if="!canEditTimestamps" class="text-error body-2 my-2">
                <template v-if="!isLoggedIn"
                  >You need to be
                  <a href="#" @click.prevent.stop="openLoginDialog" class="underline">logged in</a>
                  before editing timestamps</template
                >
                <template v-else-if="episodeUrl == null"
                  >Connect the episode to Anime Skip before editing timestamps</template
                >
                <template v-else
                  >Hmm... something is wrong. Are you logged in and is the episode connected to
                  Anime Skip?</template
                >
              </p>
            </td>
          </tr>
          <tr v-if="activeTimestamps.length === 0">
            <p class="py-4 text-center text-opacity-low">No timestamps</p>
          </tr>
          <template v-else>
            <tr
              v-for="timestamp of activeTimestamps"
              class="bg-on-surface bg-opacity-0 hover:bg-opacity-hover focus-within:bg-opacity-active transition-colors cursor-pointer py-2 px-4 group"
              :key="timestamp.id"
              @click="onClickTimestamp(timestamp)"
              @mouseenter="onHoverTimestamp(timestamp)"
              @mouseleave.stop.prevent="onStopHoverTimestamp()"
            >
              <td>
                <h6
                  class="font-bold text-right text-lg pt-0.5 pl-4 pr-2"
                  :style="itemTimestampStyle(timestamp)"
                >
                  {{ itemTime(timestamp) }}
                </h6>
                <p
                  v-if="timestamp.edited"
                  class="overflow-y-visible text-right -mt-2 text-2xs uppercase"
                  :style="itemTimestampStyle(timestamp)"
                >
                  {{ itemNote(timestamp) }}
                </p>
              </td>
              <td class="px-4 py-2 spacy-y-1 w-90%">
                <p class="">{{ itemType(timestamp) }}</p>
                <p v-if="itemHasSource(timestamp)" class="body-2 text-on-surface text-opacity-low">
                  {{ itemSouce(timestamp) }}
                </p>
              </td>
              <template v-if="canEditTimestamps">
                <td class="w-10 py-1">
                  <div
                    class="w-6 p-2 rounded-full box-content opacity-0 group-hover:opacity-medium hover:bg-on-surface hover:bg-opacity-hover transition-all"
                  >
                    <WebExtImg src="ic_delete.svg" @click.stop="deleteTimestamp(timestamp)" />
                  </div>
                </td>
                <td class="w-10 py-1">
                  <div
                    class="w-6 p-2 mr-2 rounded-full box-content opacity-low group-hover:opacity-medium hover:bg-on-surface hover:bg-opacity-hover"
                  >
                    <WebExtImg src="ic_edit.svg" @click.stop="editTimestamp(timestamp)" />
                  </div>
                </td>
              </template>
            </tr>
          </template>
        </table>
      </div>
      <footer v-if="canEditTimestamps" class="flex flex-row-reverse justify-center flex-shrink-0">
        <template v-if="isEditing">
          <RaisedButton class="text-on-primary" @click="onClickSave">Save Changes</RaisedButton>
          <div class="flex-1" />
          <RaisedButton dark class="text-on-secondary" @click="onClickDiscard"
            >Discard</RaisedButton
          >
        </template>
        <template v-else>
          <RaisedButton class="text-on-primary justify-self-center" @click="startEditing">
            Start Editing
          </RaisedButton>
        </template>
      </footer>
    </div>
  </LoadingOverlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Utils from '@/common/utils/Utils';
import { TIMESTAMP_TYPES, TIMESTAMP_SOURCES, SECONDS } from '@/common/utils/Constants';
import WebExtImg from '@/common/components/WebExtImg.vue';
import ToolbarButton from './ToolbarButton.vue';
import VideoControllerMixin from '@/common/mixins/VideoController';
import { MutationTypes } from '@/common/store/mutationTypes';
import { ActionTypes } from '@/common/store/actionTypes';
import { GetterTypes } from '@/common/store/getterTypes';
import useLoginDialog from '@/common/composition/useLoginDialog';
import TimestampColors from '@/player/utils/TimelineColors';

export default defineComponent({
  components: { WebExtImg, ToolbarButton },
  mixins: [VideoControllerMixin],
  setup() {
    const { openLoginDialog } = useLoginDialog();
    return {
      openLoginDialog,
    };
  },
  unmounted(): void {
    this.onStopHoverTimestamp();
  },
  data() {
    return {
      timestampTypeMap: TIMESTAMP_TYPES.reduce<{ [typeId: string]: Api.TimestampType }>(
        (map, timestamp) => {
          map[timestamp.id] = timestamp;
          return map;
        },
        {}
      ),
      timestampSourceMap: TIMESTAMP_SOURCES,
      hoverTimeout: undefined as number | undefined,
    };
  },
  computed: {
    activeTimestamps(): Api.AmbiguousTimestamp[] {
      return this.$store.getters[GetterTypes.ACTIVE_TIMESTAMPS];
    },
    canEditTimestamps(): boolean {
      return this.$store.getters[GetterTypes.CAN_EDIT_TIMESTAMPS];
    },
    isLoggedIn(): boolean {
      return this.$store.state.isLoggedIn;
    },
    isEditing(): boolean {
      return this.$store.state.isEditing;
    },
    episodeUrl(): Api.EpisodeUrlNoEpisode | undefined {
      return this.$store.state.episodeUrl;
    },
    isSavingTimestamps(): boolean {
      return this.$store.getters[GetterTypes.IS_SAVING_TIMESTAMPS];
    },
  },
  methods: {
    deleteDraftTimestamp(deletedTimestamp: Api.AmbiguousTimestamp): void {
      this.$store.commit(MutationTypes.DELETE_DRAFT_TIMESTAMP, deletedTimestamp);
    },
    setActiveTimestamp(timestamp: Api.AmbiguousTimestamp): void {
      this.$store.commit(MutationTypes.SET_ACTIVE_TIMESTAMP, timestamp);
    },
    setHoveredTimestamp(timestamp: Api.AmbiguousTimestamp): void {
      this.$store.commit(MutationTypes.SET_HOVERED_TIMESTAMP, timestamp);
    },
    clearHoveredTimestamp(): void {
      this.$store.commit(MutationTypes.CLEAR_HOVERED_TIMESTAMP);
    },
    setEditTimestampMode(mode: 'add' | 'edit' | undefined): void {
      this.$store.commit(MutationTypes.SET_EDIT_TIMESTAMP_MODE, mode);
    },
    startEditing(onStartedEditing?: () => void): void {
      this.$store.dispatch(ActionTypes.START_EDITING, onStartedEditing);
    },
    stopEditing(discard?: boolean): void {
      this.$store.dispatch(ActionTypes.STOP_EDITING, discard);
    },
    hideDialog(): void {
      this.$store.dispatch(ActionTypes.SHOW_DIALOG, undefined);
    },
    showPreferencesDialog(): void {
      this.$store.dispatch(ActionTypes.SHOW_DIALOG, 'PreferencesDialog');
    },
    showEpisodeDialog(): void {
      this.$store.dispatch(ActionTypes.SHOW_DIALOG, 'EditEpisodeDialog');
    },
    async createNewTimestamp(): Promise<void> {
      this.$store.dispatch(ActionTypes.CREATE_NEW_TIMESTAMP, undefined);
    },
    itemType(timestamp: Api.AmbiguousTimestamp): string {
      return this.timestampTypeMap[timestamp.typeId ?? '']?.name ?? 'Unknown';
    },
    itemTime(timestamp: Api.AmbiguousTimestamp): string {
      return Utils.formatSeconds(timestamp.at, false);
    },
    itemNote(timestamp: Api.AmbiguousTimestamp): string {
      return typeof timestamp.id === 'number' ? 'New' : 'Modified';
    },
    itemSouce(timestamp: Api.AmbiguousTimestamp): string {
      return this.timestampSourceMap[timestamp.source] ?? 'Unknown';
    },
    itemHasSource(timestamp: Api.AmbiguousTimestamp): boolean {
      return timestamp.source !== 'ANIME_SKIP';
    },
    itemTimestampStyle(timestamp: Api.AmbiguousTimestamp): string {
      const color =
        typeof timestamp.id === 'number'
          ? TimestampColors.new
          : timestamp.edited
          ? TimestampColors.edited
          : TimestampColors.defaultLight;
      return `color: ${color}`;
    },
    async editTimestamp(timestamp: Api.AmbiguousTimestamp): Promise<void> {
      this.pause();
      await this.startEditing(() => {
        this.setEditTimestampMode('edit');
        this.setActiveTimestamp(timestamp);
        this.setCurrentTime(timestamp.at);
      });
    },
    async deleteTimestamp(timestamp: Api.AmbiguousTimestamp): Promise<void> {
      await this.startEditing(() => {
        this.deleteDraftTimestamp(timestamp);
      });
    },
    onClickTimestamp(timestamp: Api.AmbiguousTimestamp): void {
      this.setCurrentTime(timestamp.at);
    },
    async onClickAddNew(): Promise<void> {
      await this.createNewTimestamp();
    },
    async onClickSave(): Promise<void> {
      await this.stopEditing();
      this.hideDialog();
    },
    async onClickDiscard(): Promise<void> {
      await this.stopEditing(true);
      this.hideDialog();
    },
    onHoverTimestamp(timestamp: Api.AmbiguousTimestamp): void {
      if (this.hoverTimeout != null) window.clearTimeout(this.hoverTimeout);
      this.setHoveredTimestamp(timestamp);
      this.hoverTimeout = window.setTimeout(this.clearHoveredTimestamp, 3 * SECONDS);
    },
    onStopHoverTimestamp(): void {
      if (this.hoverTimeout != null) window.clearTimeout(this.hoverTimeout);
      this.clearHoveredTimestamp();
    },
  },
});
</script>

<style scoped lang="scss">
@import '@anime-skip/ui/theme.scss';

.scroll {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba($color: $backgroundColor-primary, $alpha: $opacity-low)
    $backgroundColor-background;
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

.w-90\% {
  width: 100%;
}

.text-2xs {
  font-size: 0.575rem;
  line-height: 0.8rem;
}
</style>
