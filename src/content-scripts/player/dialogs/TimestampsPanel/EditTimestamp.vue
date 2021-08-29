<template>
  <TimestampPanelLayout mode="back" :title="title" @back="clearActiveTimestamp">
    <template #content>
      <div class="flex flex-col flex-1 space-y-2 pt-3 px-4 pb-2 overflow-y-hidden">
        <div class="flex flex-row space-x-4 pb-2 items-center">
          <div
            ref="timeSelectRef"
            class="self-start flex-shrink-0 rounded-sm ring-primary no-firefox-dots"
            :class="{
              'ring ring-opacity-low': isTimeSelectFocused,
            }"
            :tabindex="0"
            @focus="isTimeSelectFocused = true"
            @blur="isTimeSelectFocused = false"
            @click.stop.prevent="focusOnTimeSelect"
          >
            <RaisedContainer
              :down="isTimeSelectFocused"
              dark
              :tabindex="-1"
              class="no-firefox-dots"
            >
              <div class="w-full h-10 pl-3 pr-4 flex items-center space-x-3 no-firefox-dots">
                <WebExtImg class="icon" src="ic_clock.svg" :draggable="false" />
                <p class="time">
                  {{ timestampAtFormatted }}
                </p>
              </div>
            </RaisedContainer>
          </div>
          <p class="body-2 text-opacity-medium text-on-surface">
            Use J and L keys to move left and right
          </p>
        </div>
        <p class="subtitle-1 pt-2 pb-2">Timestamp type</p>
        <TextInput
          ref="filterInput"
          class="flex row -mb-2"
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
          <p v-if="filteredResults.length === 0" class="px-4 py-6 text-error body-2 text-center">
            No results
          </p>
          <ul v-else>
            <li
              v-for="t of filteredResults"
              :key="t.id"
              class="
                flex flex-row
                space-x-4
                px-3
                py-2
                bg-on-surface bg-opacity-0
                hover:bg-opacity-hover
                cursor-pointer
                rounded
              "
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
    </template>
    <template #footer class="flex-row-reverse space-x-reverse">
      <RaisedButton @click="onClickDone" :disabled="isSaveDisabled" class="flex-grow">
        Save
      </RaisedButton>
      <RaisedButton
        v-if="isShowingDelete"
        error
        @click="onClickDelete"
        :disabled="isSaveDisabled"
        class="flex-grow"
      >
        Delete
      </RaisedButton>
    </template>
  </TimestampPanelLayout>
</template>

<script lang="ts" setup>
import { Utils } from '@anime-skip/ui';
import fuzzysort from 'fuzzysort';
import * as Api from '~/common/api';
import { TIMESTAMP_TYPES, TIMESTAMP_TYPE_NOT_SELECTED } from '~/common/utils/Constants';
import { useApplyTimestampDiff } from '../../hooks/useApplyTimestampDiff';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useHideDialog } from '../../state/useDialogState';
import {
  EditTimestampMode,
  useActiveTimestamp,
  useClearActiveTimestamp,
  useEditTimestampMode,
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
  // TODO-REQ
  // Because this happens after the render, we have to render again, otherwise when you click edit
  // on the list ite, it will not start with a type selected on this component. This should be
  // solved by vue3/composition
  // this.$forceUpdate();
  focusOnTimeSelect();
});

const clearActiveTimestamp = useClearActiveTimestamp();
onUnmounted(() => {
  clearActiveTimestamp();
  // TODO-REQ: Not necessary?
  // this.clearEditTimestampMode();
  selectedType.value = undefined;
});

// Keyboard Shortcuts

useKeyboardShortcuts('Edit Timestamp', {});

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
  // TODO-REQ: Necessary?
  // this.$forceUpdate();
}

const selectedType = ref<Api.TimestampType>();
const filteredResults = computed<Api.TimestampType[]>(() => {
  const filter = typeFilter.value.trim();
  if (filter === '') return TIMESTAMP_TYPES;

  return fuzzysort.go(filter, TIMESTAMP_TYPES, { key: 'name', limit: 5 }).map(({ obj }) => obj);
});
watch(filteredResults, results => {
  if (results.length > 0) selectType(results[0]); // TODO-REQ: test that invalid filter prevents you from saving
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

function saveDraftTimestamp(newTimestamp: Api.AmbiguousTimestamp) {
  // TODO-REQ: Add draftTimestamps to editingState
  // this.$store.commit(MutationTypes.UPDATE_TIMESTAMP_IN_DRAFTS, newTimestamp);
}

function deleteDraftTimestamp(deletedTimestamp: Api.AmbiguousTimestamp): void {
  // TODO-REQ: Add draftTimestamps to editingState
  // this.$store.commit(MutationTypes.DELETE_DRAFT_TIMESTAMP, deletedTimestamp);
}

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
  // Update the timestamp's `editing` field before saving it
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

<style scoped lang="scss">
@import '@anime-skip/ui/variables-theme.scss';

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
