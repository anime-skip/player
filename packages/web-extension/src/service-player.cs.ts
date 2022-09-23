import { init9animePlayer } from '~/modules/9anime/player';
import { initCrunchyrollPlayer } from '~/modules/crunchyroll/player';
import { initFunimation20210926Player } from '~/modules/funimation-2021-09-26/player';
import { initFunimationPlayer } from '~/modules/funimation/player';
import { mountPlayerUi } from '@anime-skip/player-ui';
import { initTestServicePlayer } from '~/modules/test-service/player';
import { initVrvPlayer } from '~/modules/vrv/player';
import { initZoroPlayer } from '~/modules/zoro/player';
import { PlayerHosts } from '~/utils/compile-time-constants';
import { error, loadedLog } from '~/utils/log';
import { urlPatternMatch } from '~/utils/strings';
import { ExternalPlayerConfig } from '~types';
import '~/assets/themes.scss';

const services: Record<PlayerHosts, () => ExternalPlayerConfig> = {
  [PlayerHosts.CRUNCHYROLL]: initCrunchyrollPlayer,
  [PlayerHosts.FUNIMATION_20210926]: initFunimation20210926Player,
  [PlayerHosts.FUNIMATION]: initFunimationPlayer,
  [PlayerHosts.VRV]: initVrvPlayer,
  [PlayerHosts.ZORO]: initZoroPlayer,
  [PlayerHosts.ZORO_2]: initZoroPlayer,
  [PlayerHosts.TEST_SERVICE]: initTestServicePlayer,
  [PlayerHosts.NINE_ANIME]: init9animePlayer,
  [PlayerHosts.NINE_ANIME_2]: init9animePlayer,
};

function initService(service: PlayerHosts) {
  const playerConfig = services[service]();
  return mountPlayerUi(playerConfig);
}

try {
  loadedLog('service-player.cs.ts');

  for (const pattern in services) {
    if (urlPatternMatch(pattern, window.location)) {
      initService(pattern as PlayerHosts).catch(error);
      break;
    }
  }
} catch (err) {
  error(err);
}
