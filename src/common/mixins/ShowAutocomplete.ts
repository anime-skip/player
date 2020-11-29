import Vue from 'vue';
import Mappers from '../utils/Mappers';
import Utils from '../utils/Utils';

const ShowAutocompleteMixin = Vue.extend({
  data() {
    const show: AutocompleteItem<Api.ShowSearchResult> = {
      title: '',
    };
    const showSearchResults: Api.ShowSearchResult[] = [];
    return {
      show,
      showSearchResults,
    };
  },
  computed: {
    isExistingShow(): boolean {
      return this.show.data != null;
    },
    showOptions(): AutocompleteItem<Api.ShowSearchResult>[] {
      return this.showSearchResults.map(Mappers.showSearchResultToAutocompleteItem);
    },
  },
  methods: {
    onSelectShow(item: AutocompleteItem<Api.ShowSearchResult>): void {
      this.show = item;
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        clearInterval(interval);
      }, 100);
      const interval = setInterval(() => {
        if (this.$refs.episode != null) {
          (this.$refs.episode as HTMLInputElement).focus?.();
          clearTimeout(timeout);
          clearInterval(interval);
        }
      }, 10);
    },
    async searchShows(show: string): Promise<void> {
      this.showSearchResults = await Utils.apiAction(this.$store, global.Api.searchShows, show);
    },
  },
});

export default ShowAutocompleteMixin;
