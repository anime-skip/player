import { CrawledEpisodeInfo } from 'common/src/types';
import { Ref } from 'vue';
import { EpisodeUrlEpisode } from './useFindEpisodeUrlQuery';

export function useDisplayedEpisodeInfo(
  episode: Ref<EpisodeUrlEpisode | undefined>,
  crawledInfo: Ref<CrawledEpisodeInfo | undefined>
) {
  const episodeName = computed(
    () => (episode.value ? episode.value.name : crawledInfo.value?.name) ?? 'Unknown Episode'
  );
  const showName = computed(
    () => (episode.value ? episode.value.show?.name : crawledInfo.value?.show) ?? 'Unknown Show'
  );
  const season = computed(() => (episode.value ? episode.value.season : crawledInfo.value?.season));
  const episodeNumber = computed(() =>
    episode.value ? episode.value.number : crawledInfo.value?.number
  );
  const absoluteNumber = computed(() =>
    episode.value ? episode.value.absoluteNumber : crawledInfo.value?.absoluteNumber
  );

  return {
    episodeName,
    showName,
    season,
    episodeNumber,
    absoluteNumber,
  };
}
