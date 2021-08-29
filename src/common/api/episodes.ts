import {
  GqlEpisode,
  GqlEpisodeUrl,
  GqlInputEpisode,
  GqlInputEpisodeUrl,
  GqlThirdPartyEpisode,
} from '@anime-skip/axios-api';
import { Show, SHOW_DATA, ThirdPartyShow, THIRD_PARTY_SHOW_DATA } from './shows';
import { Template, TEMPLATE_DATA } from './templates';
import {
  ThirdPartyTimestamp,
  THIRD_PARTY_TIMESTAMP_DATA,
  Timestamp,
  TimestampSource,
  TIMESTAMP_DATA,
} from './timestamps';

// Episode

export interface Episode
  extends Pick<
    GqlEpisode,
    'id' | 'name' | 'season' | 'absoluteNumber' | 'number' | 'baseDuration'
  > {
  show?: Show;
  timestamps: Timestamp[];
  template?: Template;
}
export const EPISODE_DATA = `{
  id absoluteNumber number season name baseDuration
  timestamps ${TIMESTAMP_DATA}
  show ${SHOW_DATA}
  template ${TEMPLATE_DATA}
}`;

// EpisodeUrlNoEpisode

export type EpisodeUrlNoEpisode = Pick<
  GqlEpisodeUrl,
  'url' | 'createdAt' | 'duration' | 'timestampsOffset'
>;
export const EPISODE_URL_NO_EPISODE_DATA = `{
  url
  createdAt
  duration
  timestampsOffset
}`;

// EpisodeUrl

export interface EpisodeUrl
  extends Pick<GqlEpisodeUrl, 'url' | 'createdAt' | 'duration' | 'timestampsOffset'> {
  episode: Episode;
}
export const EPISODE_URL_DATA = `{
  url
  createdAt
  duration
  timestampsOffset
  episode ${EPISODE_DATA}
}`;

// EpisodeSearchResult

export type EpisodeSearchResult = Pick<
  GqlEpisode,
  'id' | 'name' | 'season' | 'absoluteNumber' | 'number' | 'baseDuration'
>;
export const EPISODE_SEARCH_RESULT_DATA = `{
  id name season absoluteNumber number baseDuration
}`;

// ThirdPartyEpisode

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
export type ThirdPartyEpisode = AnimeSkipThirdPartyEpisode | BetterVrvThirdPartyEpisode;
export const THIRD_PARTY_EPISODE_DATA = `{
  id
  name
  season
  number
  absoluteNumber
  source
  baseDuration
  timestamps ${THIRD_PARTY_TIMESTAMP_DATA}
  show ${THIRD_PARTY_SHOW_DATA}
}`;

// Inputs

export type InputEpisodeUrl = GqlInputEpisodeUrl;

export type InputEpisode = GqlInputEpisode;
