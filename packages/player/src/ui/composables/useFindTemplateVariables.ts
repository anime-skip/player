export default function () {
  const episode = useApiEpisode();
  return computed(() => {
    if (episode.value == null) return undefined;
    return {
      episodeId: episode.value.id ?? undefined,
      showName: episode.value.show.name ?? undefined,
      season: episode.value.season ?? undefined,
    };
  });
}
