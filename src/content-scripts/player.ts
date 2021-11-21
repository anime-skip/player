import { loadedLog } from '~/common/utils/loadedLog';
import { urlPatternMatch } from '~/common/utils/strings';
import { initKeyboardShortcutBlocker } from './misc/keyboard-shortcut-blocker';
import { initVideoChangeWatcher } from './misc/video-changed-watcher';
import { loadPlayerUi } from './player/index';
import { initCrunchyrollPlayer } from './services/crunchyroll/player';
import { initFunimation20210926Player } from './services/funimation-2021-09-26/player';
import { initFunimationPlayer } from './services/funimation/player';
import { initTestServicePlayer } from './services/test-service/player';
import { initVrvPlayer } from './services/vrv/player';

const services: Record<string, () => void> = {
  'https://static.crunchyroll.com/vilos-v2/web/vilos/player.html*': initCrunchyrollPlayer,
  'https://www.funimation.com/player/*': initFunimationPlayer,
  'https://www.funimation.com/v/*': initFunimation20210926Player,
  'https://static.vrv.co/*': initVrvPlayer,
  'http://localhost/*': initTestServicePlayer,
};

function init() {
  for (const pattern in services) {
    if (urlPatternMatch(pattern, window.location)) {
      const initServicePlayer = services[pattern];
      initKeyboardShortcutBlocker();
      initVideoChangeWatcher();
      initServicePlayer();
      loadPlayerUi();
      return;
    }
  }
  console.warn('Nothing injected');
}

try {
  loadedLog('content-scripts/player.ts');
  init();
} catch (err) {
  console.error(err);
}
