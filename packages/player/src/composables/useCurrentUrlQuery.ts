import { QueryKey } from '../utils/QueryKey';
import { SECOND } from '../utils/time';

/**
 * Returns a query containing the page's current URL.
 */
export default createGlobalState(() => {
  const { getEpisodeUrl } = usePlayerOptions();
  return useQuery(QueryKey.CurrentUrl, getEpisodeUrl, {
    refetchInterval: SECOND,
  });
});
