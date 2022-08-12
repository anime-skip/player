import { useEpisodeState } from '~/stores/useEpisodeState';
import { useTemplateState } from '~/stores/useTemplateState';

/**
 * Returns the template that matches the current episode if it exists
 */
export function useMatchingTemplate(
  templateState = useTemplateState(),
  episodeState = useEpisodeState()
) {
  return computed(() => {
    if (
      episodeState.episode?.id == null ||
      episodeState.episode.id !== templateState.episodeTemplate?.sourceEpisodeId
    ) {
      return undefined;
    }
    return templateState.episodeTemplate;
  });
}
