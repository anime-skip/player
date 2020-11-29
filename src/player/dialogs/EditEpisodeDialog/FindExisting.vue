<template>
  <form class="FindExisting">
    <div v-if="hasSuggestions" class="suggestions">
      <p class="header horizontal-margin">{{ suggestionsHeader }}</p>
      <div class="list-row">
        <div class="suggestion-list">
          <div
            v-for="suggestion of suggestionListItems"
            :key="suggestion.index"
            class="suggestion-spacing"
          >
            <div
              class="suggestion button clickable dark noselect"
              @click="onClickSuggestion(suggestion.value)"
            >
              <p class="show">{{ suggestion.show }}</p>
              <p class="episode">{{ suggestion.episode }}</p>
              <p class="subtitle">{{ suggestion.subtitle }}</p>
              <p class="subtitle">
                {{ suggestion.timestamps }}
                <span v-if="suggestion.source != null" class="source"
                  >({{ suggestion.source }})</span
                >
              </p>
            </div>
          </div>
        </div>
        <div class="gradient-borders" />
      </div>
      <p class="header horizontal-margin">Manual Search</p>
    </div>
    <AutocompleteTextInput
      class="horizontal-margin"
      label="Enter the show name..."
      v-model="show"
      :options="showOptions"
      @select="onSelectShow"
      @search="searchShows"
    />
    <AutocompleteTextInput
      v-if="isExistingShow"
      ref="episode"
      class="row horizontal-margin"
      label="Enter the episode name..."
      v-model="episode"
      :options="episodeOptions"
      @select="onSelectEpisode"
      @search="searchEpisodes"
    />
    <div class="buttons row horizontal-margin">
      <button
        v-if="shouldCreateNew"
        class="button clickable"
        @click.stop.prevent="onClickCreateNew"
      >
        Create New
      </button>
      <button
        v-else
        class="button clickable"
        :class="{ disabled: isSaveDisabled }"
        :disabled="isSaveDisabled"
        @click.stop.prevent="onClickSave"
      >
        Save Episode
      </button>
      <button class="button clickable dark" @click.stop.prevent="hideDialog">Cancel</button>
    </div>
  </form>
</template>

<script lang="ts">
import { PropOptions } from 'vue';
import AutocompleteTextInput from '@/common/components/AutocompleteTextInput.vue';
import WebExtImg from '@/common/components/WebExtImg.vue';
import actionTypes from '@/common/store/actionTypes';
import EpisodeUtils from '@/common/utils/EpisodeUtils';
import { TIMESTAMP_SOURCES } from '@/common/utils/Constants';
import ShowAutocompleteMixin from '@/common/mixins/ShowAutocomplete';
import EpisodeAutocompleteMixin from '@/common/mixins/EpisodeAutocomplete';
import vueMixins from 'vue-typed-mixins'; // TODO: Remove lib once migrated to vue3

export default vueMixins(ShowAutocompleteMixin, EpisodeAutocompleteMixin).extend({
  components: { AutocompleteTextInput, WebExtImg },
  props: {
    suggestions: Array as PropOptions<Api.ThirdPartyEpisode[]>,
    prefill: { type: Object, required: false } as PropOptions<CreateEpisodePrefill | undefined>,
  },
  data() {
    return {
      show: this.prefill?.show || {
        title: '',
      },
      episode: this.prefill?.episode || {
        title: '',
      },
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
  methods: {
    hideDialog(): void {
      this.$store.dispatch(actionTypes.showDialog, undefined);
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
        await this.$store.dispatch(actionTypes.linkEpisodeUrl, {
          episode,
          onSuccess: this.hideDialog,
        });
      } catch (err) {
        // do nothing
      }
    },
    async createFromThirdParty(thirdPartyEpisode: Api.ThirdPartyEpisode) {
      await this.$store.dispatch(actionTypes.createEpisodeFromThirdParty, {
        thirdPartyEpisode,
        onSuccess: this.hideDialog,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.FindExisting {
  padding: 16px 0;
  display: flex;
  flex-direction: column;

  .header {
    margin-bottom: 8px;
    color: $textPrimary;
  }

  .horizontal-margin {
    margin-left: 16px;
    margin-right: 16px;
  }

  .row {
    margin-top: 12px;
  }

  .suggestions {
    .list-row {
      position: relative;
      .gradient-borders {
        pointer-events: none;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        &:before {
          content: '';
          position: absolute;
          left: 0;
          width: 16px;
          top: 0;
          bottom: 12px;
          background: rgb(0, 0, 0);
          background: linear-gradient(
            90deg,
            rgba($color: $background500, $alpha: 1) 25%,
            rgba($color: $background500, $alpha: 0) 100%
          );
        }
        &:after {
          content: '';
          position: absolute;
          right: 0;
          width: 16px;
          top: 0;
          bottom: 12px;
          background: rgb(0, 0, 0);
          background: linear-gradient(
            270deg,
            rgba($color: $background500, $alpha: 1) 25%,
            rgba($color: $background500, $alpha: 0) 100%
          );
        }
      }
    }

    .suggestion-list {
      display: flex;
      flex-direction: row;
      box-sizing: border-box;
      margin-bottom: 16px;
      overflow-x: auto;

      .suggestion-spacing {
        padding-left: 8px;
        padding-bottom: 8px;

        &:first-child {
          padding-left: 16px;
        }
        &:last-child {
          padding-right: 16px;
        }
      }

      .suggestion {
        display: inline-block;
        height: unset;
        max-width: 256px;
        text-transform: none;
        text-align: start;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        padding: 8px 16px;
        & > * {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .show {
          font-family: sans-serif;
          color: $primary300;
          margin-bottom: 2px;
        }
        .episode {
          font-family: sans-serif;
          font-size: 18px;
          color: white;
          font-weight: 400;
        }
        .subtitle {
          color: $textPrimary;
          font-weight: 400;
        }
        .source {
          color: $textSecondary;
        }
      }
    }
  }

  .buttons {
    display: flex;
    flex-direction: row-reverse;

    button {
      margin-left: 16px;
    }
  }
}
</style>
