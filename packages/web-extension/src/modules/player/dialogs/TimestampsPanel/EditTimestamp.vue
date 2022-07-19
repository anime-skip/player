<template>
  <TimestampPanelLayout mode="back" :title="title" @back="clearActiveTimestamp">
    <template #content>
      <div
        class="as-flex as-flex-col as-flex-1 as-space-y-2 as-pt-3 as-px-4 as-pb-2 as-overflow-y-hidden"
      >
        <div
          ref="timeSelectRef"
          class="as-self-start as-flex-shrink-0 as-rounded-sm as-ring-primary as-no-firefox-dots"
          :class="{
            'as-ring as-ring-opacity-low': isTimeSelectFocused,
            'as-opacity-medium': !canAdjustTime,
          }"
          :tabindex="canAdjustTime ? 0 : -1"
          @focus="isTimeSelectFocused = true"
          @blur="isTimeSelectFocused = false"
          @click.stop.prevent="focusOnTimeSelect"
        >
          <RaisedContainer
            :down="isTimeSelectFocused"
            dark
            :disabled="!canAdjustTime"
            :tabindex="-1"
            class="as-no-firefox-dots"
          >
            <div
              class="as-w-full as-h-10 as-pl-3 as-pr-4 as-flex as-items-center as-space-x-3 as-no-firefox-dots"
            >
              <WebExtImg class="as-icon" src="ic_clock.svg" :draggable="false" />
              <p class="as-time">
                {{ timestampAtFormatted }}
              </p>
            </div>
          </RaisedContainer>
        </div>
        <p
          class="as-body-2 as-pb-2"
          :class="{
            'as-text-error': !canAdjustTime,
            'as-text-opacity-medium as-text-on-surface': canAdjustTime,
          }"
        >
          {{ adjustTimeLabel }}
        </p>
        <p class="as-subtitle-1 as-pt-2 as-pb-2">Timestamp type</p>
        <TextInput
          class="as-flex"
          placeholder="Filter..."
          v-model:value="typeFilter"
          @submit="onClickDone()"
          @keydown.up.stop.prevent="onPressUp"
          @keydown.down.stop.prevent="onPressDown"
        >
          <template #left-icon="slotProps">
            <Icon
              :disabled="slotProps.disabled"
              :active="slotProps.focused"
              path="M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z"
            />
          </template>
        </TextInput>
        <div>
          <p
            v-if="filteredResults.length === 0"
            class="as-px-4 as-py-6 as-text-error as-body-2 as-text-center"
          >
            No results
          </p>
          <ul v-else>
            <li
              v-for="t of filteredResults"
              :key="t.id"
              class="as-flex as-flex-row as-space-x-4 as-px-3 as-py-2 as-bg-on-surface as-bg-opacity-0 hover:as-bg-opacity-hover as-cursor-pointer as-rounded"
              @click="selectType(t)"
            >
              <Icon
                v-if="isTypeSelected(t)"
                class="as-fill-secondary as-opacity-100"
                path="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z"
              />
              <Icon
                v-else
                path="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
              />
              <p
                :class="{
                  'as-text-opacity-100': isTypeSelected(t),
                  'as-text-opacity-medium': !isTypeSelected(t),
                }"
              >
                {{ t.name }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template #footer>
      <RaisedButton @click="onClickDone" :disabled="isSaveDisabled" class="as-flex-grow">
        Save
      </RaisedButton>
      <RaisedButton
        v-if="isShowingDelete"
        error
        @click="onClickDelete"
        :disabled="isSaveDisabled"
        class="as-flex-grow"
      >
        Delete
      </RaisedButton>
    </template>
  </TimestampPanelLayout>
</template>

<script lang="ts" setup>
import { Utils } from '@anime-skip/ui';
import fuzzysort from 'fuzzysort';
import { TIMESTAMP_TYPES, TIMESTAMP_TYPE_NOT_SELECTED } from '~/common/utils/constants';
import { warn } from '~/common/utils/log';
import * as Api from '~api';
import { useApplyTimestampDiff } from '../../hooks/useApplyTimestampDiff';
import { useDeleteDraftTimestamp } from '../../hooks/useDeleteDraftTimestamp';
import useKeyboardShortcutBindingDisplay from '../../hooks/useKeyboardShortcutBindingDisplay';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useSaveDraftTimestamp } from '../../hooks/useSaveDraftTimestamp';
import { useHideDialog } from '../../state/useDialogState';
import {
  EditTimestampMode,
  useActiveTimestamp,
  useClearActiveTimestamp,
  useEditTimestampMode,
  useUpdateActiveTimestamp,
} from '../../state/useEditingState';
import { useEpisodeUrl } from '../../state/useEpisodeState';
import { useVideoController, useVideoState } from '../../state/useVideoState';
import { isTimestampLocal } from '../../utils/isTimestampLocal';

const props = defineProps<{
  initialTab: 'edit' | 'details';
}>();

const videoState = useVideoState();
const { play } = useVideoController();
const episodeUrl = useEpisodeUrl();
const editTimestampMode = useEditTimestampMode();

// Active Timestamp Tracking

const activeTimestamp = useActiveTimestamp();

function reset() {
  selectedType.value = TIMESTAMP_TYPES.find(type => type.id === activeTimestamp.value?.typeId);
  typeFilter.value = '';
}

watch(activeTimestamp, (newTimestamp, oldTimestamp) => {
  if (newTimestamp && newTimestamp.id !== oldTimestamp?.id) {
    reset();
  }
});

onMounted(() => {
  reset();
  if (canAdjustTime.value) focusOnTimeSelect();
});

const clearActiveTimestamp = useClearActiveTimestamp();
onUnmounted(clearActiveTimestamp);

// Keyboard Shortcuts

const updateActiveTimestamp = useUpdateActiveTimestamp();

function updateTimestampAt() {
  if (activeTimestamp.value == null) {
    warn('Cannot update timestamp position when none are selected');
    return;
  }
  focusOnTimeSelect();
  const newTimestamp = applyTimestampDiff({
    ...activeTimestamp.value,
    at: videoState.currentTime,
  });
  updateActiveTimestamp(newTimestamp);
}

useKeyboardShortcuts('Edit Timestamp', {
  rewindFrame: updateTimestampAt,
  rewindSmall: updateTimestampAt,
  rewindMedium: updateTimestampAt,
  rewindLarge: updateTimestampAt,
  advanceFrame: updateTimestampAt,
  advanceSmall: updateTimestampAt,
  advanceMedium: updateTimestampAt,
  advanceLarge: updateTimestampAt,
});

const frameRewindShortcut = useKeyboardShortcutBindingDisplay('rewindFrame');

const frameAdvanceShortcut = useKeyboardShortcutBindingDisplay('advanceFrame');

const adjustTimeLabel = computed<string>(() => {
  if (frameRewindShortcut.value && frameAdvanceShortcut.value)
    return `Use ${frameRewindShortcut.value} and ${frameAdvanceShortcut.value} keys to move left and right`;
  if (frameRewindShortcut.value)
    return `Use ${frameRewindShortcut.value} key to move left, no key shortcut to move right`;
  if (frameAdvanceShortcut.value)
    return `Use ${frameAdvanceShortcut.value} key to move right, no key shortcut to move left`;

  return `No keyboard shortcuts setup to adjust placement`;
});

const canAdjustTime = computed<boolean>(
  () => !!frameRewindShortcut.value || !!frameAdvanceShortcut.value
);

// Time selection

const isTimeSelectFocused = ref(false);
const timestampAtFormatted = computed(() => {
  if (activeTimestamp.value == null) return 'NA';
  return Utils.formatSeconds(activeTimestamp.value.at, true);
});

const timeSelectRef = ref<HTMLDivElement>();
function focusOnTimeSelect(): void {
  if (timeSelectRef.value != null) {
    (timeSelectRef.value as HTMLElement).focus();
  } else {
    const interval = setInterval(() => {
      if (timeSelectRef.value != null) {
        (timeSelectRef.value as HTMLElement).focus();
        clearInterval(interval);
      }
    }, 200);
  }
}

// Timestamp Type Selection

const typeFilter = ref('');

function selectType(type: Api.TimestampType) {
  selectedType.value = type;
}

const selectedType = ref<Api.TimestampType>();
const filteredResults = computed<Api.TimestampType[]>(() => {
  const filter = typeFilter.value.trim();
  if (filter === '') return TIMESTAMP_TYPES;

  return fuzzysort.go(filter, TIMESTAMP_TYPES, { key: 'name', limit: 5 }).map(({ obj }) => obj);
});
watch(filteredResults, results => {
  selectType(results[0]);
});

function isTypeSelected(type: Api.TimestampType): boolean {
  return selectedType.value?.id === type.id;
}

function onPressUp() {
  const types = filteredResults.value;
  if (types.length === 0) return;

  const index = types.findIndex(type => type.id === selectedType.value?.id);
  const newIndex = (types.length + index - 1) % types.length;
  selectType(types[newIndex]);
}
function onPressDown() {
  const types = filteredResults.value;
  if (types.length === 0) return;

  const index = types.findIndex(type => type.id === selectedType.value?.id);
  const newIndex = (index + 1) % types.length;
  selectType(types[newIndex]);
}

// Buttons

const hideDialog = useHideDialog();

const isSaveDisabled = computed(() => {
  if (activeTimestamp.value == null || episodeUrl.value == null) return true;
  if (isTimestampLocal(activeTimestamp.value)) return selectedType.value == null;
  return activeTimestamp.value.typeId === TIMESTAMP_TYPE_NOT_SELECTED;
});

const isShowingDelete = computed(() => editTimestampMode.value === EditTimestampMode.EDIT);

const title = computed(() => {
  if (editTimestampMode.value == null) return 'ERROR';
  if (editTimestampMode.value === EditTimestampMode.ADD) return 'New Timestamp';
  return 'Edit Timestamp';
});

const saveDraftTimestamp = useSaveDraftTimestamp();
const deleteDraftTimestamp = useDeleteDraftTimestamp();

function leaveDialog() {
  play();
  if (props.initialTab === 'edit') {
    hideDialog();
  } else {
    clearActiveTimestamp(); // So we go back to the timestamp list
  }
}

const applyTimestampDiff = useApplyTimestampDiff();
function onClickDone() {
  if (activeTimestamp.value == null) {
    throw new Error("Cannot click done when there isn't an active timestamp to be done with");
  }
  if (selectedType.value == null) {
    throw new Error("Cannot click done when the timestamp type hasn't been selected");
  }
  const base = activeTimestamp.value;
  // Makes sure the timestamp shows as edited
  const updatedTimestamp = applyTimestampDiff({
    at: base.at,
    typeId: selectedType.value.id,
    id: base.id,
    source: base.source,
  });
  saveDraftTimestamp(updatedTimestamp);
  leaveDialog();
}

function onClickDelete() {
  if (activeTimestamp.value == null) {
    throw new Error("Cannot delete the active timestamp when there isn't an active timestamp");
  }
  deleteDraftTimestamp(activeTimestamp.value);
  leaveDialog();
}
</script>

<style lang="scss" scoped>
.opacity-100 {
  opacity: 1 !important;
}

.no-firefox-dots::-moz-focus-inner {
  border: 0;
}
</style>
