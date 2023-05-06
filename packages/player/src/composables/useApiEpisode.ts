import { EpisodeFragment, ThirdPartyEpisodeFragment } from '../utils/api';
import useFindInferredEpisodeQuery from './useFindInferredEpisodeQuery';
import { ComputedRef } from 'vue';

/**
 * Wrapper around `useFindEpisodeUrlQuery` returning only the `Episode` if it has loaded.
 */
export default function (): ComputedRef<
  EpisodeFragment | ThirdPartyEpisodeFragment | undefined
> {
  const { data: episodeUrl } = useFindEpisodeUrlQuery();
  const { data: inferredEpisode } = useFindInferredEpisodeQuery();

  return computed(() => episodeUrl.value?.episode ?? inferredEpisode.value);
}
