import { loadedLog } from '~/utils/log';
import setupParent from '~/utils/setupParent';
import { newlinesToSpaces } from '~/utils/strings';
import { InferredEpisodeInfo } from '~types';

export function getEpisodeInfo(dom = document): InferredEpisodeInfo {
  const episodeLink = dom.querySelector<HTMLAnchorElement>('.episodes.name a.active');
  const number = episodeLink?.getAttribute('data-num')?.trim();
  let name = episodeLink?.querySelector('.d-title')?.textContent?.trim() || undefined;
  if (name) name = newlinesToSpaces(name);
  let show =
    dom.querySelector<HTMLHeadingElement>('.info .d-title')?.textContent?.trim() || undefined;
  if (show) show = newlinesToSpaces(show);

  const isMovie = !!dom.querySelector('a[href="movie"]');
  if (isMovie) {
    return { name: show, show };
  } else {
    return { name, number, show };
  }
}

export function init9animeParent() {
  loadedLog('content-scripts/services/9anime/parent.ts');

  setupParent('9anime', {
    getEpisodeInfo,
  });
}
