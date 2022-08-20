import { RequestState } from 'vue-use-request-state';
import * as Api from 'common/src/api';
import { createProvideInject } from 'common/src/utils/createProvideInject';
import GeneralUtils from 'common/src/utils/GeneralUtils';
import { useInferredEpisodeState } from './useInferredEpisodeState';
import { useTemplateTimestamps } from './useTemplateState';
import { useDuration } from './useVideoState';

export interface EpisodeState {
  savedTimestamps: Api.Timestamp[];
  episode?: Api.ThirdPartyEpisode | Omit<Api.Episode, 'timestamps' | 'template'>;
  episodeUrl?: Omit<Api.EpisodeUrl, 'episode'>;
  episodeRequestState: RequestState;
}

const {
  provideValue: provideEpisodeState,
  useValue: useEpisodeState,
  useUpdate: useUpdateEpisodeState,
} = createProvideInject<EpisodeState>('episode-state', {
  savedTimestamps: [],
  episode: undefined,
  episodeUrl: undefined,
  episodeRequestState: RequestState.NOT_REQUESTED,
});

export { provideEpisodeState, useEpisodeState, useUpdateEpisodeState };

export function useEpisode(episodeState = useEpisodeState()) {
  return computed(() => episodeState.episode);
}

export function useEpisodeUrl(episodeState = useEpisodeState()) {
  return computed(() => episodeState.episodeUrl);
}

/**
 * Returns the saved remote timestamps, inferred episode timestamps, or template timestamps
 */
export function useUneditedTimestamps() {
  const episodeState = useEpisodeState();
  const duration = useDuration();
  const templateTimestamps = useTemplateTimestamps();
  const inferredEpisodeState = useInferredEpisodeState();

  function getBaseTimestamps(): Api.AmbiguousTimestamp[] {
    if (episodeState.savedTimestamps.length > 0) return episodeState.savedTimestamps;
    if (
      inferredEpisodeState.inferredTimestamps != null &&
      inferredEpisodeState.inferredTimestamps.length > 0
    ) {
      return inferredEpisodeState.inferredTimestamps;
    }

    return templateTimestamps.value ?? [];
  }

  return computed<Api.AmbiguousTimestamp[]>(() => {
    // Find the offset
    let timestampsOffset = episodeState.episodeUrl?.timestampsOffset;
    if (
      timestampsOffset == null &&
      episodeState.episode?.baseDuration != null &&
      duration.value != null
    ) {
      timestampsOffset = GeneralUtils.computeTimestampsOffset(
        episodeState.episode.baseDuration,
        duration.value
      );
    }

    // Apply the offset
    const baseTimestamps = getBaseTimestamps();
    const properlyOffsetTimestamps = baseTimestamps.map(timestamp => {
      const at = GeneralUtils.applyTimestampsOffset(timestampsOffset, timestamp.at);
      return {
        ...timestamp,
        at,
      };
    });

    // Remove out of bounds timestamps
    if (duration.value == null) return properlyOffsetTimestamps;
    return properlyOffsetTimestamps.filter(
      timestamp => timestamp.at <= duration.value && timestamp.at >= 0
    );
  });
}

export function useEpisodeRequestState() {
  const value = useEpisodeState();
  return computed(() => value.episodeRequestState);
}

export function useUpdateEpisodeRequestState() {
  const update = useUpdateEpisodeState();
  return (newRequestState: RequestState) => {
    update({ episodeRequestState: newRequestState });
  };
}
