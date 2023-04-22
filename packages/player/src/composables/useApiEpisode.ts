/**
 * Wrapper around `useFindEpisodeUrlQuery` returning only the `Episode` if it has loaded.
 */
export default function () {
  const { data } = useFindEpisodeUrlQuery();
  return computed(() => data.value?.episode);
}
