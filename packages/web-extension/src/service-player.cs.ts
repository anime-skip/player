import { setup9animePlayer } from '~/modules/9anime/player';
import { initCrunchyrollPlayer } from '~/modules/crunchyroll/player';
import { initFunimation20210926Player } from '~/modules/funimation-2021-09-26/player';
import { initFunimationPlayer } from '~/modules/funimation/player';
import { mountPlayerUi } from '@anime-skip/player-ui';
import { initTestServicePlayer } from '~/modules/test-service/player';
import { initVrvPlayer } from '~/modules/vrv/player';
import { setupZoroPlayer } from '~/modules/zoro/player';
import { PlayerHosts } from '~/utils/compile-time-constants';
import { error, loadedLog } from '~/utils/log';
import { urlPatternMatch } from '~/utils/strings';
import { ExternalPlayerConfig, PlayerStorage } from '~types';
import { DAYS, SECONDS, sleep, today } from '~utils/time';
import {
  getDontShowStoreReviewPromptAgain,
  getStoreReviewPromptAt,
  setStoreReviewPromptAt,
} from '@anime-skip/player-ui/src/stores/store-review-prompt';
import Browser from 'webextension-polyfill';

const services: Record<PlayerHosts, () => ExternalPlayerConfig> = {
  [PlayerHosts.CRUNCHYROLL]: initCrunchyrollPlayer,
  [PlayerHosts.FUNIMATION_20210926]: initFunimation20210926Player,
  [PlayerHosts.FUNIMATION]: initFunimationPlayer,
  [PlayerHosts.VRV]: initVrvPlayer,
  [PlayerHosts.ZORO]: setupZoroPlayer,
  [PlayerHosts.ZORO_2]: setupZoroPlayer,
  [PlayerHosts.TEST_SERVICE]: initTestServicePlayer,
  [PlayerHosts.NINE_ANIME]: setup9animePlayer,
};

function initService(service: PlayerHosts) {
  const playerConfig = services[service]();
  initStoreReviewPrompt(playerConfig.storage);
  return mountPlayerUi(playerConfig);
}

function initStoreReviewPrompt(storage: PlayerStorage) {
  // Initialize for new users, NEEDS TO BE BEFORE FIRST AWAIT so it adds the listener synchronously
  Browser.runtime.onInstalled.addListener(async () => {
    await setStoreReviewPromptAt(storage, today() + DAYS(3));
  });

  // Initialize for existing users
  (async () => {
    const dontPrompt = await getDontShowStoreReviewPromptAgain(storage);
    if (dontPrompt) return undefined;
    const currentDate = await getStoreReviewPromptAt(storage);
    if (currentDate == null) {
      await sleep(SECONDS(10));
      await setStoreReviewPromptAt(storage, today() + DAYS(1));
    }
  })();
}

try {
  loadedLog('service-player.cs.ts');

  for (const pattern in services) {
    if (urlPatternMatch(pattern, window.location)) {
      initService(pattern as PlayerHosts);
      break;
    }
  }
} catch (err) {
  error(err);
}
