import type * as Api from '../api';
import { AutocompleteItem } from '../types';
import EpisodeUtils from './episode-utils';
import GeneralUtils from './GeneralUtils';

// TODO: export individually

export default {
  showSearchResultToAutocompleteItem(
    show: Api.ShowSearchResult
  ): AutocompleteItem<Api.ShowSearchResult> {
    return {
      key: show.id,
      title: show.name,
      subtitle: show.originalName,
      data: show,
    };
  },
  episodeSearchResultToAutocompleteItem(
    episode: Api.EpisodeSearchResult
  ): AutocompleteItem<Api.EpisodeSearchResult> {
    return {
      key: episode.id,
      title: episode.name || '(No title)',
      subtitle: EpisodeUtils.seasonAndNumberDisplay(episode),
      data: episode,
    };
  },
  thirdPartyEpisodeToAmbiguousTimestamps(episode: Api.ThirdPartyEpisode): Api.AmbiguousTimestamp[] {
    return episode.timestamps.map(timestamp => ({
      id: timestamp.id ?? GeneralUtils.randomId(),
      source: episode.source ?? 'ANIME_SKIP',
      at: timestamp.at,
      typeId: timestamp.typeId,
    }));
  },
};
