import { RequestState } from 'vue-use-request-state';
import { usePlayerConfig } from '../composables/usePlayerConfig';
import { useEpisode } from '../stores/useEpisodeState';
import { useUpdateInferredEpisodeState } from '../stores/useInferredEpisodeState';
import { useEpisodeTemplate } from '../stores/useTemplateState';
import { warn } from '../utils/log';
import { useFindTemplate } from './useFindTemplate';

export function useInferEpisodeDetails() {
  const updateInferredEpisodeState = useUpdateInferredEpisodeState();
  const findTemplate = useFindTemplate();
  const episode = useEpisode();
  const template = useEpisodeTemplate();
  const { inferEpisodeInfo } = usePlayerConfig();

  return async (): Promise<void> => {
    try {
      updateInferredEpisodeState({ requestState: RequestState.LOADING });
      const episodeInfo = await inferEpisodeInfo();
      updateInferredEpisodeState({ inferredEpisode: episodeInfo });
      if (template.value == null) {
        void findTemplate(episodeInfo.show, episodeInfo.season ?? episode.value?.season);
      }
      updateInferredEpisodeState({ requestState: RequestState.SUCCESS });
    } catch (err) {
      warn('failed to infer episode details:', err);
      updateInferredEpisodeState({
        requestState: RequestState.FAILURE,
        inferredEpisode: undefined,
      });
    }
  };
}
