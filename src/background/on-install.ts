import browser from 'webextension-polyfill';
import { loadedLog } from '~/common/utils/loadedLog';
import UsageStats from '~/common/utils/UsageStats';

loadedLog('background/on-install.ts');

browser.runtime.onInstalled.addListener(() => {
  UsageStats.saveEvent('extension_installed');
});
