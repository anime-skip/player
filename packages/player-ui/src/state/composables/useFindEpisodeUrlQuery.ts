import { Ref } from 'vue';
import { useQuery } from 'vue-query';
import * as Api from '@anime-skip/api-client';
import { useApiClient } from '../../composables/useApiClient';
import { TimestampType, TimestampTypeFragment } from './useAllTimestampTypesQuery';
import { log } from '../../utils/log';

// Timestamp

export const EpisodeUrlEpisodeTimestampFragment = `
  id
  at
  typeId
  source
`;

export interface EpisodeUrlEpisodeTimestamp
  extends Pick<Api.GqlTimestamp, 'id' | 'at' | 'typeId' | 'source'> {
  type: TimestampType;
}

// Show

export const EpisodeUrlEpisodeShowFragment = `
  id
  name
  originalName
  website
  image
`;

export interface EpisodeUrlEpisodeShow
  extends Pick<Api.GqlShow, 'id' | 'name' | 'originalName' | 'website' | 'image'> {}

// Template

export const EpisodeUrlEpisodeTemplateFragment = `
  id
  showId
  sourceEpisodeId
  type
  seasons
`;

export interface EpisodeUrlEpisodeTemplate
  extends Pick<Api.GqlTemplate, 'id' | 'showId' | 'sourceEpisodeId' | 'type' | 'seasons'> {
  timestamps: EpisodeUrlEpisodeTimestamp[];
}

// Episode

export const EpisodeUrlEpisodeFragment = `
  id
  absoluteNumber
  number
  season
  name
  baseDuration
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

export const EpisodeUrlFragment = `
  url
  createdAt
  duration
  timestampsOffset
`;
export interface EpisodeUrl
  extends Pick<Api.GqlEpisodeUrl, 'url' | 'createdAt' | 'duration' | 'timestampsOffset'> {
  episode: EpisodeUrlEpisode;
}

// Query

const query = `
  {
    ${EpisodeUrlFragment}
    episode {
      ${EpisodeUrlEpisodeFragment}
      show {
        ${EpisodeUrlEpisodeShowFragment}
      }
      timestamps {
        ${EpisodeUrlEpisodeTimestampFragment}
        type {
          ${TimestampTypeFragment}
        }
      }
      template {
        ${EpisodeUrlEpisodeTemplateFragment}
        timestamps {
          ${EpisodeUrlEpisodeTimestampFragment}
          type {
            ${TimestampTypeFragment}
          }
        }
      }
    }
  }
`;

export const EPISODE_URL_QUERY_KEY = 'episode-url';

export function useFindEpisodeUrlQuery(url: Ref<string | undefined>) {
  const api = useApiClient();

  return useQuery({
    queryKey: [EPISODE_URL_QUERY_KEY, url],
    enabled: computed(() => !!url.value),
    queryFn() {
      log('Querying episode URL', url.value);
      return api.findEpisodeUrl(query, { episodeUrl: url.value! }) as Promise<EpisodeUrl>;
    },
  });
}
