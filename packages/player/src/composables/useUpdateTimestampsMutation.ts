import { QueryKey } from '../utils/QueryKey';
import { EpisodeUrlFragment } from '../utils/api';
import { deleteMatches, getUniqueExistenceMap } from '../utils/array-utils';
import { sortTimestamps } from '../utils/timestamp-utils';

/**
 * Perform the updateTimestamp GraphQL mutation to save changes to timestamps.
 */
export default function () {
  const client = useApiClient(true);
  const queries = useQueryClient();

  return useMutation(client.updateTimestamps, {
    onSuccess(data) {
      const results = data.updateTimestamps;
      const deletedIds = results.deleted.map((t) => t.id);
      const updatedMap = getUniqueExistenceMap(results.updated, 'id');

      queries.setQueriesData(
        [QueryKey.FindEpisodeUrl],
        (oldData): EpisodeUrlFragment | undefined => {
          if (!oldData) return;

          const episodeUrl = oldData as EpisodeUrlFragment;

          // Remove deleted
          let newTimestamps = deleteMatches(
            episodeUrl.episode.timestamps,
            (t) => deletedIds.includes(t.id),
          );
          // Update edited
          newTimestamps = newTimestamps.map((t) => updatedMap[t.id] ?? t);
          // Add newly created
          newTimestamps.push(...results.created);
          // Sort
          sortTimestamps(newTimestamps);

          return {
            ...episodeUrl,
            episode: {
              ...episodeUrl.episode,
              timestamps: newTimestamps,
            },
          };
        },
      );
    },
  });
}
