import { QueryKey } from '../utils/QueryKey';
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
} from '../utils/api';
import { getUniqueExistenceMap } from '../utils/array-utils';
import { isTimestampEqual } from '../utils/timestamp-utils';

export default createSharedComposable(() => {
  const { state: auth } = useAuth();
  const { data: currentUrl } = useCurrentUrlQuery();
  const episodeUrl = useApiEpisodeUrl();
  const episodeForm = useEditEpisodeForm();
  const { duration } = useVideoControls();
  const api = useApiClient(true);
  const existingTimestamps = useApiTimestamps();
  const currentTimestamps = useCurrentTimestamps();
  const { stopEditing } = useIsEditing();

  const { mutateAsync: createShow } = useCreateShowMutation();
  const { mutateAsync: createEpisode } = useCreateEpisodeMutation();
  const { mutateAsync: updateTimestamps } = useUpdateTimestampsMutation();
  const { mutateAsync: updateEpisode } = useUpdateEpisodeMutation();
  const { mutateAsync: createEpisodeUrl } = useCreateEpisodeUrlMutation();

  return useMutation(
    async () => {
      const newShowName = episodeForm.showName.value.trim();
      const newEpisodeName = episodeForm.episodeName.value.trim();
      const newNumber = episodeForm.number.value.trim();
      const newSeason = episodeForm.season.value.trim();
      const newAbsoluteNumber = episodeForm.absoluteNumber.value.trim();
      const currentDuration = duration.value;
      const url = currentUrl.value;

      if (
        !auth.value ||
        !currentDuration ||
        !newShowName ||
        !newEpisodeName ||
        !url
      )
        return;

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

      if (episodeUrl.value) {
        // Update existing values
        episode = episodeUrl.value.episode;
        show = episode.show;

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

        const episodeUrlInput: InputEpisodeUrl = {
          url,
          duration: currentDuration,
          timestampsOffset:
            currentDuration - (episode.baseDuration ?? currentDuration),
        };
        await createEpisodeUrl({ episodeId: episode.id, episodeUrlInput });
      }

      // Save timestamps
      {
        const createdTimestamps: InputTimestampOn[] = [];
        const updatedTimestamps: InputExistingTimestamp[] = [];
        const deletedTimestamps: Scalars['ID'][] = [];

        const existingMap = getUniqueExistenceMap(
          existingTimestamps.value ?? [],
          'id',
        );
        for (const edited of currentTimestamps.value) {
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

        const currentMap = getUniqueExistenceMap(
          currentTimestamps.value ?? [],
          'id',
        );
        for (const existing of existingTimestamps.value ?? []) {
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
    {
      onSuccess: stopEditing,
    },
  );
});
