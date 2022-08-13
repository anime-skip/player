import { loadedLog } from '~/utils/log';
import setupParent from '~/utils/setupParent';
import { InferredEpisodeInfo } from '~types';

export function getEpisodeInfo(dom = document): InferredEpisodeInfo {
  const episodeLink = dom.querySelector<HTMLAnchorElement>('#detail-ss-list .ep-item.active');
  const name = episodeLink?.title?.trim();
  const number = episodeLink?.getAttribute('data-number')?.trim();
  const show =
    dom.querySelector<HTMLAnchorElement>('.anis-watch-detail .film-name a')?.title ?? undefined;
  const isMovie =
    Array.from(dom.querySelectorAll<HTMLAnchorElement>('.prebreadcrumb .breadcrumb-item a')).find(
      a => a.getAttribute('href') === '/movie'
    ) != null;

  if (isMovie) {
    return { name: show, show };
  } else {
    return { name, number, show };
  }
}

export function initZoroParent() {
  loadedLog('content-scripts/services/zoro/parent.ts');

  setupParent({
    getEpisodeInfo,
  });
}
