import { initStoreReviewPrompt } from '~/common/state/store-review-prompt';
import { error, loadedLog } from '~/common/utils/log';
import { initChromePageAction } from './chrome-page-action';
import { initContextMenu } from './context-menu';
import { initMessenger } from './messenger';
import { initMetrics } from './metrics';
import { initTabChange } from './tab-change';

function init() {
  initMessenger();
  initMetrics();
  initContextMenu();
  initTabChange();
  if (TARGET_BROWSER === 'chrome') initChromePageAction();

  initStoreReviewPrompt();
}

try {
  loadedLog('background/index.ts');
  init();
} catch (err) {
  error(err);
}
