import { RequestState } from 'vue-use-request-state';
import { useEpisode } from '../state/useEpisodeState';
import { useUpdateInferredEpisodeState } from '../state/useInferredEpisodeState';
import { useEpisodeTemplate } from '../state/useTemplateState';
import { useFindTemplate } from './useFindTemplate';

export function useInferEpisodeDetails() {
  const updateInferredEpisodeState = useUpdateInferredEpisodeState();
  const findTemplate = useFindTemplate();
  const episode = useEpisode();
  const template = useEpisodeTemplate();

  return async (): Promise<void> => {
    try {
      updateInferredEpisodeState({ requestState: RequestState.LOADING });
      const episodeInfo = await window.inferEpisodeInfo();
      updateInferredEpisodeState({ inferredEpisode: episodeInfo });
      if (template.value == null) {
        void findTemplate(episodeInfo.show, episodeInfo.season ?? episode.value?.season);
      }
      updateInferredEpisodeState({ requestState: RequestState.SUCCESS });
    } catch (err) {
      console.warn('failed to infer episode details:', err);
      updateInferredEpisodeState({
        requestState: RequestState.FAILURE,
        inferredEpisode: undefined,
      });
    }
  };
}
