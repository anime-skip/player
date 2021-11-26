<template>
  <LoadingOverlay class="h-full" :is-loading="isSavingTimestamps">
    <TimestampPanelLayout mode="close" title="Timestamps" @close="hideDialog">
      <template #content>
        <table class="w-full">
          <tr>
            <td :colspan="4" class="px-4 text-center">
              <ToolbarButton
                v-if="isEditing"
                class="w-full"
                title="New timestamp"
                icon="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                @click="onClickAddNew"
              />
              <p v-if="!canEditTimestamps" class="text-error my-2">
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
                <div class="pl-4 text-right">
                  <h6 class="font-bold text-lg pt-0.5" :style="itemTimestampStyle(timestamp)">
                    {{ itemTime(timestamp) }}
                  </h6>
                  <p
                    v-if="timestamp.edited"
                    class="overflow-y-visible -mt-2 text-2xs uppercase"
                    :style="itemTimestampStyle(timestamp)"
                  >
                    {{ itemNote(timestamp) }}
                  </p>
                </div>
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
                    class="w-6 p-2 rounded-full box-content opacity-0 group-hover:opacity-medium hover:bg-on-surface hover:bg-opacity-active transition-all"
                  >
                    <WebExtImg src="ic_delete.svg" @click.stop="deleteTimestamp(timestamp)" />
                  </div>
                </td>
                <td class="w-10 py-1">
                  <div
                    class="w-6 p-2 mr-2 rounded-full box-content opacity-low group-hover:opacity-medium hover:bg-on-surface hover:bg-opacity-active"
                  >
                    <WebExtImg src="ic_edit.svg" @click.stop="editTimestamp(timestamp)" />
                  </div>
                </td>
              </template>
            </tr>
          </template>
        </table>
        <div class="h-3" />
      </template>
      <template v-if="canEditTimestamps" #footer>
        <template v-if="isEditing">
          <RaisedButton class="text-on-primary flex-grow" @click="onClickSave">
            Save Changes
          </RaisedButton>
          <RaisedButton dark class="text-on-secondary flex-grow" @click="onClickDiscard">
            Discard
          </RaisedButton>
        </template>
        <template v-else>
          <RaisedButton class="text-on-primary flex-grow" @click="startEditing()">
            Edit
          </RaisedButton>
          <RaisedButton dark class="text-on-secondary flex-grow" @click="onClickOpenTemplate">
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
import { TIMESTAMP_SOURCES, TIMESTAMP_TYPES } from '~/common/utils/Constants';
import { SECONDS } from '~/common/utils/time';
import * as Api from '~api';
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
const getTimestampColor = useGetTimestampColor(true); // Use lighter blue on the list so its easier to read
function itemTimestampStyle(timestamp: Api.AmbiguousTimestamp): string {
  return `color: ${getTimestampColor(timestamp)}`;
}

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

<style scoped lang="scss">
@import '@anime-skip/ui/variables-theme.scss';

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
