import { loadedLog } from '~/utils/log';
import setupParent from '~/utils/setupParent';

function getEpisodeInfo() {
  // X - 2021/05/28
  if (document.querySelector('.video-title') != null) {
    const show = document.querySelector('.video-title a')?.textContent ?? undefined;
    const number = document
      .querySelector('.video-title')
      ?.textContent?.replace(show || '', '')
      ?.replace('Episode', '')
      ?.trim();
    const name = document.querySelector('h2.episode-headline')?.textContent ?? undefined;
    return {
      show,
      number,
      name,
    };
  }

  // 2021/05/28 - Current
  if (document.querySelector('.show-title') != null) {
    const show = document.querySelector('.show-title a')?.textContent ?? undefined;
    const number = document
      .querySelector('.show-title nobr')
      ?.textContent?.replace('Episode', '')
      ?.trim();
    const name = document.querySelector('.v-card__subtitle')?.textContent ?? undefined;
    return {
      show,
      number,
      name,
    };
  }

  return {};
}

export function initFunimationParent() {
  loadedLog('content-scripts/services/funimation/parent.ts');
  setupParent({ getEpisodeInfo });
}
