<template>
  <BasicDialog
    name="ConnectEpisodeDialog"
    gravity-x="center"
    gravity-y="center"
    :visible="dialogs.activeDialog === DialogName.CONNECT_EPISODE"
    @show="onShow"
    @hide="onHide"
    @dismiss="dialogs.hideDialog()"
  >
    <LoadingOverlay class="as-min-h-6" :is-loading="isLoading || !prefill">
      <div
        v-if="!auth.isLoggedIn"
        class="as-px-16 as-py-8 as-text-center as-self-center as-justify-self-center"
      >
        <LoginWarning before="connecting this episode to Anime Skip" />
      </div>
      <template v-else>
        <div class="as-flex as-flex-row as-mx-2">
          <p class="as-tab" :class="{ 'as-active': tab == 0 }" @click="onClickFindExisting">
            Find an existing episode
          </p>
          <p class="as-tab" :class="{ 'as-active': tab == 1 }" @click="onClickCreateNew">
            Create a new episode
          </p>
        </div>
        <template v-if="prefill">
          <FindExisting
            v-if="shouldShowFindExisting"
            @create-new="enableCreateNew"
            :prefill="prefill"
            :suggestions="suggestions"
          />
          <CreateNew v-if="shouldShowCreateNew" :prefill="prefill" />
        </template>
      </template>
    </LoadingOverlay>
  </BasicDialog>
</template>

<script lang="ts" setup>
import useRequestState, { RequestState } from 'vue-use-request-state';
import { CreateEpisodePrefill } from '../../@types';
import { useApiClient } from '../../composables/useApiClient';
import { debug, log, warn } from '../../utils/log';
import * as Api from 'common/src/api';
import * as Mappers from 'common/src/utils/mappers';
import { DialogName, useDialogStore } from '../../stores/useDialogStore';
import { useCrawlEpisodeInfoQuery } from '../../composables/useCrawlEpisodeInfoQuery';
import { useAuthStore } from '../../stores/useAuthStore';
import { useEpisodeStore } from '../../stores/useEpisodeStore';
import { useTimestampEditingStore } from '../../stores/useTimestampEditingStore';
import { useCrawlEpisodeStore } from '../../stores/useCrawledEpisodeStore';
import { storeToRefs } from 'pinia';

const dialogs = useDialogStore();
const auth = useAuthStore();
const editing = useTimestampEditingStore();

const prefill = ref<CreateEpisodePrefill>({
  show: { title: '' },
  episode: { title: '' },
});
const showing = ref(false);
const { crawledInfo } = storeToRefs(useCrawlEpisodeStore());
const crawledQuery = useCrawlEpisodeInfoQuery();

// Data Fetching

const api = useApiClient();

const { wrapRequest: wrapFetchSuggestionsByName, isLoading: isLoadingSuggestions } =
  useRequestState();
const fetchSuggestionsByName = wrapFetchSuggestionsByName(
  async (episodeName: string, showName: string): Promise<Api.ThirdPartyEpisode[]> => {
    try {
      const res = await api.findEpisodeByName(Api.THIRD_PARTY_EPISODE_DATA, {
        name: episodeName,
      });
      return (res as Api.ThirdPartyEpisode[]).filter(
        episode => episode.show.name.toLowerCase() === showName.toLowerCase()
      );
    } catch (err) {
      warn('failed to fetch suggestions:', { episodeName, showName }, err);
      return [];
    }
  }
);

const { wrapRequest: wrapLoadDefaultShowOption, isLoading: isLoadingDefaultShow } =
  useRequestState();
const loadDefaultShowOption = wrapLoadDefaultShowOption(async (): Promise<void> => {
  const showName = crawledInfo.value?.show;
  if (showName == null) {
    debug('Not fetching default show, name could not be inferred');
    return;
  }

  const searchResults: Api.ShowSearchResult[] = await api.searchShows(Api.SHOW_SEARCH_RESULT_DATA, {
    search: showName,
  });

  let showResult: Api.ShowSearchResult | undefined = searchResults.filter(
    result => result.name.toLowerCase() === showName.toLowerCase()
  )[0];

  // If we found a show, try and find the episode
  if (showResult != null) {
    const episodeResult = await loadDefaultEpisodeOption(showResult.id);
    const newShow = Mappers.showSearchResultToAutocompleteItem(showResult);

    if (episodeResult == null) {
      prefill.value = {
        ...prefill.value,
        show: newShow,
      };
    } else {
      prefill.value = {
        ...prefill.value,
        show: newShow,
        episode: Mappers.episodeSearchResultToAutocompleteItem(episodeResult),
      };
    }
  }
});

const { wrapRequest: wrapLoadDefaultEpisodeOption, isLoading: isLoadingDefaultEpisode } =
  useRequestState();
const loadDefaultEpisodeOption = wrapLoadDefaultEpisodeOption(
  async (showId: string): Promise<Api.EpisodeSearchResult | undefined> => {
    const episodeName = crawledQuery.data.value?.name;
    if (episodeName == null) {
      debug('Not fetching default episode, name could not be inferred');
      return undefined;
    }

    const searchResults = await api.searchEpisodes(Api.EPISODE_SEARCH_RESULT_DATA, {
      search: episodeName,
      showId,
    });

    const episodeResult: Api.EpisodeSearchResult | undefined = searchResults.filter(
      result => result.name?.toLowerCase() === episodeName.toLowerCase()
    )[0];

    return episodeResult;
  }
);

// Tab state

enum Tab {
  FIND_EXISTING,
  CREATE_NEW,
}
const tab = ref(Tab.FIND_EXISTING);

// don't show it while it's still loading so it properly fills the default show and episode values
const shouldShowTabs = computed(
  () => !isLoadingDefaultShow.value && !isLoadingDefaultEpisode.value
);
const shouldShowFindExisting = computed(
  () => shouldShowTabs.value && tab.value === Tab.FIND_EXISTING
);
const shouldShowCreateNew = computed(() => shouldShowTabs.value && tab.value === Tab.CREATE_NEW);

function onClickFindExisting(): void {
  tab.value = Tab.FIND_EXISTING;
}

function onClickCreateNew(): void {
  tab.value = Tab.CREATE_NEW;
}

function enableCreateNew(newPrefill: CreateEpisodePrefill): void {
  prefill.value = newPrefill;
  onClickCreateNew();
}

// Loading

watch(
  () => auth.isLoggedIn,
  (newIsLoggedIn, oldIsLoggedIn) => {
    if (showing.value && newIsLoggedIn && !oldIsLoggedIn) loadData();
  }
);
const isLoading = computed(
  () =>
    editing.isSaving ||
    isLoadingSuggestions.value ||
    isLoadingDefaultShow.value ||
    isLoadingDefaultEpisode.value
);

// Suggestions

const suggestions = ref<Api.ThirdPartyEpisode[]>([]);

function loadData() {
  loadSuggestions();
  loadDefaultShowOption();
}

async function loadSuggestions() {
  if (crawledQuery.data.value?.name == null || crawledQuery.data.value.show == null) {
    log(
      'Not fetching suggestions, episode or show name could not be inferred',
      toRaw(crawledQuery.data)
    );
    return;
  }
  suggestions.value = await fetchSuggestionsByName(
    crawledQuery.data.value.name,
    crawledQuery.data.value.show
  );

  if (suggestions.value.length === 0) onClickCreateNew();
}

// Dialog lifecycle

function onShow() {
  tab.value = Tab.FIND_EXISTING;
  prefill.value = {
    show: {
      title: crawledQuery.data.value?.show || '',
    },
    episode: {
      title: crawledQuery.data.value?.name || '',
    },
    season: crawledQuery.data.value?.season,
    number: crawledQuery.data.value?.number,
    absoluteNumber: crawledQuery.data.value?.absoluteNumber,
  };
  suggestions.value = [];

  if (auth.isLoggedIn) loadData();
  showing.value = true;
}

function onHide() {
  showing.value = false;
}
</script>

<style>
/* TODO: This style should be scoped... */
* {
  padding: 0;
  margin: 0;
}

#ConnectEpisodeDialog .as-dialog-root-container {
  width: 480px;
  overflow: visible;
}

.as-tab {
  @apply as-mx-2 as-pt-4 as-cursor-pointer as-border-b-2 as-text-on-surface as-border-primary as-border-opacity-0 as-text-opacity-medium as-font-bold as-transition-all;
}

.as-tab.as-active {
  @apply as-text-primary as-border-opacity-100;
}

.as-min-h-6 {
  min-height: 6rem; /* 96px */
}
</style>
