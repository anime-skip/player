import {
  GqlEpisode,
  GqlEpisodeUrl,
  GqlInputEpisode,
  GqlInputEpisodeUrl,
  GqlThirdPartyEpisode,
} from '@anime-skip/axios-api';
import { Show, ThirdPartyShow } from './shows';
import { Template } from './templates';
import { ThirdPartyTimestamp, Timestamp, TimestampSource } from './timestamps';

export interface Episode
  extends Pick<
    GqlEpisode,
    'id' | 'name' | 'season' | 'absoluteNumber' | 'number' | 'baseDuration'
  > {
  show?: Show;
  timestamps: Timestamp[];
  template?: Template;
}

export interface EpisodeUrl
  extends Pick<GqlEpisodeUrl, 'url' | 'createdAt' | 'duration' | 'timestampsOffset'> {
  episode: Episode;
}

export type EpisodeUrlNoEpisode = Pick<
  GqlEpisodeUrl,
  'url' | 'createdAt' | 'duration' | 'timestampsOffset'
>;

export type EpisodeSearchResult = Pick<
  GqlEpisode,
  'id' | 'name' | 'season' | 'absoluteNumber' | 'number' | 'baseDuration'
>;
export const EPISODE_SEARCH_QUERY = `{
  id name season number absoluteNumber baseDuration
}`;

interface AnimeSkipThirdPartyEpisode
  extends Pick<
    GqlThirdPartyEpisode,
    'season' | 'number' | 'absoluteNumber' | 'name' | 'baseDuration'
  > {
  id: string;
  source: TimestampSource.ANIME_SKIP;
  timestamps: ThirdPartyTimestamp[];
  show: ThirdPartyShow;
}

interface BetterVrvThirdPartyEpisode
  extends Pick<
    GqlThirdPartyEpisode,
    'id' | 'season' | 'number' | 'absoluteNumber' | 'name' | 'baseDuration'
  > {
  source: TimestampSource.BETTER_VRV;
  timestamps: ThirdPartyTimestamp[];
  show: ThirdPartyShow;
}

export type InputEpisodeUrl = GqlInputEpisodeUrl;

export type InputEpisode = GqlInputEpisode;

export type ThirdPartyEpisode = AnimeSkipThirdPartyEpisode | BetterVrvThirdPartyEpisode;

export const FETCH_EPISODE_BY_NAME_QUERY = `{}`; // TODO

export const FIND_INFERRED_EPISODE_QUERY = `{}`; // TODO

export const FIND_EPISODE_BY_URL_QUERY = `{}`; // TODO

export const DELETE_EPISODE_URL_MUTATION = `{}`; // TODO

export const CREATE_EPISODE_URL_MUTATION = `{}`; // TODO

export const CREATE_EPISODE_MUTATION = `{}`; // TODO

export const FETCH_EPISODE_BY_EPISODE_AND_SHOW_NAME_QUERY = `{}`; // TODO
