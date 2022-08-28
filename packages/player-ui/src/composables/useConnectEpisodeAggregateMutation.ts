import { RequestState } from 'vue-use-request-state';
import { useApiClient } from './useApiClient';
import { warn } from '../utils/log';
import * as Api from 'common/src/api';
import GeneralUtils from 'common/src/utils/GeneralUtils';
import { useDialogStore } from '../state/stores/useDialogStore';
import { useTimestampEditingStore } from '../state/stores/useTimestampEditingStore';
import { useCreateShowMutation } from '../state/composables/useCreateShowMutation';
import { useCreateOrUpdateEpisodeUrlMutation } from '../state/composables/useCreateOrUpdateEpisodeUrlMutation';
import { useCreateEpisodeMutation } from '../state/composables/useCreateEpisodeMutation';
import { useMutation, useQueryClient } from 'vue-query';
import {
  EpisodeUrl,
  EpisodeUrlEpisode,
  EpisodeUrlEpisodeTimestamp,
  EPISODE_URL_QUERY_KEY,
} from '../state/composables/useFindEpisodeUrlQuery';
import { useSaveTimestampsMutation } from './useSaveTimestampsMutation';

export interface ConnectEpisodeVariables {
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
        data: EpisodeUrlEpisode;
      }
    | {
        create: true;
        data: Api.InputEpisode;
      };
  episodeUrl:
    | {
        create: false;
        data: EpisodeUrl;
      }
    | {
        create: true;
        data: Api.InputEpisodeUrl;
      };
  /**
   * A list of timestamps to create if we already have some
   */
  initialTimestampsWithOffset?: Api.AmbiguousTimestamp[];
}

export function useConnectEpisodeAggregateMutation() {
  const dialogs = useDialogStore();
  const editing = useTimestampEditingStore();

  const createEpisode = useCreateEpisodeMutation();
  const createShow = useCreateShowMutation();
  const createOrUpdateEpisodeUrl = useCreateOrUpdateEpisodeUrlMutation();
  const saveTimestamps = useSaveTimestampsMutation();

  const queryClient = useQueryClient();

  return useMutation({
    onMutate() {
      dialogs.hideDialog();
      editing.isSaving = true; // TODO[state]: don't use editing.isSaving for everything, use query/mutation.isLoading
    },
    async mutationFn(variables: ConnectEpisodeVariables): Promise<void> {
      // Show
      let showId: string;
      if (variables.show.create) {
        const result = await createShow.mutateAsync({
          showInput: { name: variables.show.name },
          becomeAdmin: false,
        });
        showId = result.id;
      } else {
        showId = variables.show.showId;
      }

      // Episode
      let episode: EpisodeUrlEpisode;
      if (variables.episode.create) {
        episode = await createEpisode.mutateAsync({
          showId,
          episodeInput: variables.episode.data,
        });
      } else {
        episode = variables.episode.data;
      }

      // EpisodeUrl
      let episodeUrl: EpisodeUrl;
      if (variables.episodeUrl.create) {
        episodeUrl = await createOrUpdateEpisodeUrl.mutateAsync({
          episodeId: episode.id,
          episodeUrlInput: variables.episodeUrl.data,
        });
      } else {
        episodeUrl = variables.episodeUrl.data;
      }

      // Create initial set of timestamps if we have them
      if (variables.initialTimestampsWithOffset) {
        await saveTimestamps.mutateAsync({
          episode,
          episodeUrl,
          oldTimestampsWithOffset: [],
          newTimestampsWithOffset: variables.initialTimestampsWithOffset.map(timestamp => ({
            id: GeneralUtils.randomId(),
            at: GeneralUtils.applyTimestampsOffset(episodeUrl.timestampsOffset, timestamp.at),
            typeId: timestamp.typeId,
            source: timestamp.source,
          })),
        });
      }
    },
    onSuccess() {
      queryClient.invalidateQueries(EPISODE_URL_QUERY_KEY);
    },
    onSettled() {
      editing.isSaving = false;
    },
  });
}
