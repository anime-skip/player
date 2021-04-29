import Messenger from '@/common/utils/Messenger';
import Utils from '@/common/utils/Utils';

export default function setupParent(
  service: Service,
  options: {
    getEpisodeInfo(): Promise<InferredEpisodeInfo> | InferredEpisodeInfo;
  }
): void {
  console.log(`INJECTED content-scripts/${service}/parent.ts`);

  // Sites using HTML5 History mode don't update immediately, so we track the url to know if we
  // should be expecting a different episode
  let previousUrl: string | undefined;
  let previousEpisodeName: string | undefined;

  new Messenger<
    ParentMessageTypes,
    ParentMessageListenerMap,
    ParentMessagePayloadMap,
    ParentMessageResponseMap
  >(`${service} parent`, {
    '@anime-skip/inferEpisodeInfo': async () => {
      const currentUrl: string = window.location.href;
      let episode: InferredEpisodeInfo;

      try {
        if (previousUrl != null && currentUrl !== previousUrl) {
          // Wait for a little bit, then loop until the episode name is different
          await Utils.sleep(400);
          do {
            await Utils.sleep(100);
            episode = await options.getEpisodeInfo();
          } while (episode.name === previousEpisodeName);
        } else {
          episode = await options.getEpisodeInfo();
        }

        previousUrl = currentUrl;
        previousEpisodeName = episode.name;
      } catch (err) {
        episode = {};
        console.error('Failed to infer episode info', err, { previousUrl, currentUrl, episode });
      }
      return episode;
    },
  });
}
