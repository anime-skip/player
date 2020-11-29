import EpisodeUtils from './EpisodeUtils';
import Utils from './Utils';

export default {
  showSearchResultToAutocompleteItem(
    show: Api.ShowSearchResult
  ): AutocompleteItem<Api.ShowSearchResult> {
    return {
      title: show.name,
      subtitle: show.originalName,
      data: show,
    };
  },
  episodeSearchResultToAutocompleteItem(
    episode: Api.EpisodeSearchResult
  ): AutocompleteItem<Api.EpisodeSearchResult> {
    return {
      title: episode.name || '(No title)',
      subtitle: EpisodeUtils.seasonAndNumberDisplay(episode),
      data: episode,
    };
  },
  thirdPartyEpisodeToAmbiguousTimestamps(episode: Api.ThirdPartyEpisode): Api.AmbigousTimestamp[] {
    return episode.timestamps.map(timestamp => ({
      id: timestamp.id ?? Utils.randomId(),
      source: episode.source ?? 'ANIME_SKIP',
      at: timestamp.at,
      typeId: timestamp.typeId,
    }));
  },
};
