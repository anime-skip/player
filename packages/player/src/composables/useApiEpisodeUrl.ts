/**
 * Wrapper around `useFindEpisodeUrlQuery` returning only the `EpisodeUrl` if it has loaded.
 */
export default function () {
  const { data } = useFindEpisodeUrlQuery();
  return data;
}
