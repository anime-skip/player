import useFindEpisodeByShowAndName from './useFindEpisodeByShowAndName';

/**
 * Based on the episode info from `playerOptions.getEpisodeInfo()`, return a matching
 * `ThirdPartyEpisode` from the API.
 */
export default function () {
  const { data: episodeInfo } = useEpisodeInfoQuery();
  const { data: episodeUrl, isFetched: isEpisodeUrlFetched } =
    useFindEpisodeUrlQuery();

  const episodeName = computed(() => episodeInfo.value?.episodeName);
  const showName = computed(() => episodeInfo.value?.showName);

  // Only perform the query if we've loaded the episode info from the page and we didn't find an
  // episode URL for the current page's URL
  const enabled = computed(
    () => !!episodeInfo.value && isEpisodeUrlFetched.value && !episodeUrl.value,
  );

  return useFindEpisodeByShowAndName({ episodeName, showName, enabled });
}
