import { EpisodeUrlEpisodeTemplate } from '../composables/useFindEpisodeUrlQuery';

/**
 * Returns the template that matches the current episode if it exists
 */
export function useMatchingTemplate() {
  return computed<EpisodeUrlEpisodeTemplate | undefined>(() => undefined);
  // return computed(() => {
  //   if (
  //     episodeState.episode?.id == null ||
  //     episodeState.episode.id !== templateState.episodeTemplate?.sourceEpisodeId
  //   ) {
  //     return undefined;
  //   }
  //   return templateState.episodeTemplate;
  // });
}
