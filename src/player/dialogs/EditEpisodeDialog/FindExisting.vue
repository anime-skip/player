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
      <p class="caption mb-2 mx-4 text-on-surface text-opacity-medium">Manual Search</p>
      <AutocompleteTextInput
        class="mx-4"
        placeholder="Enter the show name..."
        v-model:value="show"
        :options="showOptions"
        @select="onSelectShow"
        @search="searchShows"
      />
      <AutocompleteTextInput
        v-if="isExistingShow"
        ref="episode"
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

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import AutocompleteTextInput from '@/common/components/AutocompleteTextInput.vue';
import { ActionTypes } from '@/common/store/actionTypes';
import EpisodeUtils from '@/common/utils/EpisodeUtils';
import { TIMESTAMP_SOURCES } from '@/common/utils/Constants';
import ShowAutocompleteMixin from '@/common/mixins/ShowAutocomplete';
import EpisodeAutocompleteMixin from '@/common/mixins/EpisodeAutocomplete';

export default defineComponent({
  components: { AutocompleteTextInput },
  mixins: [ShowAutocompleteMixin, EpisodeAutocompleteMixin],
  props: {
    suggestions: {
      type: Array as PropType<Api.ThirdPartyEpisode[]>,
      required: true,
    },
    prefill: Object as PropType<CreateEpisodePrefill | undefined>,
  },
  emits: ['createNew'],
  data() {
    return {
      show: this.prefill?.show || {
        title: '',
      },
      episode: this.prefill?.episode || {
        title: '',
      },
      isShowingSuggestions: this.suggestions.length > 0,
    };
  },
  computed: {
    suggestionsHeader(): string {
      const count = this.suggestionListItems.length;
      if (count === 1) {
        return '1 Suggestion';
      }
      return `${count} Suggestions`;
    },
    suggestionListItems(): Array<{
      index: number;
      show: string;
      episode: string;
      subtitle: string;
      timestamps: string;
      source: string | null | undefined;
      value: Api.ThirdPartyEpisode;
    }> {
      return this.suggestions.map((suggestion, index) => {
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
    },
    shouldCreateNew(): boolean {
      if (!this.isExistingShow) {
        return this.show.title !== '' && this.show.data == null;
      }
      return this.episode.title !== '' && this.episode.data == null;
    },
    isSaveDisabled(): boolean {
      return this.show.data == null || this.episode.data == null;
    },
    hasSuggestions(): boolean {
      return !!this.suggestions?.length;
    },
  },
  watch: {
    suggestions() {
      this.isShowingSuggestions = this.suggestions.length > 0;
    },
  },
  methods: {
    hideDialog(): void {
      this.$store.dispatch(ActionTypes.SHOW_DIALOG, undefined);
    },
    onClickSuggestion(suggestion: Api.ThirdPartyEpisode): void {
      if (suggestion.source !== 'ANIME_SKIP') {
        this.createFromThirdParty(suggestion);
      } else {
        this.linkToExistingEpisode(suggestion);
      }
    },
    onClickCreateNew(): void {
      const prefill: CreateEpisodePrefill = {
        show: this.show,
        episode: this.episode,
        season: this.prefill?.season,
        number: this.prefill?.number,
        absoluteNumber: this.prefill?.absoluteNumber,
      };
      this.$emit('createNew', prefill);
    },
    toggleSuggestions(isShowingSuggestions: boolean): void {
      this.isShowingSuggestions = isShowingSuggestions;
    },
    onClickSave(): void {
      const show = this.show.data;
      const episode = this.episode.data;
      if (show == null || episode == null) {
        console.error('Failed to save, show or episode were not selected', {
          show: this.show.data,
          episode: this.episode.data,
        });
        return;
      }

      this.linkToExistingEpisode(episode);
    },
    async linkToExistingEpisode(episode: Api.EpisodeSearchResult): Promise<void> {
      try {
        await this.$store.dispatch(ActionTypes.LINK_EPISODE_URL, {
          episode,
          onSuccess: this.hideDialog,
        });
      } catch (err) {
        // do nothing
      }
    },
    async createFromThirdParty(thirdPartyEpisode: Api.ThirdPartyEpisode) {
      await this.$store.dispatch(ActionTypes.CREATE_EPISODE_FROM_THIRD_PARTY, {
        thirdPartyEpisode,
        onSuccess: this.hideDialog,
      });
    },
  },
});
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
