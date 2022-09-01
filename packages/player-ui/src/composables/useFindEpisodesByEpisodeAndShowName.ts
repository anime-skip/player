import { Ref } from 'vue';
import { useQuery } from 'vue-query';
import { useApiClient } from '../composables/useApiClient';
import { TimestampTypeFragment, TimestampType } from './useAllTimestampTypesQuery';
import * as Api from '@anime-skip/api-client';
import { EpisodeUrlEpisodeTimestampFragment } from './useFindEpisodeUrlQuery';

// ThirdPartyEpisodeTimestamp

export const ThirdPartyEpisodeTimestampFragment = `
  id
  at
`;

export interface ThirdPartyEpisodeTimestamp extends Pick<Api.GqlThirdPartyTimestamp, 'id' | 'at'> {
  type: TimestampType;
}

// ThirdPartyEpisodeShow

export const ThirdPartyEpisodeShowFragment = `
  name
`;

export interface ThirdPartyEpisodeShow extends Pick<Api.GqlThirdPartyShow, 'name'> {}

// ThirdPartyEpisode

const ThirdPartyEpisodeFragment = `
  id
  name
  season
  number
  absoluteNumber
  source
  baseDuration
`;

export interface ThirdPartyEpisode
  extends Pick<
    Api.GqlThirdPartyEpisode,
    'id' | 'name' | 'season' | 'number' | 'absoluteNumber' | 'source' | 'baseDuration'
  > {
  timestamps: ThirdPartyEpisodeTimestamp[];
}

// Query

const query = `
  {
    ${ThirdPartyEpisodeFragment}
    timestamps {
      ${EpisodeUrlEpisodeTimestampFragment}
      type {
        ${TimestampTypeFragment}
      }
    }
    show {
      ${ThirdPartyEpisodeShowFragment}
    }
  }
`;

export const FIND_EPISODES_BY_EPISODE_AND_SHOW_NAME_QUERY_KEY =
  'find-episodes-by-episode-and-show-name';

export function useFindEpisodesByEpisodeAndShowName(
  details: Ref<{ episodeName: string; showName: string } | undefined>
) {
  const api = useApiClient();

  return useQuery({
    queryKey: [FIND_EPISODES_BY_EPISODE_AND_SHOW_NAME_QUERY_KEY, details],
    enabled: computed(() => !!details.value),
    queryFn() {
      // @ts-expect-error: This should be fine???
      return api.findEpisodesByEpisodeAndShowName(query, details.value!) as Promise<
        ThirdPartyEpisode[]
      >;
    },
  });
}
