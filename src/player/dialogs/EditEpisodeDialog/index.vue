<template>
  <BasicDialog name="EditEpisodeDialog" gravityX="center" gravityY="center" @show="onShow">
    <ProgressOverlay :isLoading="isLoading">
      <div class="header">
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
    </ProgressOverlay>
  </BasicDialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ProgressOverlay from '@/common/components/ProgressOverlay.vue';
import BasicDialog from '../BasicDialog.vue';
import FindExisting from './FindExisting.vue';
import CreateNew from './CreateNew.vue';
import Utils from '@/common/utils/Utils';
import RequestState from '@/common/utils/RequestState';
import Mappers from '@/common/utils/Mappers';

export default defineComponent({
  components: { ProgressOverlay, BasicDialog, FindExisting, CreateNew },
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
    };
  },
  computed: {
    inferredInfo(): InferredEpisodeInfo | undefined {
      return this.$store.state.inferredEpisodeInfo;
    },
    isLoading(): boolean {
      return (
        this.$store.state.episodeRequestState === RequestState.LOADING ||
        this.isLoadingSuggestions ||
        this.isLoadingDefaultShow ||
        this.isLoadingDefaultEpisode
      );
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

      this.loadSuggestions();
      this.loadDefaultShowOption();
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

<style lang="scss">
$width: 450px;

* {
  padding: 0;
  margin: 0;
}

#EditEpisodeDialog {
  .dialog-root-container {
    overflow-y: auto;
    max-height: 70%;
    width: $width;
    overflow-y: visible;
  }
}

.ProgressOverlay {
  min-height: 172px;
}

.header {
  display: flex;
  flex-direction: row;
  margin: 0 8px;

  .tab {
    margin: 0 8px;
    height: 24px;
    padding-top: 16px;
    cursor: pointer;
    color: $textSecondary;

    &.active {
      color: $textPrimary;
      border-bottom: 2px solid $primary300;
    }
  }
}
</style>
