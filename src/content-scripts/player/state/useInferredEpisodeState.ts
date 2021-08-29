import * as Api from '~/common/api';
import { createProvideInject } from '~/common/utils/createProvideInject';
// TODO: Move RequestState imports to library
import RequestState from '~/common/utils/RequestState';

interface InferredEpisodeState {
  requestState: RequestState;
  inferredEpisode?: InferredEpisodeInfo;
  inferredTimestamps?: Api.AmbiguousTimestamp[];
}

const {
  provideValue: provideInferEpisodeState,
  useUpdate: useUpdateInferredEpisodeState,
  useValue: useInferredEpisodeState,
} = createProvideInject<InferredEpisodeState>('inferred-episode-info', {
  requestState: RequestState.NOT_REQUESTED,
  inferredEpisode: undefined,
  inferredTimestamps: undefined,
});

export { provideInferEpisodeState, useUpdateInferredEpisodeState, useInferredEpisodeState };

export function useHasLoadedInferredEpisodeState(inferredState = useInferredEpisodeState()) {
  return computed(
    () =>
      inferredState.requestState !== RequestState.NOT_REQUESTED &&
      inferredState.requestState !== RequestState.LOADING
  );
}

export function useInferredEpisode(inferredState = useInferredEpisodeState()) {
  return computed(() => inferredState.inferredEpisode);
}

export function useUpdateInferredTimestamps() {
  const update = useUpdateInferredEpisodeState();

  return (newInferredTimestamps?: Api.AmbiguousTimestamp[]) => {
    update({ inferredTimestamps: newInferredTimestamps });
  };
}
