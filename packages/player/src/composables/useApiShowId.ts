import { ShowFragment } from '../utils/api';

export default function () {
  const episode = useApiEpisode();
  return computed(() => (episode.value?.show as ShowFragment | undefined)?.id);
}
