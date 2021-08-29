import * as Api from '~/common/api';
import { useApiClient } from '~/common/hooks/useApiClient';
import RequestState from '~/common/utils/RequestState';
import { useHideDialog } from '../state/useDialogState';
import { useEpisodeUrl, useUpdateEpisodeRequestState } from '../state/useEpisodeState';
import { useFetchEpisodeByUrl } from './useFetchEpisodeByUrl';

export interface CreateEpisodeDataPayload {
  show:
    | {
        create: false;
        showId: string;
      }
    | {
        create: true;
        name: string;
      };
  episode:
    | {
        create: false;
        episodeId: string;
      }
    | {
        create: true;
        data: Api.InputEpisode;
      };
  episodeUrl:
    | {
        create: false;
        url: string;
      }
    | {
        create: true;
        data: Api.InputEpisodeUrl;
      };
}

export function useCreateEpisodeData() {
  const hideDialog = useHideDialog();
  const updateEpisodeRequestState = useUpdateEpisodeRequestState();
  const fetchEpisodeByUrl = useFetchEpisodeByUrl();
  const episodeUrlRef = useEpisodeUrl();
  const api = useApiClient();

  return async ({
    show: showData,
    episode: episodeData,
    episodeUrl: episodeUrlData,
  }: CreateEpisodeDataPayload): Promise<void> => {
    try {
      // Setup
      hideDialog();
      updateEpisodeRequestState(RequestState.LOADING);

      // Show
      let showId: string;
      if (showData.create) {
        // TODO: allow custom type argument to specify return type
        const result = await api.createShow(Api.CREATE_SHOW_MUTATION, {
          showInput: { name: showData.name },
          becomeAdmin: false,
        });
        showId = result.id;
      } else {
        showId = showData.showId;
      }

      // Episode
      let episodeId: string;
      if (episodeData.create) {
        const result = await api.createEpisode(Api.CREATE_EPISODE_MUTATION, {
          showId,
          episodeInput: episodeData.data,
        });
        episodeId = result.id;
      } else {
        episodeId = episodeData.episodeId;
      }

      // EpisodeUrl
      let episodeUrl: Api.EpisodeUrlNoEpisode;
      if (episodeUrlData.create) {
        episodeUrl = await api.createOrUpdateEpisodeUrl(Api.CREATE_EPISODE_URL_MUTATION, {
          episodeId,
          episodeUrlInput: episodeUrlData.data,
        });
      } else {
        if (episodeUrlRef.value == null) {
          throw new Error("Can't update an episode URL that doesn't exist");
        }
        episodeUrl = episodeUrlRef.value;
      }

      // Reload the data
      await fetchEpisodeByUrl(episodeUrl.url);

      updateEpisodeRequestState(RequestState.SUCCESS);
    } catch (err) {
      console.warn('actions.createEpisodeData', err);
      updateEpisodeRequestState(RequestState.FAILURE);
    }
  };
}
