import { RequestState } from 'vue-use-request-state';
import * as Api from '~/common/api';
import { createProvideInject } from '~/common/utils/createProvideInject';

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

export function useInferredEpisode() {
  const value = useInferredEpisodeState();
  return computed(() => value.inferredEpisode);
}

export function useUpdateInferredTimestamps() {
  const update = useUpdateInferredEpisodeState();

  return (newInferredTimestamps?: Api.AmbiguousTimestamp[]) => {
    update({ inferredTimestamps: newInferredTimestamps });
  };
}

export function useInferRequestState() {
  const value = useInferredEpisodeState();
  watch(
    () => value,
    () => {
      console.log('is showing changed 2', value);
    }
  );
  return computed(() => value.requestState);
}
