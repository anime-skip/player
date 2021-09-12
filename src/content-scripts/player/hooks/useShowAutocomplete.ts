import { Ref } from 'vue';
import { useApiClient } from '~/common/hooks/useApiClient';
import Mappers from '~/common/utils/Mappers';
import Utils from '~/common/utils/Utils';
import * as Api from '~api';

export function useShowAutocomplete(
  episodeInputRef: Ref<TextInputRef | undefined>,
  api = useApiClient()
) {
  const showItem = ref<AutocompleteItem<Api.ShowSearchResult>>({
    title: '',
  });
  const show = computed(() => showItem.value.data);
  const isExistingShow = computed(() => show.value != null);

  const showSearchResults = ref<Api.ShowSearchResult[]>([]);
  const showOptions = computed(() =>
    showSearchResults.value.map(Mappers.showSearchResultToAutocompleteItem)
  );

  const searchShows = async (search: string): Promise<void> => {
    showSearchResults.value = await api.searchShows(Api.SHOW_SEARCH_RESULT_DATA, {
      limit: 5,
      search,
    });
  };
  const onSelectShow = (): void => {
    Utils.setIntervalUntil(
      () => {
        const focus = episodeInputRef.value?.focus;
        focus?.();
        return focus != null;
      },
      10,
      100
    );
  };

  return {
    showItem,
    show,
    isExistingShow,
    showSearchResults,
    showOptions,
    searchShows,
    onSelectShow,
  };
}
