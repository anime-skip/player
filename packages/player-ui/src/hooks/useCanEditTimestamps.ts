import { useIsLoggedIn } from '~/common/state/useAuth';
import { useEpisode, useEpisodeUrl } from '../state/useEpisodeState';

export function useCanEditTimestamps() {
  const isLoggedIn = useIsLoggedIn();
  const episodeUrl = useEpisodeUrl();
  const episode = useEpisode();

  return computed<boolean>(() => {
    if (!isLoggedIn.value) return false;
    if (episodeUrl.value == null) return false;
    if (episode.value == null) return false;
    const { name, show } = episode.value;
    if (!name || !show?.name) return false;
    return true;
  });
}
