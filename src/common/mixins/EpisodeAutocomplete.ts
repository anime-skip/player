import { defineComponent } from 'vue';
import Mappers from '../utils/Mappers';
import Utils from '../utils/Utils';

const EpisodeAutocompleteMixin = defineComponent({
  data() {
    const episode: AutocompleteItem<Api.EpisodeSearchResult> = {
      title: '',
    };
    const episodeSearchResults: Api.EpisodeSearchResult[] = [];
    return {
      episode,
      episodeSearchResults,
    };
  },
  computed: {
    isExistingEpisode(): boolean {
      return this.episode.data != null;
    },
    episodeOptions(): AutocompleteItem<Api.EpisodeSearchResult>[] {
      return this.episodeSearchResults.map(Mappers.episodeSearchResultToAutocompleteItem);
    },
  },
  methods: {
    async searchEpisodes(episode: string): Promise<void> {
      this.episodeSearchResults = await Utils.apiAction(
        this.$store,
        window.Api.searchEpisodes,
        episode,
        // @ts-expect-error: Show is not defined in the mixin, but if it's available, use it
        this.show?.data?.id
      );
    },
  },
});

export default EpisodeAutocompleteMixin;
