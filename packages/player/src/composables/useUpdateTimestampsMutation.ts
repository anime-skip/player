import { QueryKey } from '../utils/QueryKey';

/**
 * Perform the updateTimestamp GraphQL mutation to save changes to timestamps.
 */
export default function () {
  const client = useApiClient(true);
  const queries = useQueryClient();

  useMutation(client.updateTimestamps, {
    onSuccess() {
      queries.invalidateQueries(QueryKey.FindEpisodeUrl);
    },
  });
}
