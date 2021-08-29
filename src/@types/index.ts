import * as Api from '~/common/api';

export interface CreateEpisodePrefill {
  show: AutocompleteItem<Api.ShowSearchResult>;
  episode: AutocompleteItem<Api.EpisodeSearchResult>;
  season?: string;
  number?: string;
  absoluteNumber?: string;
}
