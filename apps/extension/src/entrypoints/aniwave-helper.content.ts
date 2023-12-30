import { initExtensionHelper } from '@/utils/extension-helper';
import { newlinesToSpaces } from '@/utils/string-utils';
import { InferredEpisodeInfo } from '@anime-skip/player';

export default defineContentScript({
  matches: [
    // Examples:
    // - https://aniwave.to/watch/ragna-crimson.3r7kr/ep-12
    // - https://aniwave.to/watch/sword-art-online-progressive-scherzo-of-deep-night.8001n/ep-1
    // - https://aniwave.to/watch/hikikomari-kyuuketsuki-no-monmon.m2j17/ep-3
    '*://aniwave.to/watch/*',
  ],
  allFrames: false,

  main(ctx) {
    initExtensionHelper({
      ctx,
      getEpisodeInfo,
    });
    logger.log(`Initialized ${location.host} helper`);
  },
});

export function getEpisodeInfo(dom = document): InferredEpisodeInfo {
  const episodeLink = dom.querySelector<HTMLAnchorElement>(
    '.episodes.name a.active',
  );
  const number = episodeLink?.getAttribute('data-num')?.trim();
  let episodeName =
    episodeLink?.querySelector('.d-title')?.textContent?.trim() || undefined;
  if (episodeName) episodeName = newlinesToSpaces(episodeName);
  let showName =
    dom
      .querySelector<HTMLHeadingElement>('.info .d-title')
      ?.textContent?.trim() || undefined;
  if (showName) showName = newlinesToSpaces(showName);

  const isMovie = !!dom.querySelector('a[href="movie"]');
  if (isMovie) {
    return { showName, episodeName: showName };
  } else {
    return { episodeName, number, showName };
  }
}
