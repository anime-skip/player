import useCreateEpisodeUrlMutation from './useCreateEpisodeUrlMutation';

/**
 * Get the inferred episode details, and auto-create the episode URL if there's already an Anime
 * Skip Episode to use.
 */
export default function () {
  const { data: currentUrl } = useCurrentUrlQuery();
  const { data: episodeUrl } = useFindEpisodeUrlQuery();
  const { data: inferredEpisode } = useFindInferredEpisodeQuery();
  const { state: auth } = useAuth();
  const { duration } = useVideoControls();

  const { mutate: createEpisodeUrl } = useCreateEpisodeUrlMutation();

  whenever(
    // We can create the EpisodeUrl if all the following are true:
    // 1. We're logged in
    // 2. We've fetched the current URL
    // 3. There isn't already an EpisodeURL
    // 4. The inferred episode from the API is a valid anime skip episode (it has an ID)
    // 5. There is a known duration
    computed(
      () =>
        !!auth.value &&
        !!currentUrl.value &&
        !episodeUrl.value &&
        !!inferredEpisode.value?.id &&
        !!duration.value,
    ),
    () => {
      createEpisodeUrl({
        episodeId: inferredEpisode.value!.id!,
        episodeUrlInput: {
          url: currentUrl.value!,
          duration: duration.value,
          timestampsOffset:
            duration.value! -
            (inferredEpisode.value!.baseDuration ?? duration.value!),
        },
      });
    },
  );
}
