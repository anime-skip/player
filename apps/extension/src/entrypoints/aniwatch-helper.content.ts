import { initExtensionHelper } from '@/utils/extension-helper';
import { newlinesToSpaces } from '@/utils/string-utils';
import { InferredEpisodeInfo } from '@anime-skip/player';

export default defineContentScript({
  matches: [
    // Examples:
    // - https://aniwatch.to/watch/my-hero-academia-season-6-18154?ep=94353
    // - https://aniwatch.to/watch/your-name-10?ep=57910
    '*://aniwatch.to/watch/*',
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
    '#detail-ss-list .ep-item.active',
  );
  const episodeName = episodeLink?.title?.trim();
  const number = episodeLink?.getAttribute('data-number')?.trim();
  const showName =
    dom.querySelector<HTMLAnchorElement>('.anis-watch-detail .film-name a')
      ?.title ?? undefined;
  const isMovie =
    Array.from(
      dom.querySelectorAll<HTMLAnchorElement>(
        '.prebreadcrumb .breadcrumb-item a',
      ),
    ).find((a) => a.getAttribute('href') === '/movie') != null;

  if (isMovie) {
    return { episodeName: showName, showName };
  } else {
    return { episodeName, number, showName };
  }
}
