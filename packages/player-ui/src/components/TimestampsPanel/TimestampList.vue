<template>
  <LoadingOverlay class="as-h-full" :is-loading="editing.isSaving">
    <TimestampPanelLayout mode="close" title="Timestamps" @close="dialogs.hideDialog()">
      <template #content>
        <table class="as-w-full">
          <tr>
            <td :colspan="4" class="as-px-4 as-text-center">
              <ToolbarButton
                v-if="editing.isEditing"
                class="as-w-full"
                title="New timestamp"
                @click="onClickAddNew"
              >
                <i-mdi-plus class="as-w-6 as-h-6 as-inline" />
              </ToolbarButton>
              <p v-if="!canEditTimestamps" class="as-text-error as-my-2">
                <LoginWarning v-if="!auth.isLoggedIn" before="editing timestamps" />
                <template v-else-if="episodeUrl == null">
                  Connect the episode to Anime Skip before editing timestamps
                </template>
                <template v-else>
                  Hmm... something is wrong. Are you logged in and is the episode connected to Anime
                  Skip?
                </template>
              </p>
            </td>
          </tr>
          <tr v-if="activeTimestamps.length === 0">
            <p class="as-py-4 as-text-center as-text-opacity-low">No timestamps</p>
          </tr>
          <template v-else>
            <tr
              v-for="timestamp of activeTimestamps"
              class="as-bg-on-surface as-bg-opacity-0 hover:as-bg-opacity-hover focus-within:as-bg-opacity-active as-transition-colors as-cursor-pointer as-py-2 as-px-4 as-group"
              :key="timestamp.id"
              @click="videoState.seekTo(timestamp.at)"
              @mouseenter="onHoverTimestamp(timestamp)"
              @mouseleave.stop.prevent="onStopHoverTimestamp()"
            >
              <td>
                <div class="as-pl-4 as-text-right">
                  <h6
                    class="as-font-bold as-text-lg as-pt-0.5"
                    :class="getTimestampClass(timestamp)"
                  >
                    {{ itemTime(timestamp) }}
                  </h6>
                  <p
                    v-if="timestamp.edited"
                    class="as-overflow-y-visible as--mt-2 as-text-2xs as-uppercase"
                    :class="getTimestampClass(timestamp)"
                  >
                    {{ itemNote(timestamp) }}
                  </p>
                </div>
              </td>
              <!-- TODO: as-spacy-y-1 -->
              <td class="as-px-4 as-py-2 as-spacy-y-1 as-w-90%">
                <p>{{ itemType(timestamp) }}</p>
                <p
                  v-if="itemHasSource(timestamp)"
                  class="as-body-2 as-text-on-surface as-text-opacity-low"
                >
                  {{ itemSouce(timestamp) }}
                </p>
              </td>
              <template v-if="canEditTimestamps">
                <td class="as-w-10 as-py-1">
                  <div
                    class="as-w-6 as-p-2 as-rounded-full as-box-content as-opacity-0 group-hover:as-opacity-medium hover:as-bg-on-surface hover:as-bg-opacity-active as-transition-all"
                    @click.stop="deleteTimestamp(timestamp)"
                  >
                    <i-mdi-delete class="as-w-6 as-h-6" />
                  </div>
                </td>
                <td class="as-w-10 as-py-1">
                  <div
                    class="as-w-6 as-p-2 as-mr-2 as-rounded-full as-box-content as-opacity-low group-hover:as-opacity-medium hover:as-bg-on-surface hover:as-bg-opacity-active"
                    @click.stop="editTimestamp(timestamp)"
                  >
                    <i-mdi-edit class="as-w-6 as-h-6" />
                  </div>
                </td>
              </template>
            </tr>
          </template>
        </table>
        <div class="as-h-3" />
      </template>
      <template v-if="canEditTimestamps" #footer>
        <template v-if="editing.isEditing">
          <RaisedButton class="as-text-on-primary as-flex-grow" @click="onClickSave">
            Save Changes
          </RaisedButton>
          <RaisedButton dark class="as-text-on-secondary as-flex-grow" @click="onClickDiscard">
            Discard
          </RaisedButton>
        </template>
        <template v-else>
          <RaisedButton class="as-text-on-primary as-flex-grow" @click="startEditing()">
            Edit
          </RaisedButton>
          <RaisedButton dark class="as-text-on-secondary as-flex-grow" @click="onClickOpenTemplate">
            {{ editTemplateText }}
          </RaisedButton>
        </template>
      </template>
    </TimestampPanelLayout>
  </LoadingOverlay>
</template>

<script lang="ts" setup>
import { useTimeout, Utils } from '@anime-skip/ui';
import { useCanEditTimestamps } from '../../composables/useCanEditTimestamps';
import { useCreateNewTimestamp } from '../../composables/useCreateNewTimestamp';
import { useDeleteDraftTimestamp } from '../../composables/useDeleteDraftTimestamp';
import { useDisplayedTimestamps } from '../../composables/useDisplayedTimestamps';
import { useMatchingTemplate } from '../../composables/useMatchingTemplate';
import { useStartEditing } from '../../composables/useStartEditing';
import { useStopEditing } from '../../composables/useStopEditing';
import { useGetTimestampColor } from '../../composables/useTimelineColors';
import { TIMESTAMP_SOURCES, TIMESTAMP_TYPES } from '../../utils/constants';
import * as Api from 'common/src/api';
import { SECONDS } from 'common/src/utils/time';
import { useUpdateIsEditingTemplate } from './useTimestampPanelState';
import { useAuthStore } from '../../state/stores/useAuthStore';
import {
  EditTimestampMode,
  useTimestampEditingStore,
} from '../../state/stores/useTimestampEditingStore';
import { useEpisodeStore } from '../../state/stores/useEpisodeStore';
import { storeToRefs } from 'pinia';
import { useFocusedTimestampStore } from '../../state/stores/useFocusedTimestampStore';
import { useDialogStore } from '../../state/stores/useDialogStore';
import { useVideoStateStore } from '../../state/stores/useVideoStateStore';

const auth = useAuthStore();
const editing = useTimestampEditingStore();
const { episodeUrl } = storeToRefs(useEpisodeStore());
const focusedTimestamp = useFocusedTimestampStore();
const dialogs = useDialogStore();
const videoState = useVideoStateStore();

const timestampTypeMap = TIMESTAMP_TYPES.reduce<{ [typeId: string]: Api.TimestampType }>(
  (map, timestamp) => {
    map[timestamp.id] = timestamp;
    return map;
  },
  {}
);

// Timestamp Hover

const [setTimestampHoverTimeout, clearTimestampHoverTimeout] = useTimeout();
function onHoverTimestamp(timestamp: Api.AmbiguousTimestamp): void {
  clearTimestampHoverTimeout();
  focusedTimestamp.timestamp = timestamp;
  setTimestampHoverTimeout(() => (focusedTimestamp.timestamp = undefined), SECONDS(3));
}

function onStopHoverTimestamp(): void {
  clearTimestampHoverTimeout();
  focusedTimestamp.timestamp = undefined;
}
onUnmounted(onStopHoverTimestamp);

// Templates

const existingTemplate = useMatchingTemplate();
const editTemplateText = computed(() =>
  !existingTemplate.value ? 'Create Template' : 'Edit Template'
);

// List Items

function itemType(timestamp: Api.AmbiguousTimestamp): string {
  return timestampTypeMap[timestamp.typeId ?? '']?.name ?? 'Unknown';
}
function itemTime(timestamp: Api.AmbiguousTimestamp): string {
  return Utils.formatSeconds(timestamp.at, false);
}
function itemNote(timestamp: Api.AmbiguousTimestamp): string {
  return typeof timestamp.id === 'number' ? 'New' : 'Modified';
}
function itemSouce(timestamp: Api.AmbiguousTimestamp): string {
  return TIMESTAMP_SOURCES[timestamp.source] ?? 'Unknown';
}
function itemHasSource(timestamp: Api.AmbiguousTimestamp): boolean {
  return timestamp.source !== 'ANIME_SKIP';
}
const getTimestampClass = useGetTimestampColor('text');

// Editing

const activeTimestamps = useDisplayedTimestamps();
const canEditTimestamps = useCanEditTimestamps();

const startEditing = useStartEditing();
const stopEditing = useStopEditing();

function editTimestamp(timestamp: Api.AmbiguousTimestamp): void {
  videoState.pause();
  startEditing(() => {
    editing.editTimestampMode = EditTimestampMode.EDIT;
    editing.activeTimestamp = timestamp;
    videoState.seekTo(timestamp.at);
  });
}

const deleteTimestamp = useDeleteDraftTimestamp();

const createNewTimestamp = useCreateNewTimestamp();
function onClickAddNew(): void {
  createNewTimestamp();
}

async function onClickSave(): Promise<void> {
  await stopEditing();
  dialogs.hideDialog();
}
async function onClickDiscard(): Promise<void> {
  await stopEditing(true);
  dialogs.hideDialog();
}
const updateIsEditingTemplate = useUpdateIsEditingTemplate();
function onClickOpenTemplate(): void {
  updateIsEditingTemplate(true);
}
</script>

<style lang="scss" scoped>
// TODO: Hmm, interesting style...
.as-w-90\% {
  width: 100%;
}

.as-text-2xs {
  font-size: 0.575rem;
  line-height: 0.8rem;
}
</style>
