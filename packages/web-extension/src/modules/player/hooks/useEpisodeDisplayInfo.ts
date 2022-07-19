import { useEpisode } from '~/stores/useEpisodeState';
import { useInferredEpisode } from '~/stores/useInferredEpisodeState';

export interface EpisodeDisplayInfo {
  name: string;
  number?: string;
  absoluteNumber?: string;
  season?: string;
  show: string;
}

export function useEpisodeDisplayInfo() {
  const episode = useEpisode();
  const inferredEpisode = useInferredEpisode();
  return computed<EpisodeDisplayInfo>(() => {
    if (episode.value) {
      return {
        absoluteNumber: episode.value.absoluteNumber,
        name: episode.value.name || 'Unknown Episode',
        number: episode.value.number,
        season: episode.value.season,
        show: episode.value.show?.name || 'Unknown Show',
      };
    }

    return {
      absoluteNumber: inferredEpisode.value?.absoluteNumber,
      number: inferredEpisode.value?.number,
      name: inferredEpisode.value?.name || 'Unknown Episode',
      season: inferredEpisode.value?.season,
      show: inferredEpisode.value?.show || 'Unknown Show',
    };
  });
}
