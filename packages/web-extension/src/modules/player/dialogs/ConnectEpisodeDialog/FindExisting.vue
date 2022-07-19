<template>
  <form class="FindExisting as-py-4 as-space-y-4 as-flex as-flex-col">
    <div v-if="isShowingSuggestions" class="as-space-y-4 as-mt-2">
      <p class="as-caption as-mb-2 as-mx-4 as-text-on-surface as-text-opacity-medium">
        {{ suggestionsHeader }}
      </p>
      <div class="as-relative">
        <div class="as-flex as-flex-row as-overflow-x-auto as-box-border as-space-x-4 as-px-4">
          <div v-for="suggestion of suggestionListItems" :key="suggestion.index">
            <RaisedContainer dark @click.stop.prevent="onClickSuggestion(suggestion.value)">
              <div class="as-box-border as-w-44 as-px-4 as-pt-4 as-pb-3 as-text-left as-space-y-1">
                <p class="as-subtitle-1 as-text-primary as-font-semibold">
                  {{ suggestion.timestamps }}
                </p>
                <p class="as-text-on-surface as-text-opacity-medium as-caption as-pb-2">
                  from <strong>{{ suggestion.source || 'Anime Skip' }}</strong>
                </p>
                <p class="as-body-2 as-text-on-surface as-text-opacity-high">
                  {{ suggestion.subtitle }}
                </p>
              </div>
            </RaisedContainer>
          </div>
        </div>
        <div class="as-gradient-borders" />
      </div>
    </div>
    <div v-else class="as-space-y-4 as-mt-2">
      <AutocompleteTextInput
        class="as-mx-4"
        placeholder="Enter the show name..."
        v-model:value="showItem"
        :options="showOptions"
        @select="onSelectShow"
        @search="searchShows"
      />
      <AutocompleteTextInput
        v-if="isExistingShow"
        ref="episodeInputRef"
        class="as-mx-4"
        placeholder="Enter the episode name..."
        v-model:value="episodeItem"
        :options="episodeOptions"
        @search="searchEpisodes"
      />
    </div>
    <div class="as-flex as-flex-row-reverse as-mx-4 as-space-x-reverse as-space-x-4">
      <template v-if="!isShowingSuggestions">
        <RaisedButton v-if="shouldCreateNew" @click.stop.prevent="onClickCreateNew">
          Create New
        </RaisedButton>
        <RaisedButton v-else :disabled="isSaveDisabled" @click.stop.prevent="onClickSave">
          Save Episode
        </RaisedButton>
      </template>
      <RaisedButton v-if="isShowingSuggestions" @click.stop.prevent="toggleSuggestions(false)">
        Manual Search
      </RaisedButton>
      <FlatButton
        v-else-if="hasSuggestions"
        transparent
        @click.stop.prevent="toggleSuggestions(true)"
      >
        {{ suggestionsHeader }}
      </FlatButton>
      <div class="as-flex-1" />
      <FlatButton transparent @click.stop.prevent="hideDialog">Cancel</FlatButton>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { CreateEpisodePrefill } from '~/@types';
import { TIMESTAMP_SOURCES } from '~/common/utils/constants';
import { error, warn } from '~/common/utils/log';
import * as Api from '~api';
import { TextInputRef } from '~types';
import EpisodeUtils from '~utils/episode-utils';
import { useCreateEpisodeFromThirdParty } from '../../hooks/useCreateEpisodeFromThirdParty';
import { useEpisodeAutocomplete } from '../../hooks/useEpisodeAutocomplete';
import { useLinkEpisodeUrl } from '../../hooks/useLinkEpisodeUrl';
import { useShowAutocomplete } from '../../hooks/useShowAutocomplete';
import { useHideDialog } from '../../state/useDialogState';

const props = defineProps<{
  suggestions: Api.ThirdPartyEpisode[];
  prefill: CreateEpisodePrefill;
}>();
const emit = defineEmits({
  createNew: (_arg: CreateEpisodePrefill) => true,
});

// Autocomplete

const episodeInputRef = ref<TextInputRef>();
const { show, showItem, isExistingShow, showOptions, searchShows, onSelectShow } =
  useShowAutocomplete(props.prefill.show, episodeInputRef);
const { episodeOptions, searchEpisodes, episodeItem } = useEpisodeAutocomplete(
  props.prefill.episode,
  show
);
const hideDialog = useHideDialog();

// Suggestions

const isShowingSuggestions = ref<boolean>(props.suggestions.length > 0);

watch(
  () => props.suggestions,
  newSuggestions => {
    isShowingSuggestions.value = newSuggestions.length > 0;
  }
);

function toggleSuggestions(newIsShowingSuggestions: boolean): void {
  isShowingSuggestions.value = newIsShowingSuggestions;
}

const suggestionListItems = computed<
  Array<{
    index: number;
    show: string;
    episode: string;
    subtitle: string;
    timestamps: string;
    source: string | null | undefined;
    value: Api.ThirdPartyEpisode;
  }>
>(() => {
  return props.suggestions.map((suggestion, index) => {
    const timestamps = `${suggestion.timestamps.length} timestamp${
      suggestion.timestamps.length === 1 ? '' : 's'
    }`;
    const source = TIMESTAMP_SOURCES[suggestion.source];
    return {
      index,
      show: suggestion.show.name ?? 'Unknown Show',
      episode: suggestion.name ?? 'Unknown Episode',
      subtitle: EpisodeUtils.seasonAndNumberDisplay(suggestion),
      timestamps,
      source,
      value: suggestion,
    };
  });
});
const suggestionsHeader = computed<string>(() => {
  const count = suggestionListItems.value.length;
  if (count === 1) {
    return '1 Suggestion';
  }
  return `${count} Suggestions`;
});

const shouldCreateNew = computed<boolean>(() => {
  if (!isExistingShow.value) {
    return showItem.value.title !== '' && showItem.value.data == null;
  }

  return episodeItem.value.title !== '' && episodeItem.value.data == null;
});

const isSaveDisabled = computed<boolean>(() => {
  return showItem.value.data == null || episodeItem.value.data == null;
});

const hasSuggestions = computed<boolean>(() => {
  return !!props.suggestions?.length;
});

function onClickSuggestion(suggestion: Api.ThirdPartyEpisode): void {
  if (suggestion.source !== 'ANIME_SKIP') {
    createFromThirdParty(suggestion);
  } else {
    linkToExistingEpisode(suggestion);
  }
}

function onClickCreateNew(): void {
  const prefill: CreateEpisodePrefill = {
    show: showItem.value,
    episode: episodeItem.value,
    season: props.prefill.season,
    number: props.prefill.number,
    absoluteNumber: props.prefill.absoluteNumber,
  };
  emit('createNew', prefill);
}

function onClickSave(): void {
  const s = showItem.value.data;
  const e = episodeItem.value.data;
  if (s == null || e == null) {
    error('Failed to save, show or episode were not selected', {
      show: s,
      episode: e,
    });
    return;
  }

  linkToExistingEpisode(e);
}

const _linkEpisodeUrl = useLinkEpisodeUrl();
function linkToExistingEpisode(episodeToSave: Api.EpisodeSearchResult) {
  _linkEpisodeUrl(episodeToSave, hideDialog).catch(warn);
}

const _createFromThirdParty = useCreateEpisodeFromThirdParty();
function createFromThirdParty(thirdPartyEpisodeToSave: Api.ThirdPartyEpisode) {
  _createFromThirdParty(thirdPartyEpisodeToSave, hideDialog).catch(warn);
}
</script>

<style scoped>
.as-gradient-borders {
  @apply as-pointer-events-none as-absolute as-inset-0;
}
.as-gradient-borders:before {
  @apply as-absolute as-inset-y-0 as-left-0 as-w-4;
  content: '';
  background: linear-gradient(90deg, #142026ff 25%, #14202600 100%);
}
.as-gradient-borders:after {
  @apply as-absolute as-inset-y-0 as-right-0 as-w-4;
  content: '';
  background: linear-gradient(270deg, #142026ff 25%, #14202600 100%);
}
</style>
