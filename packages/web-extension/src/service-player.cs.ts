import { setup9animePlayer } from '~/modules/9anime/player';
import { initCrunchyrollPlayer } from '~/modules/crunchyroll/player';
import { initFunimation20210926Player } from '~/modules/funimation-2021-09-26/player';
import { initFunimationPlayer } from '~/modules/funimation/player';
import { loadPlayerUi } from '~/modules/player';
import { initTestServicePlayer } from '~/modules/test-service/player';
import { initVrvPlayer } from '~/modules/vrv/player';
import { setupZoroPlayer } from '~/modules/zoro/player';
import { PlayerHosts } from '~/utils/compile-time-constants';
import { error, loadedLog } from '~/utils/log';
import { urlPatternMatch } from '~/utils/strings';
import { IPlayerConfig } from '~types';

const services: Record<PlayerHosts, () => IPlayerConfig> = {
  [PlayerHosts.CRUNCHYROLL]: initCrunchyrollPlayer,
  [PlayerHosts.FUNIMATION_20210926]: initFunimation20210926Player,
  [PlayerHosts.FUNIMATION]: initFunimationPlayer,
  [PlayerHosts.VRV]: initVrvPlayer,
  [PlayerHosts.ZORO]: setupZoroPlayer,
  [PlayerHosts.TEST_SERVICE]: initTestServicePlayer,
  [PlayerHosts.NINE_ANIME]: setup9animePlayer,
};

function init() {
  for (const pattern in services) {
    if (urlPatternMatch(pattern, window.location)) {
      const playerConfig = services[pattern as PlayerHosts]();
      return loadPlayerUi(playerConfig);
    }
  }
}

try {
  loadedLog('content-scripts/player.ts');
  init();
} catch (err) {
  error(err);
}
