import { Ref } from 'vue';
import { useApiClient } from '../composables/useApiClient';
import * as Api from 'common/src/api';
import { EPISODE_SEARCH_RESULT_DATA } from 'common/src/api';
import { AutocompleteItem } from 'common/src/types';
import * as Mappers from 'common/src/utils/mappers';

export function useEpisodeAutocomplete(
  defaultEpisodeItem: AutocompleteItem<Api.EpisodeSearchResult>,
  show: Ref<Api.Show | undefined>
) {
  const api = useApiClient();
  const episodeItem = ref<AutocompleteItem<Api.EpisodeSearchResult>>(defaultEpisodeItem);
  const episode = computed(() => episodeItem.value.data);
  const isExistingEpisode = computed(() => episode.value != null);

  const episodeSearchResults = ref<Api.EpisodeSearchResult[]>([]);
  const episodeOptions = computed(() =>
    episodeSearchResults.value.map(Mappers.episodeSearchResultToAutocompleteItem)
  );

  const searchEpisodes = async (search: string): Promise<void> => {
    episodeSearchResults.value = await api.searchEpisodes(EPISODE_SEARCH_RESULT_DATA, {
      limit: 5,
      search,
      showId: show.value?.id,
    });
  };

  return {
    episodeItem,
    episode,
    isExistingEpisode,
    episodeSearchResults,
    episodeOptions,
    searchEpisodes,
  };
}
