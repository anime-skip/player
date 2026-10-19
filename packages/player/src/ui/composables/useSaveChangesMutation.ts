import {
  EpisodeFragment,
  InputEpisode,
  InputEpisodeUrl,
  InputExistingTimestamp,
  InputShow,
  InputTimestamp,
  InputTimestampOn,
  Scalars,
  ShowFragment,
} from '../../utils/api';
import { createAppState } from '../../utils/app-state';
import { getUniqueExistenceMap } from '../../utils/array-utils';
import {
  isTimestampEqual,
  undoTimestampsOffset,
} from '../../utils/timestamp-utils';
import type { SaveContext } from './useGetLiveContext';

export default createAppState(() => {
  const { state: auth } = useAuth();
  const getLiveContext = useGetLiveContext();
  const api = useApiClient(true);
  const { stopEditing } = useIsEditing();

  const { mutateAsync: createShow } = useCreateShowMutation();
  const { mutateAsync: createEpisode } = useCreateEpisodeMutation();
  const { mutateAsync: updateTimestamps } = useUpdateTimestampsMutation();
  const { mutateAsync: updateEpisode } = useUpdateEpisodeMutation();
  const { mutateAsync: createEpisodeUrl } = useCreateEpisodeUrlMutation();

  return useMutation({
    async mutation(context: SaveContext | undefined) {
      const ctx = context ?? getLiveContext();
      const episodeUrl = { value: ctx.episodeUrl };
      const existingTimestamps = { value: ctx.existingTimestamps };
      const currentTimestamps = { value: ctx.currentTimestamps };
      const newShowName = ctx.showName.trim();
      const newEpisodeName = ctx.episodeName.trim();
      const newNumber = ctx.number.trim();
      const newSeason = ctx.season.trim();
      const newAbsoluteNumber = ctx.absoluteNumber.trim();
      const currentDuration = ctx.duration;
      const url = ctx.url;

      if (auth.value == null) {
        throw Error('Not logged in, cannot save.');
      }
      if (!currentDuration || !newShowName || !newEpisodeName || !url) {
        throw Error('Episode has not finished loading, cannot save.');
      }

      const showInput: InputShow = {
        name: newShowName,
      };
      const episodeInput: InputEpisode = {
        name: newEpisodeName,
        number: newNumber,
        season: newSeason,
        absoluteNumber: newAbsoluteNumber,
        baseDuration: episodeUrl.value?.episode.baseDuration ?? currentDuration,
      };

      let show: ShowFragment;
      let episode: EpisodeFragment;
      let timestampsOffset: number;

      if (episodeUrl.value) {
        // Update existing values
        episode = episodeUrl.value.episode;
        show = episode.show;
        timestampsOffset = episodeUrl.value.timestampsOffset ?? 0;

        const updateTasks: Promise<unknown>[] = [];
        if (
          newEpisodeName !== episode.name ||
          newSeason !== episode.season ||
          newNumber !== episode.number ||
          newAbsoluteNumber !== episode.absoluteNumber
        ) {
          updateTasks.push(
            updateEpisode({ episodeId: episode.id, newEpisode: episodeInput }),
          );
        }
        await Promise.all(updateTasks);
      } else {
        // Create show if an exact name match doesn't exist
        const results = await api.searchShows({ search: newShowName });
        const exactShow = results.searchShows.find(
          (s) => s.name.toLowerCase() === newShowName.toLowerCase(),
        );
        if (exactShow) {
          show = exactShow;
        } else {
          const res = await createShow({ showInput, becomeAdmin: true });
          show = res.createShow;
        }
        // Create new episode/show based on episode form
        episode = (await createEpisode({ showId: show.id, episodeInput }))
          .createEpisode;

        timestampsOffset =
          currentDuration - (episode.baseDuration ?? currentDuration);
        const episodeUrlInput: InputEpisodeUrl = {
          url,
          duration: currentDuration,
          timestampsOffset,
        };
        await createEpisodeUrl({ episodeId: episode.id, episodeUrlInput });
      }

      // Save timestamps
      {
        // Remove timestamp offsets so values are saved without them
        const realExistingTimestamps = undoTimestampsOffset(
          existingTimestamps.value ?? [],
          timestampsOffset,
        );
        const realCurrentTimestamps = undoTimestampsOffset(
          currentTimestamps.value,
          timestampsOffset,
        );

        const createdTimestamps: InputTimestampOn[] = [];
        const updatedTimestamps: InputExistingTimestamp[] = [];
        const deletedTimestamps: Scalars['ID']['input'][] = [];

        const existingMap = getUniqueExistenceMap(realExistingTimestamps, 'id');
        for (const edited of realCurrentTimestamps) {
          const inputTimestamp: InputTimestamp = {
            at: edited.at,
            typeId: edited.typeId,
            source: edited.source,
          };
          if (typeof edited.id === 'number') {
            // Create new timestamps (id is a number)
            createdTimestamps.push({
              episodeId: episode.id,
              timestamp: inputTimestamp,
            });
          } else if (!isTimestampEqual(existingMap[edited.id], edited)) {
            // Update edited timestamps
            updatedTimestamps.push({
              id: edited.id,
              timestamp: inputTimestamp,
            });
          }
        }

        const currentMap = getUniqueExistenceMap(realCurrentTimestamps, 'id');
        for (const existing of realExistingTimestamps) {
          if (currentMap[existing.id] == null) {
            deletedTimestamps.push(existing.id);
          }
        }

        const editedCount =
          createdTimestamps.length +
          updatedTimestamps.length +
          deletedTimestamps.length;
        if (editedCount > 0) {
          await updateTimestamps({
            create: createdTimestamps,
            update: updatedTimestamps,
            delete: deletedTimestamps,
          });
        }
      }
    },
    onSuccess: (_data, context) => {
      // Saving a previous episode's changes shouldn't end the current edit session
      if (!context) stopEditing();
    },
  });
});
