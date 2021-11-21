import { ParentHosts } from '~/common/utils/CompileTimeConstants';
import { loadedLog } from '~/common/utils/loadedLog';
import { urlPatternMatch } from '~/common/utils/strings';
import { initAnimeSkipParent } from './anime-skip';
import { initCrunchyrollParent } from './services/crunchyroll/parent';
import { initFunimation20210926Parent } from './services/funimation-2021-09-26/parent';
import { initFunimationParent } from './services/funimation/parent';
import { initTestServiceParent } from './services/test-service/parent';
import { initVrvParent } from './services/vrv/parent';

const services: Record<string, () => void> = {
  [ParentHosts.ANIME_SKIP]: initAnimeSkipParent,
  [ParentHosts.ANIME_SKIP_WWW]: initAnimeSkipParent,
  [ParentHosts.CRUNCHYROLL_BETA]: initCrunchyrollParent,
  [ParentHosts.CRUNCHYROLL]: initCrunchyrollParent,
  [ParentHosts.FUNIMATION_20210926]: initFunimation20210926Parent,
  [ParentHosts.FUNIMATION]: initFunimationParent,
  [ParentHosts.TEST_SERVICE]: initTestServiceParent,
  [ParentHosts.VRV]: initVrvParent,
};

function initParent() {
  for (const pattern in services) {
    if (urlPatternMatch(pattern, window.location)) {
      return services[pattern]?.();
    }
  }
  console.warn('No parent injected');
}

try {
  loadedLog('content-scripts/parent.ts');
  initParent();
} catch (err) {
  console.error(err);
}
