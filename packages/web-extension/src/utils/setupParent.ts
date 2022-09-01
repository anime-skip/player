import { onMessage } from '~/utils/web-ext-bridge';
import { CrawledEpisodeInfo, ScreenshotDetails } from '~types';
import { fallbackBound } from '~utils/drawing';
import { sleep } from '~utils/time';
import { error } from './log';

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

export default function setupParent(options: {
  getEpisodeInfo(): Promise<CrawledEpisodeInfo> | CrawledEpisodeInfo;
  getScreenshotDetails?(): ScreenshotDetails;
}): void {
  // Sites using HTML5 History mode don't update immediately, so we track the url to know if we
  // should be expecting a different episode
  let previousUrl: string | undefined;
  let previousEpisodeName: string | undefined;

  onMessage('@anime-skip/inferEpisodeInfo', async () => {
    const currentUrl: string = window.location.href;
    let episode: CrawledEpisodeInfo;

    try {
      if (previousUrl != null && currentUrl !== previousUrl) {
        // Wait for a little bit, then loop until the episode name is different
        await sleep(400);
        do {
          await sleep(100);
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
  });
  onMessage(
    '@anime-skip/parent-screenshot-details',
    () => options.getScreenshotDetails?.() ?? defaultGetScreenshotDetails()
  );
}
