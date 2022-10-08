import { loadedLog } from '~/utils/log';
import setupParent from '~/utils/setupParent';
import { InferredEpisodeInfo } from '~types';

export function getEpisodeInfo(dom = document): InferredEpisodeInfo {
  const show = dom
    .querySelector<HTMLMetaElement>('meta[name="anime-skip.show.name"]')
    ?.content.trim();
  const name = dom
    .querySelector<HTMLMetaElement>('meta[name="anime-skip.episode.name"]')
    ?.content.trim();
  const number = dom
    .querySelector<HTMLMetaElement>('meta[name="anime-skip.episode.number"]')
    ?.content.trim();
  return {
    show,
    name,
    number,
  };
}

export function initAnimeflixParent() {
  loadedLog('content-scripts/services/animeflix/parent.ts');

  setupParent({
    getEpisodeInfo,
  });
}
