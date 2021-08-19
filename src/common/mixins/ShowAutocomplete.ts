import { defineComponent } from 'vue';
import Mappers from '../utils/Mappers';
import Utils from '../utils/Utils';

const ShowAutocompleteMixin = defineComponent({
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
    onSelectShow(): void {
      Utils.setIntervalUntil(
        () => {
          const focus = (this.$refs.episode as TextInputRef | undefined)?.focus;
          focus?.();
          return focus != null;
        },
        10,
        100
      );
    },
    async searchShows(show: string): Promise<void> {
      this.showSearchResults = await Utils.apiAction(this.$store, window.Api.searchShows, show);
    },
  },
});

export default ShowAutocompleteMixin;
