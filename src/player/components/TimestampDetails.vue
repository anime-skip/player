<template>
  <ProgressOverlay class="TimestampDetails" :isLoading="isSavingTimestamps">
    <header>
      <h1 class="section-header">
        Timestamps
        <!-- TODO: Ripple -->
        <div class="img-button" title="Close dialog" @click="hideDialog()">
          <WebExtImg src="ic_close.svg" />
        </div>
      </h1>
    </header>
    <ul>
      <!-- TODO: Ripple -->
      <li
        class="noselect"
        v-for="timestamp of activeTimestamps"
        :key="timestamp.id"
        @click="onClickTimestamp(timestamp)"
        @mouseover.stop.prevent="onHoverTimestamp(timestamp)"
        @mousemove.stop.prevent="onHoverTimestamp(timestamp)"
        @mouseleave.stop.prevent="onStopHoverTimestamp()"
      >
        <div class="left">
          <span class="title">{{ itemTitle(timestamp) }}</span>
          <span class="subtitle">{{ itemSubtitle(timestamp) }}</span>
        </div>
        <div v-if="canEditTimestamps" class="right" @click.stop.prevent @mousedown.stop.prevent>
          <!-- TODO: Ripple -->
          <div class="right-button delete" @click.stop.prevent="deleteTimestamp(timestamp)">
            <WebExtImg src="ic_delete.svg" />
          </div>
          <!-- TODO: Ripple -->
          <div class="right-button edit" @click="editTimestamp(timestamp)">
            <WebExtImg src="ic_edit.svg" />
          </div>
        </div>
      </li>
    </ul>
    <footer v-if="!isLoggedIn" class="warning">
      <WebExtImg src="ic_warning.svg" />
      <p>
        You must <a href="#" @click.stop.prevent="showAccountDialog">log in</a> before you can edit
        timestamps
      </p>
    </footer>
    <footer v-else-if="!canEditTimestamps && episodeUrl == null" class="warning">
      <WebExtImg src="ic_warning.svg" />
      <p>
        You have to
        <a href="#" @click.stop.prevent="showEpisodeDialog">provide episode info</a>
        before editing timestamps
      </p>
    </footer>
    <footer v-else class="editing">
      <ToolbarButton
        v-if="canEditTimestamps"
        class="add-new"
        title="New Timestamp"
        icon="ic_add_timestamp.svg"
        @click="onClickAddNew"
      />
      <div v-if="false" class="warning">
        <WebExtImg src="ic_warning.svg" />
        <p>
          You have to
          <a href="#" @click.stop.prevent="showEpisodeDialog">provide episode info</a>
          before editing timestamps
        </p>
      </div>
      <div v-if="isEditing" class="buttons">
        <button class="clickable focus button" @click="onClickSave">Save Changes</button>
        <button class="clickable focus button invalid" @click="onClickDiscard">Discard</button>
      </div>
      <div v-else class="buttons">
        <button class="clickable focus button" @click="startEditing">Start Editing</button>
      </div>
    </footer>
  </ProgressOverlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Utils from '@/common/utils/Utils';
import { TIMESTAMP_TYPES, TIMESTAMP_SOURCES, SECONDS } from '../../common/utils/Constants';
import WebExtImg from '../../common/components/WebExtImg.vue';
import ProgressOverlay from '../../common/components/ProgressOverlay.vue';
import ToolbarButton from './ToolbarButton.vue';
import VideoControllerMixin from '@/common/mixins/VideoController';
import { MutationTypes } from '@/common/store/mutationTypes';
import { ActionTypes } from '@/common/store/actionTypes';
import { GetterTypes } from '@/common/store/getterTypes';

export default defineComponent({
  components: { WebExtImg, ToolbarButton, ProgressOverlay },
  mixins: [VideoControllerMixin],
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
      return this.$store.getters[GetterTypes.IS_LOGGED_IN];
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
    showAccountDialog(): void {
      this.$store.dispatch(ActionTypes.SHOW_DIALOG, 'AccountDialog');
    },
    showEpisodeDialog(): void {
      this.$store.dispatch(ActionTypes.SHOW_DIALOG, 'EditEpisodeDialog');
    },
    async createNewTimestamp(): Promise<void> {
      this.$store.dispatch(ActionTypes.CREATE_NEW_TIMESTAMP, undefined);
    },
    itemTitle(timestamp: Api.AmbiguousTimestamp): string {
      return this.timestampTypeMap[timestamp.typeId ?? '']?.name ?? 'Unknown';
    },
    itemSubtitle(timestamp: Api.AmbiguousTimestamp): string {
      const source = this.timestampSourceMap[timestamp.source];
      const at = Utils.formatSeconds(timestamp.at, true);
      if (source == null) {
        return at;
      }

      // Using the &ensp; character
      /* eslint-disable-next-line no-irregular-whitespace */
      return `${at} • ${source ?? 'Unknown Source'}`;
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
.TimestampDetails {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;

  header {
    flex-shrink: 0;
    border-bottom: 1px solid $divider;
    margin: 0 -16px;
    padding: 0 16px;
    padding-bottom: 8px;

    h1 {
      font-weight: 500;
      font-size: 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-right: -4px;

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
  }

  ul {
    list-style: none;
    margin-top: 0;
    margin-bottom: -1px; // No double border at bottom
    margin-right: -16px;
    margin-left: -16px;
    flex: 1;
    border-bottom: 1px solid $divider;
    overflow-y: auto;

    li {
      display: flex;
      flex-direction: row;
      height: 64px;
      align-items: center;
      border-top: 1px solid $divider;
      cursor: pointer;
      padding-left: 16px;
      padding-right: 8px;
      transition: 200ms background-color;
      &:first-child {
        border-top: none;
      }
      &:hover {
        background-color: rgba($color: white, $alpha: 0.06);
      }

      .title {
        padding-top: 6px;
        font-family: 'Overpass', sans-serif;
        color: $textPrimary;
        font-size: 17px;
      }

      .subtitle {
        color: $textSecondary;
        font-size: 15px;
        font-family: sans-serif;
        margin-top: 0px;
      }

      .left {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .right {
        display: flex;
        flex-direction: row;

        .right-button {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.12;
          border-radius: 24px;
          transition: 200ms;
          &:hover {
            opacity: 0.92;
          }
          &:hover:active {
            opacity: 1;
          }
          &.delete {
            opacity: 0;
          }
        }
      }

      &:hover {
        .right {
          .right-button {
            opacity: 0.48;
            &:hover {
              opacity: 0.8;
              background-color: $divider;
            }
            &:hover:active {
              opacity: 1;
            }
          }
        }
      }
    }
  }

  footer {
    padding-top: 16px;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;

    &.warning,
    .warning {
      display: flex;
      flex-direction: row;
      align-items: flex-start;

      img {
        margin-right: 16px;
        width: 24px;
        height: 24px;
      }
    }
    .warning {
      margin-bottom: 16px;
    }

    .add-new {
      align-self: flex-start;
      margin-bottom: 16px;
    }

    &.editing {
      flex-direction: column;
    }

    .buttons {
      button {
        margin-right: 16px;
        &:last-child {
          margin-right: 0px;
        }
      }
    }
  }
}
</style>
