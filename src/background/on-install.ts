import { browser } from 'webextension-polyfill-ts';
import { loadedLog } from '~/common/utils/loadedLog';

loadedLog('background/on-install.ts');

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed');
});
