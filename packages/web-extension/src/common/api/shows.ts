import { GqlShow, GqlThirdPartyShow } from '@anime-skip/api-client';

// ShowSearchResult

export type ShowSearchResult = Pick<GqlShow, 'id' | 'name' | 'originalName'>;
export const SHOW_SEARCH_RESULT_DATA = `{
  id name originalName
}`;

// ThirdPartyShow

export type ThirdPartyShow = Pick<GqlThirdPartyShow, 'name'>;
export const THIRD_PARTY_SHOW_DATA = `{
  name
}`;

// Show

export type Show = Pick<GqlShow, 'id' | 'name' | 'originalName' | 'website' | 'image'>;
export const SHOW_DATA = `{
  id name originalName website image
}`;
