import { GqlShow, GqlThirdPartyShow } from '@anime-skip/axios-api';

export type ShowSearchResult = Pick<GqlShow, 'id' | 'name' | 'originalName'>;

export type ThirdPartyShow = Pick<GqlThirdPartyShow, 'name'>;

export type Show = Pick<GqlShow, 'id' | 'name' | 'originalName' | 'website' | 'image'>;
export const SHOW_SEARCH_QUERY = `{
  id name season number absoluteNumber baseDuration
}`;

export const LOAD_DEFAULT_SHOW_OPTION_QUERY = `{}`; // TODO

export const CREATE_SHOW_MUTATION = `{}`; // TODO
