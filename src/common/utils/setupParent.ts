import Messenger from '~/common/utils/Messenger';
import Utils from '~/common/utils/Utils';
import { error } from './log';
import { fallbackBound } from './videoBounds';

function defaultGetScreenshotDetails() {
  const iframe = document.querySelector('iframe');
  const bounds = iframe?.getBoundingClientRect();
  return {
    height: fallbackBound(bounds?.height),
    left: fallbackBound(bounds?.left),
    top: fallbackBound(bounds?.top),
    width: fallbackBound(bounds?.width),
  };
}

export default function setupParent(
  service: Service,
  options: {
    getEpisodeInfo(): Promise<InferredEpisodeInfo> | InferredEpisodeInfo;
    getScreenshotDetails?(): ScreenshotDetails;
  }
): void {
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
        error('Failed to infer episode info', err, { previousUrl, currentUrl, episode });
      }
      return episode;
    },
    '@anime-skip/parent-screenshot-details': async () => {
      return options.getScreenshotDetails?.() ?? defaultGetScreenshotDetails();
    },
  });
}
