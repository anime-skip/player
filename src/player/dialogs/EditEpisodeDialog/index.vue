<template>
  <BasicDialog
    name="EditEpisodeDialog"
    gravityX="center"
    gravityY="center"
    @show="onShow"
    @hide="onHide"
  >
    <LoadingOverlay class="min-h-6" :isLoading="isLoading">
      <div v-if="!isLoggedIn" class="px-16 py-8 text-center self-center justify-self-center">
        <LoginWarning before="connecting this episode to Anime Skip" />
      </div>
      <template v-else>
        <div class="flex flex-row mx-2">
          <p class="tab" :class="{ active: tab == 0 }" @click="onClickFindExisting">
            Find an existing episode
          </p>
          <p class="tab" :class="{ active: tab == 1 }" @click="onClickCreateNew">
            Create a new episode
          </p>
        </div>
        <FindExisting
          v-if="shouldShowFindExisting"
          @createNew="enableCreateNew"
          :prefill="prefill"
          :suggestions="suggestions"
        />
        <CreateNew v-else-if="shouldShowCreateNew" :prefill="prefill" />
      </template>
    </LoadingOverlay>
  </BasicDialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LoadingOverlay } from '@anime-skip/ui';
import BasicDialog from '../BasicDialog.vue';
import FindExisting from './FindExisting.vue';
import CreateNew from './CreateNew.vue';
import Utils from '@/common/utils/Utils';
import RequestState from '@/common/utils/RequestState';
import Mappers from '@/common/utils/Mappers';
import LoginWarning from '@/player/components/LoginWarning';

export default defineComponent({
  components: { LoadingOverlay, BasicDialog, FindExisting, CreateNew, LoginWarning },
  data() {
    const suggestions: Api.ThirdPartyEpisode[] = [];
    const prefill: CreateEpisodePrefill = {
      show: {
        title: '',
      },
      episode: {
        title: '',
      },
    };
    return {
      tab: 0,
      prefill,
      suggestions,
      isLoadingSuggestions: false,
      isLoadingDefaultShow: false,
      isLoadingDefaultEpisode: false,
      showing: false,
    };
  },
  computed: {
    inferredInfo(): InferredEpisodeInfo | undefined {
      return this.$store.state.inferredEpisodeInfo;
    },
    isLoading(): boolean {
      return (
        this.$store.getters.IS_LOGGING_IN ||
        this.$store.state.episodeRequestState === RequestState.LOADING ||
        this.isLoadingSuggestions ||
        this.isLoadingDefaultShow ||
        this.isLoadingDefaultEpisode
      );
    },
    isLoggedIn(): boolean {
      return this.$store.getters.IS_LOGGED_IN && !this.$store.getters.IS_LOGGING_IN;
    },
    shouldShowTabs(): boolean {
      // don't show it while it's still loading so it properly fills the default show and episode values
      return !this.isLoadingDefaultShow && !this.isLoadingDefaultEpisode;
    },
    shouldShowFindExisting(): boolean {
      return this.shouldShowTabs && this.tab === 0;
    },
    shouldShowCreateNew(): boolean {
      return this.shouldShowTabs && this.tab === 1;
    },
  },
  watch: {
    isLoggedIn(newValue, oldValue): void {
      if (this.showing && newValue && !oldValue) {
        // TODO: Fix race condition that leads to immeditate log out
        setTimeout(() => {
          this.loadSuggestions();
          this.loadDefaultShowOption();
        }, 200);
      }
    },
  },
  methods: {
    onShow(): void {
      this.tab = 0;
      this.prefill = {
        show: {
          title: this.inferredInfo?.show || '',
        },
        episode: {
          title: this.inferredInfo?.name || '',
        },
        season: this.inferredInfo?.season,
        number: this.inferredInfo?.number,
        absoluteNumber: this.inferredInfo?.absoluteNumber,
      };
      this.suggestions = [];

      if (this.isLoggedIn) {
        this.loadSuggestions();
        this.loadDefaultShowOption();
      }
      this.showing = true;
    },
    onHide(): void {
      this.showing = false;
    },
    async loadSuggestions(): Promise<void> {
      if (this.inferredInfo?.name == null || this.inferredInfo.show == null) {
        console.debug(
          'Not fetching suggestions, episode or show name could not be inferred',
          this.inferredInfo
        );
        return;
      }
      this.isLoadingSuggestions = true;
      try {
        const suggestions = await Utils.apiAction(
          this.$store,
          global.Api.fetchEpisodeByName,
          this.inferredInfo.name,
          this.inferredInfo.show
        );
        this.isLoadingSuggestions = false;
        this.suggestions = suggestions;
        if (suggestions.length === 0) {
          this.onClickCreateNew();
        }
      } catch (err) {
        console.info('Failed to load suggestions', err);
        this.isLoadingSuggestions = false;
        this.onClickCreateNew();
      }
    },
    async loadDefaultShowOption(): Promise<void> {
      const showName = this.inferredInfo?.show;
      if (showName == null) {
        console.debug('Not fetching default show, name could not be inferred');
        return;
      }

      let showResult: Api.ShowSearchResult | undefined;
      this.isLoadingDefaultShow = true;
      try {
        const searchResults = await Utils.apiAction(this.$store, global.Api.searchShows, showName);

        const results = searchResults.filter(result => result.name === showName);
        if (results.length === 1) {
          showResult = results[0];
        }
      } catch (err) {
        this.isLoadingDefaultShow = false;
        console.warn('Failed to load default show option', err);
        return;
      }

      if (showResult != null) {
        const episodeResult = await this.loadDefaultEpisodeOption(showResult.id);
        const newShow = Mappers.showSearchResultToAutocompleteItem(showResult);

        if (episodeResult == null) {
          this.prefill = {
            ...this.prefill,
            show: newShow,
          };
        } else {
          this.prefill = {
            ...this.prefill,
            show: newShow,
            episode: Mappers.episodeSearchResultToAutocompleteItem(episodeResult),
          };
        }
      }
      this.isLoadingDefaultShow = false;
    },
    async loadDefaultEpisodeOption(showId: string): Promise<Api.EpisodeSearchResult | undefined> {
      const episodeName = this.inferredInfo?.name;
      if (episodeName == null) {
        console.debug('Not fetching default episode, name could not be inferred');
        return undefined;
      }

      let episodeResult: Api.EpisodeSearchResult | undefined;
      this.isLoadingDefaultEpisode = true;
      try {
        const searchResults = await Utils.apiAction(
          this.$store,
          global.Api.searchEpisodes,
          episodeName,
          showId
        );

        const results = searchResults.filter(result => result.name === episodeName);
        if (results.length === 1) {
          episodeResult = results[0];
        }
      } catch (err) {
        this.isLoadingDefaultEpisode = false;
        console.warn('Failed to load default episode option', err);
      }

      this.isLoadingDefaultEpisode = false;
      return episodeResult;
    },
    enableCreateNew(prefill: CreateEpisodePrefill): void {
      this.prefill = prefill;
      this.onClickCreateNew();
    },
    onClickFindExisting(): void {
      this.tab = 0;
    },
    onClickCreateNew(): void {
      this.tab = 1;
    },
  },
});
</script>

<style lang="css">
* {
  padding: 0;
  margin: 0;
}

#EditEpisodeDialog .dialog-root-container {
  max-height: 70%;
  width: 480px;
  overflow: visible;
}

.tab {
  @apply mx-2 pt-4 cursor-pointer border-b-2 text-on-surface border-primary border-opacity-0 text-opacity-medium font-bold transition-all;
}

.tab.active {
  @apply text-primary border-opacity-100;
}

.min-h-6 {
  min-height: 6rem; /* 96px */
}
</style>
