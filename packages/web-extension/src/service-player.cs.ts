import { PlayerHosts } from '~/common/utils/compile-time-constants';
import { error, loadedLog } from '~/common/utils/log';
import { urlPatternMatch } from '~/common/utils/strings';
import { IPlayerConfig } from '~types';
import { loadPlayerUi } from './player/index';
import { setup9animePlayer } from './services/9anime/player';
import { initCrunchyrollPlayer } from './services/crunchyroll/player';
import { initFunimation20210926Player } from './services/funimation-2021-09-26/player';
import { initFunimationPlayer } from './services/funimation/player';
import { initTestServicePlayer } from './services/test-service/player';
import { initVrvPlayer } from './services/vrv/player';
import { setupZoroPlayer } from './services/zoro/player';

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
