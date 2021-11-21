import { loadedLog } from '~/common/utils/loadedLog';
import { urlPatternMatch } from '~/common/utils/strings';
import { initCrunchyrollParent } from './services/crunchyroll/parent';
import { initFunimation20210926Parent } from './services/funimation-2021-09-26/parent';
import { initFunimationParent } from './services/funimation/parent';
import { initTestServiceParent } from './services/test-service/parent';
import { initVrvParent } from './services/vrv/parent';

const services: Record<string, () => void> = {
  'https://www.crunchyroll.com/*': initCrunchyrollParent,
  'https://beta.crunchyroll.com/*': initCrunchyrollParent,
  'https://www.funimation.com/*/shows/*': initFunimationParent,
  'https://www.funimation.com/v/*': initFunimation20210926Parent,
  'https://vrv.co/*': initVrvParent,
  'http://localhost/*': initTestServiceParent,
};

function initParent() {
  for (const pattern in services) {
    if (urlPatternMatch(pattern, window.location)) {
      return services[pattern]?.();
    }
  }
}

try {
  loadedLog('content-scripts/parent.ts');
  initParent();
} catch (err) {
  console.error(err);
}
