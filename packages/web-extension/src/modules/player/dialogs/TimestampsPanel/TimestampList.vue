<template>
  <LoadingOverlay class="as-h-full" :is-loading="isSavingTimestamps">
    <TimestampPanelLayout mode="close" title="Timestamps" @close="hideDialog">
      <template #content>
        <table class="as-w-full">
          <tr>
            <td :colspan="4" class="as-px-4 as-text-center">
              <ToolbarButton
                v-if="isEditing"
                class="as-w-full"
                title="New timestamp"
                icon="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                @click="onClickAddNew"
              />
              <p v-if="!canEditTimestamps" class="as-text-error as-my-2">
                <LoginWarning v-if="!isLoggedIn" before="editing timestamps" />
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
              @click="onClickTimestamp(timestamp)"
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
                  >
                    <WebExtImg src="ic_delete.svg" @click.stop="deleteTimestamp(timestamp)" />
                  </div>
                </td>
                <td class="as-w-10 as-py-1">
                  <div
                    class="as-w-6 as-p-2 as-mr-2 as-rounded-full as-box-content as-opacity-low group-hover:as-opacity-medium hover:as-bg-on-surface hover:as-bg-opacity-active"
                  >
                    <WebExtImg src="ic_edit.svg" @click.stop="editTimestamp(timestamp)" />
                  </div>
                </td>
              </template>
            </tr>
          </template>
        </table>
        <div class="as-h-3" />
      </template>
      <template v-if="canEditTimestamps" #footer>
        <template v-if="isEditing">
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
import { useIsLoggedIn } from '~/common/state/useAuth';
import { TIMESTAMP_SOURCES, TIMESTAMP_TYPES } from '~/common/utils/constants';
import * as Api from '~api';
import { SECONDS } from '~utils/time';
import { useCanEditTimestamps } from '../../hooks/useCanEditTimestamps';
import { useCreateNewTimestamp } from '../../hooks/useCreateNewTimestamp';
import { useDeleteDraftTimestamp } from '../../hooks/useDeleteDraftTimestamp';
import { useDisplayedTimestamps } from '../../hooks/useDisplayedTimestamps';
import { useMatchingTemplate } from '../../hooks/useMatchingTemplate';
import { useStartEditing } from '../../hooks/useStartEditing';
import { useStopEditing } from '../../hooks/useStopEditing';
import { useGetTimestampColor } from '../../hooks/useTimelineColors';
import { useHideDialog } from '../../state/useDialogState';
import {
  EditTimestampMode,
  useIsEditing,
  useIsSavingChanges,
  useUpdateActiveTimestamp,
  useUpdateEditTimestampMode,
} from '../../state/useEditingState';
import { useEpisodeUrl } from '../../state/useEpisodeState';
import {
  useClearHoveredTimestamp,
  useUpdateHoveredTimestamp,
} from '../../state/useHoveredTimestamp';
import { useVideoController } from '../../state/useVideoState';
import { useUpdateIsEditingTemplate } from './useTimestampPanelState';

const timestampTypeMap = TIMESTAMP_TYPES.reduce<{ [typeId: string]: Api.TimestampType }>(
  (map, timestamp) => {
    map[timestamp.id] = timestamp;
    return map;
  },
  {}
);
const isLoggedIn = useIsLoggedIn();
const isEditing = useIsEditing();
const episodeUrl = useEpisodeUrl();
const { pause, setCurrentTime } = useVideoController();

// Timestamp Hover

const [setTimestampHoverTimeout, clearTimestampHoverTimeout] = useTimeout();
const updateHoveredTimestamp = useUpdateHoveredTimestamp();
function onHoverTimestamp(timestamp: Api.AmbiguousTimestamp): void {
  clearTimestampHoverTimeout();
  updateHoveredTimestamp(timestamp);
  setTimestampHoverTimeout(clearHoveredTimestamp, SECONDS(3));
}

const clearHoveredTimestamp = useClearHoveredTimestamp(updateHoveredTimestamp);
function onStopHoverTimestamp(): void {
  clearTimestampHoverTimeout();
  clearHoveredTimestamp();
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

function onClickTimestamp(timestamp: Api.AmbiguousTimestamp) {
  setCurrentTime(timestamp.at);
}

// Editing

const activeTimestamps = useDisplayedTimestamps();
const updateActiveTimestamp = useUpdateActiveTimestamp();
const canEditTimestamps = useCanEditTimestamps();
const isSavingTimestamps = useIsSavingChanges();
const updateEditTimestampMode = useUpdateEditTimestampMode();

const startEditing = useStartEditing();
const stopEditing = useStopEditing();

function editTimestamp(timestamp: Api.AmbiguousTimestamp): void {
  pause();
  startEditing(() => {
    updateEditTimestampMode(EditTimestampMode.EDIT);
    updateActiveTimestamp(timestamp);
    setCurrentTime(timestamp.at);
  });
}

const deleteTimestamp = useDeleteDraftTimestamp();

const createNewTimestamp = useCreateNewTimestamp();
function onClickAddNew(): void {
  createNewTimestamp();
}

const hideDialog = useHideDialog();
async function onClickSave(): Promise<void> {
  await stopEditing();
  await hideDialog();
}
async function onClickDiscard(): Promise<void> {
  await stopEditing(true);
  await hideDialog();
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
