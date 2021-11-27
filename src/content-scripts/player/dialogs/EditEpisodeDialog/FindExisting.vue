<template>
  <form class="FindExisting py-4 space-y-4 flex flex-col">
    <div v-if="isShowingSuggestions" class="space-y-4 mt-2">
      <p class="caption mb-2 mx-4 text-on-surface text-opacity-medium">{{ suggestionsHeader }}</p>
      <div class="relative">
        <div class="flex flex-row overflow-x-auto box-border space-x-4 px-4">
          <div v-for="suggestion of suggestionListItems" :key="suggestion.index">
            <RaisedContainer dark @click.stop.prevent="onClickSuggestion(suggestion.value)">
              <div class="box-border w-44 px-4 pt-4 pb-3 text-left space-y-1">
                <p class="subtitle-1 text-primary font-semibold">
                  {{ suggestion.timestamps }}
                </p>
                <p class="text-on-surface text-opacity-medium caption pb-2">
                  from <strong>{{ suggestion.source || 'Anime Skip' }}</strong>
                </p>
                <p class="body-2 text-on-surface text-opacity-high">{{ suggestion.subtitle }}</p>
              </div>
            </RaisedContainer>
          </div>
        </div>
        <div class="gradient-borders" />
      </div>
    </div>
    <div v-else class="space-y-4 mt-2">
      <AutocompleteTextInput
        class="mx-4"
        placeholder="Enter the show name..."
        v-model:value="showItem"
        :options="showOptions"
        @select="onSelectShow"
        @search="searchShows"
      />
      <AutocompleteTextInput
        v-if="isExistingShow"
        ref="episodeInputRef"
        class="mx-4"
        placeholder="Enter the episode name..."
        v-model:value="episode"
        :options="episodeOptions"
        @search="searchEpisodes"
      />
    </div>
    <div class="flex flex-row-reverse mx-4 space-x-reverse space-x-4">
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
      <div class="flex-1" />
      <FlatButton transparent @click.stop.prevent="hideDialog">Cancel</FlatButton>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { CreateEpisodePrefill } from '~/@types';
import { useApiClient } from '~/common/hooks/useApiClient';
import { TIMESTAMP_SOURCES } from '~/common/utils/constants';
import EpisodeUtils from '~/common/utils/episode-utils';
import { error, warn } from '~/common/utils/log';
import * as Api from '~api';
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
const api = useApiClient();

// Autocomplete

const episodeInputRef = ref<TextInputRef>();
const {
  show: selectedShow,
  showItem,
  isExistingShow,
  showOptions,
  searchShows,
  onSelectShow,
} = useShowAutocomplete(props.prefill.show, episodeInputRef, api);
const { episodeOptions, searchEpisodes } = useEpisodeAutocomplete(selectedShow, api);
const hideDialog = useHideDialog();

const episode = ref<AutocompleteItem<Api.EpisodeSearchResult>>(
  props.prefill.episode ?? {
    title: '',
  }
);
const show = ref<AutocompleteItem<Api.ShowSearchResult>>(
  props.prefill.show ?? {
    title: '',
  }
);

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
    return show.value.title !== '' && show.value.data == null;
  }

  return episode.value.title !== '' && episode.value.data == null;
});

const isSaveDisabled = computed<boolean>(() => {
  return show.value.data == null || episode.value.data == null;
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
    show: show.value,
    episode: episode.value,
    season: props.prefill.season,
    number: props.prefill.number,
    absoluteNumber: props.prefill.absoluteNumber,
  };
  emit('createNew', prefill);
}

function onClickSave(): void {
  const s = show.value.data;
  const e = episode.value.data;
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

<style lang="css" scoped>
.gradient-borders {
  @apply pointer-events-none absolute inset-0;
}
.gradient-borders:before {
  @apply absolute inset-y-0 left-0 w-4;
  content: '';
  background: linear-gradient(90deg, #142026ff 25%, #14202600 100%);
}
.gradient-borders:after {
  @apply absolute inset-y-0 right-0 w-4;
  content: '';
  background: linear-gradient(270deg, #142026ff 25%, #14202600 100%);
}
</style>
