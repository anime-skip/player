import { Ref } from 'vue';
import { useApiClient } from '~/common/hooks/useApiClient';
import * as Api from '~api';
import { AutocompleteItem, TextInputRef } from '~types';
import GeneralUtils from '~utils/GeneralUtils';
import Mappers from '~utils/mappers';

export function useShowAutocomplete(
  defaultShowItem: AutocompleteItem<Api.ShowSearchResult>,
  episodeInputRef: Ref<TextInputRef | undefined>
) {
  const api = useApiClient();
  const showItem = ref(defaultShowItem);
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
    GeneralUtils.setIntervalUntil(
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
