import Vue from 'vue';
import Mappers from '../utils/Mappers';
import Utils from '../utils/Utils';
import AutocompleteTextInput from '@/common/components/AutocompleteTextInput.vue';

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
        clearInterval(interval);
      }, 100);
      const interval = setInterval(() => {
        if (this.$refs.episode != null) {
          // @ts-expect-error: Can't resolve vue import type
          (this.$refs.episode as AutocompleteTextInput).focus?.();
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
