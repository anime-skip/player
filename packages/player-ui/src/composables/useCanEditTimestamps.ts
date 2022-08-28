import { storeToRefs } from 'pinia';
import { useAuthStore } from '../state/stores/useAuthStore';
import { useEpisodeStore } from '../state/stores/useEpisodeStore';

export function useCanEditTimestamps() {
  const auth = useAuthStore();
  const { episode, episodeUrl } = storeToRefs(useEpisodeStore());

  return computed<boolean>(() => {
    if (!auth.isLoggedIn) return false;
    if (episodeUrl.value == null) return false;
    if (episode.value == null) return false;
    const { name, show } = episode.value;
    if (!name || !show?.name) return false;
    return true;
  });
}
