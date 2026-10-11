import { createAppState } from '../utils/app-state';
import { QueryKey } from '../utils/QueryKey';
import { SECOND } from '../utils/time';

/** Returns a query containing the page's current URL. */
export default createAppState(() => {
  const { getEpisodeUrl } = usePlayerOptions();
  return useQuery(QueryKey.CurrentUrl, getEpisodeUrl, {
    refetchInterval: SECOND,
  });
});
