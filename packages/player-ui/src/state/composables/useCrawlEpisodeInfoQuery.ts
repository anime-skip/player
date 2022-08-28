import { useQuery } from 'vue-query';
import { usePlayerConfig } from '../../composables/usePlayerConfig';

export const CRAWL_EPISODE_INFO_QUERY = 'crawl-episode-info';

export function useCrawlEpisodeInfoQuery() {
  const config = usePlayerConfig();

  return useQuery({
    queryKey: CRAWL_EPISODE_INFO_QUERY,
    queryFn: () => config.crawlEpisodeInfo(),
  });
}
