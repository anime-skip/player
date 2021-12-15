import { loadedLog } from '~/common/utils/log';
import setupParent from '~/common/utils/setupParent';

async function getEpisodeInfo(): Promise<InferredEpisodeInfo> {
  const show = document.querySelector('.episode_title')?.textContent ?? undefined;
  const numberAndSeason = document.querySelector('.episode_subtitle')?.textContent ?? undefined;

  const matches = /Episode\s+(0-9+)\s+Season\s+(0-9+)/.exec(numberAndSeason ?? '');

  const number = matches?.[1];
  const season = matches?.[2];

  // TODO: fetch episode name from Anilist

  return { show, number, season };
}

export function initWakanimParent() {
  loadedLog('content-scripts/services/wakanim/parent.ts');
  setupParent('wakanim', { getEpisodeInfo });
}
