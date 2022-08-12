import { loadedLog, log } from '~/utils/log';
import setupParent from '~/utils/setupParent';
import { waitUntil } from '~utils/time';

async function getEpisodeInfo() {
  const pageHasLoaded = () => Promise.resolve(document.querySelector('.meta-overlay') != null);
  log('Waiting for page to load...');
  await waitUntil(pageHasLoaded, 10 * 1000, 1, 200);
  log('Page has loaded!');

  // 2021/09/26 - Current
  const show = document.querySelector('.meta-overlay__data-block--title')?.textContent ?? undefined;
  const name =
    document.querySelector('[data-test=meta-overlay__data-block--content-name]')?.textContent ??
    undefined;

  let season: string | undefined;
  let number: string | undefined;

  const details =
    document.querySelector('[data-test=meta-overlay__data-block--episode-details]')?.textContent ??
    '';
  if (details) {
    const seasonAndNumberRegex = /\s*Season\s*(.*?)\s*Episode\s*(.*)/;
    const seasonAndNumberMatch = seasonAndNumberRegex.exec(details);
    if (seasonAndNumberMatch) {
      season = seasonAndNumberMatch[1];
      number = seasonAndNumberMatch[2];
    } else {
      const justNumberRegex = /\s*Episode\s*(.*)/;
      const justNumberMatch = justNumberRegex.exec(details);
      if (justNumberMatch) {
        number = justNumberMatch[1];
      }
    }
  }

  return {
    show,
    number,
    season,
    name,
  };
}

export function initFunimation20210926Parent() {
  loadedLog('content-scripts/services/funimation-2021-09-26/parent.ts');
  setupParent('funimation', { getEpisodeInfo });
}
