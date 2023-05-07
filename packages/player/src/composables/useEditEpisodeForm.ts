/**
 * Global form state for editing the current episode details
 */
export default createGlobalState(() => {
  const { startEditing } = useIsEditing();

  // Form values
  const showName = ref('');
  const episodeName = ref('');
  const season = ref('');
  const number = ref('');
  const absoluteNumber = ref('');

  const currentTimestamps = useCurrentTimestamps();
  const { ignoreUpdates } = watchIgnorable(
    [showName, episodeName, season, number, absoluteNumber],
    () => {
      startEditing(currentTimestamps.value);
    },
  );

  // Reset the inputs when the URL and episode info changes
  const apiEpisode = useApiEpisode();
  const { data: episodeInfo } = useEpisodeInfoQuery();
  watch(
    [episodeInfo, apiEpisode],
    () => {
      ignoreUpdates(() => {
        showName.value =
          apiEpisode.value?.show.name ?? episodeInfo.value?.showName ?? '';
        episodeName.value =
          apiEpisode.value?.name ?? episodeInfo.value?.episodeName ?? '';
        season.value =
          apiEpisode.value?.season ?? episodeInfo.value?.season ?? '';
        number.value =
          apiEpisode.value?.number ?? episodeInfo.value?.number ?? '';
        absoluteNumber.value =
          apiEpisode.value?.absoluteNumber ??
          episodeInfo.value?.absoluteNumber ??
          '';
      });
    },
    { immediate: true },
  );

  return {
    showName,
    episodeName,
    season,
    number,
    absoluteNumber,
  };
});
