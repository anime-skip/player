import { useUpdateEditingState } from '../stores/useEditingState';
import { useUpdateEpisodeState } from '../stores/useEpisodeState';
import { useUpdateInferredTimestamps } from '../stores/useInferredEpisodeState';
import { useUpdateTemplateState } from '../stores/useTemplateState';

export function useClearAllEpisodeState() {
  const updateEpisodeState = useUpdateEpisodeState();
  const updateTemplateState = useUpdateTemplateState();
  const updateEditingState = useUpdateEditingState();
  const updateInferredTimestamps = useUpdateInferredTimestamps();

  return () => {
    updateEpisodeState({
      episode: undefined,
      episodeUrl: undefined,
      savedTimestamps: [],
    });
    updateInferredTimestamps(undefined);
    updateTemplateState({ episodeTemplate: undefined });
    updateEditingState({ activeTimestamp: undefined, draftTimestamps: undefined });
  };
}
