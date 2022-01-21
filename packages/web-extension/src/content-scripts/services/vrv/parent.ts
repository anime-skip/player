import { loadedLog } from '~/common/utils/log';
import setupParent from '~/common/utils/setupParent';

export function initVrvParent() {
  loadedLog('content-scripts/services/vrv/parent.ts');

  setupParent('vrv', {
    getEpisodeInfo() {
      const show = document.querySelector('.episode-info span.series')?.textContent || undefined;
      const fullSeason = document.querySelector('.episode-info span.season');
      const season = fullSeason?.textContent?.replace('SEASON', '')?.trim();

      const episodeSplit = document.querySelector('h2.title')?.textContent?.split(' - ') || [];
      const name = episodeSplit.length === 2 ? episodeSplit[1] : episodeSplit[0];
      const fullNumber = episodeSplit.length === 2 ? episodeSplit[0] : undefined;
      const number = fullNumber?.replace('E', '')?.trim();

      return {
        show,
        season,
        name,
        number,
      };
    },
  });
}
