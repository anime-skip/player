import { useUpdateEditingState } from '../state/useEditingState';
import { useUpdateEpisodeState } from '../state/useEpisodeState';
import { useUpdateInferredTimestamps } from '../state/useInferredEpisodeState';
import { useUpdateTemplateState } from '../state/useTemplateState';

export function useClearAllEpisodeState() {
  const updateEpisodeState = useUpdateEpisodeState();
  const updateTemplateState = useUpdateTemplateState();
  const updateEditingState = useUpdateEditingState();
  const updateInferredTimestamps = useUpdateInferredTimestamps();

  return () => {
    updateEpisodeState({
      episode: undefined,
      episodeUrl: undefined,
      savedTimestamps: undefined,
    });
    updateInferredTimestamps(undefined);
    updateTemplateState({ episodeTemplate: undefined });
    updateEditingState({ activeTimestamp: undefined, draftTimestamps: undefined });
  };
}
