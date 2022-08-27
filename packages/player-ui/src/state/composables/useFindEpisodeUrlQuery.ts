import { Ref } from 'vue';
import { useQuery } from 'vue-query';
import { gql } from '../../utils/gql';
import * as Api from '@anime-skip/api-client';
import { useApiClient } from '../../composables/useApiClient';
import { TimestampType, TimestampTypeFragment } from './useAllTimestampTypesQuery';

// Timestamp

export const EpisodeUrlEpisodeTimestampFragment = gql`
  fragment EpisodeUrlEpisodeTimestamp on Timestamp {
    id
    at
    typeId
    source
  }
`;

export interface EpisodeUrlEpisodeTimestamp
  extends Pick<Api.GqlTimestamp, 'id' | 'at' | 'typeId' | 'source'> {
  type: TimestampType;
}

// Show

export const EpisodeUrlEpisodeShowFragment = gql`
  fragment EpisodeUrlEpisodeShow on Show {
    id
    name
    originalName
    website
    image
  }
`;

export interface EpisodeUrlEpisodeShow
  extends Pick<Api.GqlShow, 'id' | 'name' | 'originalName' | 'website' | 'image'> {}

// Template

export const EpisodeUrlEpisodeTemplateFragment = gql`
  fragment EpisodeUrlEpisodeTemplate on Template {
    id
    showId
    sourceEpisodeId
    type
    seasons
  }
`;

export interface EpisodeUrlEpisodeTemplate
  extends Pick<Api.GqlTemplate, 'id' | 'showId' | 'sourceEpisodeId' | 'type' | 'seasons'> {
  timestamps: EpisodeUrlEpisodeTimestamp[];
}

// Episode

export const EpisodeUrlEpisodeFragment = gql`
  fragment EpisodeUrlEpisode on Episode {
    id
    absoluteNumber
    number
    season
    name
    baseDuration
  }
`;

export interface EpisodeUrlEpisode
  extends Pick<
    Api.GqlEpisode,
    'id' | 'absoluteNumber' | 'number' | 'season' | 'name' | 'baseDuration'
  > {
  show?: EpisodeUrlEpisodeShow;
  template?: EpisodeUrlEpisodeTemplate;
  timestamps: EpisodeUrlEpisodeTimestamp[];
}

// EpisodeUrl

export const EpisodeUrlFragment = gql`
  fragment EpisodeUrlFragment on EpisodeUrl {
    url
    createdAt
    duration
    timestampsOffset
  }
`;
export interface EpisodeUrl
  extends Pick<Api.GqlEpisodeUrl, 'url' | 'createdAt' | 'duration' | 'timestampsOffset'> {
  episode: EpisodeUrlEpisode;
}

// Query

const query = gql`
  {
    ...EpisodeUrlFragment
    episode {
      ...EpisodeUrlEpisodeFragment
      show {
        ...EpisodeUrlEpisodeShowFragment
      }
      timestamps {
        ...EpisodeUrlEpisodeTimestampFragment
        type {
          ...TimestampTypeFragment
        }
      }
      template {
        ...EpisodeUrlEpisodeTemplateFragment
        timestamps {
          ...EpisodeUrlEpisodeTimestampFragment
          type {
            ...EpisodeUrlEpisodeTimestampTypeFragment
          }
        }
      }
    }
  }

  ${EpisodeUrlFragment}
  ${EpisodeUrlEpisodeFragment}
  ${EpisodeUrlEpisodeShowFragment}
  ${EpisodeUrlEpisodeTimestampFragment}
  ${TimestampTypeFragment}
  ${EpisodeUrlEpisodeTemplateFragment}
`;

export const EPISODE_URL_QUERY_KEY = 'episode-url';

export function useFindEpisodeUrlQuery(url: Ref<string | undefined>) {
  const api = useApiClient();

  return useQuery({
    queryKey: [EPISODE_URL_QUERY_KEY, url],
    enabled: computed(() => !!url.value),
    queryFn() {
      return api.findEpisodeUrl(query, { episodeUrl: url.value! }) as Promise<EpisodeUrl>;
    },
  });
}
