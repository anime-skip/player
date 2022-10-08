import { init9animeParent } from '~/modules/9anime/parent';
import { initAnimeSkipParent } from '~/modules/anime-skip';
import { initCrunchyrollParent } from '~/modules/crunchyroll/parent';
import { initFunimation20210926Parent } from '~/modules/funimation-2021-09-26/parent';
import { initFunimationParent } from '~/modules/funimation/parent';
import { initTestServiceParent } from '~/modules/test-service/parent';
import { initVrvParent } from '~/modules/vrv/parent';
import { initZoroParent } from '~/modules/zoro/parent';
import { ParentHosts } from '~/utils/compile-time-constants';
import { error, loadedLog } from '~/utils/log';
import { urlPatternMatch } from '~/utils/strings';
import { initAnimeflixParent } from './modules/animeflix/parent';

const services: Record<ParentHosts, () => void> = {
  [ParentHosts.ANIME_SKIP]: initAnimeSkipParent,
  [ParentHosts.ANIME_SKIP_WWW]: initAnimeSkipParent,
  [ParentHosts.CRUNCHYROLL_BETA]: initCrunchyrollParent,
  [ParentHosts.CRUNCHYROLL]: initCrunchyrollParent,
  [ParentHosts.FUNIMATION_20210926]: initFunimation20210926Parent,
  [ParentHosts.FUNIMATION]: initFunimationParent,
  [ParentHosts.TEST_SERVICE]: initTestServiceParent,
  [ParentHosts.VRV]: initVrvParent,
  [ParentHosts.ZORO]: initZoroParent,
  [ParentHosts.NINE_ANIME_1]: init9animeParent,
  [ParentHosts.NINE_ANIME_2]: init9animeParent,
  [ParentHosts.NINE_ANIME_3]: init9animeParent,
  [ParentHosts.NINE_ANIME_4]: init9animeParent,
  [ParentHosts.ANIMEFLIX]: initAnimeflixParent,
};

function initParent() {
  for (const pattern in services) {
    if (urlPatternMatch(pattern, window.location)) {
      const initServiceParent = services[pattern as ParentHosts];
      initServiceParent();
      return;
    }
  }
}

try {
  loadedLog('service-parent.cs.ts');
  initParent();
} catch (err) {
  error(err);
}
