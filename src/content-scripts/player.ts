import { PlayerHosts } from '~/common/utils/CompileTimeConstants';
import { error, loadedLog } from '~/common/utils/log';
import { urlPatternMatch } from '~/common/utils/strings';
import { initKeyboardShortcutBlocker } from './misc/keyboard-shortcut-blocker';
import { initVideoChangeWatcher } from './misc/video-changed-watcher';
import { loadPlayerUi } from './player/index';
import { initCrunchyrollPlayer } from './services/crunchyroll/player';
import { initFunimation20210926Player } from './services/funimation-2021-09-26/player';
import { initFunimationPlayer } from './services/funimation/player';
import { initTestServicePlayer } from './services/test-service/player';
import { initVrvPlayer } from './services/vrv/player';

const services: Record<PlayerHosts, () => void> = {
  [PlayerHosts.CRUNCHYROLL]: initCrunchyrollPlayer,
  [PlayerHosts.FUNIMATION_20210926]: initFunimation20210926Player,
  [PlayerHosts.FUNIMATION]: initFunimationPlayer,
  [PlayerHosts.VRV]: initVrvPlayer,
  [PlayerHosts.TEST_SERVICE]: initTestServicePlayer,
};

function init() {
  for (const pattern in services) {
    if (urlPatternMatch(pattern, window.location)) {
      const initServicePlayer = services[pattern as PlayerHosts];
      initKeyboardShortcutBlocker();
      initVideoChangeWatcher();
      initServicePlayer();
      loadPlayerUi();
      return;
    }
  }
}

try {
  loadedLog('content-scripts/player.ts');
  init();
} catch (err) {
  error(err);
}
