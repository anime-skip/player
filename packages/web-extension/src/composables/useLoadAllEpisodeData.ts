import { RequestState } from 'vue-use-request-state';
import { useEpisodeUrl } from '~/stores/useEpisodeState';
import {
  useInferredEpisode,
  useUpdateInferredEpisodeState,
} from '~/stores/useInferredEpisodeState';
import { log, warn } from '~/utils/log';
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
      warn('No matching episode url found for ' + tabUrl)
    );
    await inferEpisodeDetails().catch(err => warn('Could not infer episode info:', err));

    if (
      episodeUrl.value == null &&
      inferredEpisode.value?.name != null &&
      inferredEpisode.value?.show != null
    ) {
      log('Could not load URL, use inferred details to load suggestions');
      void fetchThirdPartyEpisode(inferredEpisode.value.name, inferredEpisode.value.show);
    }
  };
}
