import { createAppState } from '../utils/app-state';
import { QueryKey } from '../utils/QueryKey';
import { SECOND } from '../utils/time';

/** Returns a query containing the page's current URL. */
export default createAppState(() => {
  const { getEpisodeUrl } = usePlayerOptions();
  const query = useQuery({
    key: [QueryKey.CurrentUrl],
    query: async () => getEpisodeUrl(),
  });

  useIntervalFn(() => query.refetch(), SECOND);
  return query;
});
