import {
  EpisodeUrlFragment,
  UpdateTimestampsMutationVariables,
} from '../../utils/api';
import { deleteMatches, getUniqueExistenceMap } from '../../utils/array-utils';
import { QueryKey } from '../../utils/QueryKey';
import { sortTimestamps } from '../../utils/timestamp-utils';

/** Perform the updateTimestamp GraphQL mutation to save changes to timestamps. */
export default function () {
  const client = useApiClient(true);
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (vars: UpdateTimestampsMutationVariables) =>
      client.updateTimestamps(vars),
    onSuccess(data) {
      const results = data.updateTimestamps;
      const deletedIds = results.deleted.map((t) => t.id);
      const updatedMap = getUniqueExistenceMap(results.updated, 'id');

      queryCache.setQueriesData<EpisodeUrlFragment | undefined>(
        { key: [QueryKey.FindEpisodeUrl] },
        (episodeUrl) => {
          if (!episodeUrl) return;

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
