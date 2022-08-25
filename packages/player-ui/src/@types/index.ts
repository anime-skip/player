import * as Api from 'common/src/api';
import { AutocompleteItem } from 'common/src/types';

export interface CreateEpisodePrefill {
  show: AutocompleteItem<Api.ShowSearchResult>;
  episode: AutocompleteItem<Api.EpisodeSearchResult>;
  season?: string;
  number?: string;
  absoluteNumber?: string;
}
