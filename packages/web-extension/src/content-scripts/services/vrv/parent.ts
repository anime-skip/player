import { loadedLog } from '~/common/utils/log';
import setupParent from '~/common/utils/setupParent';
import { InferredEpisodeInfo } from '~types';

export function getEpisodeInfo(dom = document): InferredEpisodeInfo {
  const show = dom.querySelector('.episode-info span.series')?.textContent || undefined;
  const fullSeason = dom.querySelector('.episode-info span.season');
  const season = fullSeason?.textContent?.replace('SEASON', '')?.trim();

  const episodeSplit = dom.querySelector('h2.title')?.textContent?.split(' - ') || [];
  const name = episodeSplit.length === 2 ? episodeSplit[1] : episodeSplit[0];
  const fullNumber = episodeSplit.length === 2 ? episodeSplit[0] : undefined;
  const number = fullNumber?.replace('E', '')?.trim();

  const isMovie = show == null;

  if (isMovie) {
    return { show: name, name };
  } else {
    return { show, season, name, number };
  }
}

export function initVrvParent() {
  loadedLog('content-scripts/services/vrv/parent.ts');

  setupParent('vrv', {
    getEpisodeInfo,
  });
}
