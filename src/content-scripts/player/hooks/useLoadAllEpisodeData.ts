import RequestState from '~/common/utils/RequestState';
import { useEpisodeUrl } from '../state/useEpisodeState';
import {
  useInferredEpisode,
  useUpdateInferredEpisodeState,
} from '../state/useInferredEpisodeState';
import { useClearAllEpisodeState } from './useClearAllEpisodeState';
import { useFetchEpisodeByUrl } from './useFetchEpisodeByUrl';
import { useFetchThirdPartyEpisode } from './useFetchThirdPartyEpisode';
import { useInferEpisodeDetails } from './useInferEpisodeDetails';

export function useLoadAllEpisodeData() {
  const clearAllEpisodeState = useClearAllEpisodeState();
  const updateInferredEpisodeState = useUpdateInferredEpisodeState();
  const fetchEpisodeByUrl = useFetchEpisodeByUrl();
  const inferEpisodeDetails = useInferEpisodeDetails();
  const fetchThirdPartyEpisode = useFetchThirdPartyEpisode();
  const episodeUrl = useEpisodeUrl();
  const inferredEpisode = useInferredEpisode();

  return async (tabUrl: string): Promise<void> => {
    clearAllEpisodeState();
    updateInferredEpisodeState({
      inferredEpisode: undefined,
      requestState: RequestState.NOT_REQUESTED,
    });

    await fetchEpisodeByUrl(tabUrl).catch(() =>
      console.warn('No matching episode url found for ' + tabUrl)
    );
    await inferEpisodeDetails().catch(err => console.warn('Could not infer episode info:', err));

    if (
      episodeUrl.value == null &&
      inferredEpisode.value?.name != null &&
      inferredEpisode.value?.show != null
    ) {
      console.log('Could not load URL, use inferred details to load suggestions');
      void fetchThirdPartyEpisode(inferredEpisode.value.name, inferredEpisode.value.show);
    }
  };
}
