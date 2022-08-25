import { initContextMenu } from '~/scripts/context-menu';
import { initMessenger } from '~/scripts/messenger';
import { initMetrics } from '~/scripts/metrics';
import { initPageAction } from '~/scripts/page-action';
import { initTabChange } from '~/scripts/tab-change';
import { initStoreReviewPrompt } from './scripts/store-review-prompt';
import { error, loadedLog } from '~/utils/log';

function init() {
  initMessenger();
  initMetrics();
  initContextMenu();
  initTabChange();
  initPageAction();
  initStoreReviewPrompt();
}

try {
  loadedLog('background.ts');
  init();
} catch (err) {
  error(err);
}
