import { browser, Menus, Tabs } from 'webextension-polyfill-ts';
import Browser from '~/common/utils/Browser';
import { sleep } from '~/common/utils/EventLoop';
import { loadedLog } from '~/common/utils/loadedLog';
import Messenger from '~/common/utils/Messenger';

loadedLog('background/context-menu.ts');

const MENU_ITEM_SCREENSHOT = 'screenshot';

const messenger = new Messenger<
  ContextMenuMessageTypes,
  ContextMenuMessageListenerMap,
  ContextMenuMessagePayloadMap,
  ContextMenuMessageResponseMap
>('context-menu', {
  '@anime-skip/setup-context-menu': async () =>
    menuItems.forEach(item => browser.contextMenus.create(item)),
  '@anime-skip/remove-context-menu': async () => browser.contextMenus.removeAll(),
});

async function screenshot(info: Menus.OnClickData, tab?: Tabs.Tab) {
  console.log('Taking screenshot');
  try {
    // Get size & position for cropping
    // const parentSize = await messenger.send('@anime-skip/parent-screenshot-details');
    // const iframeSize = await messenger.send('@anime-skip/player-screenshot-details');

    // Take screenshot
    console.log(Object.keys(browser.tabs));
    const data = await browser.tabs.captureVisibleTab(tab?.windowId, { format: 'png' });

    // Save it
    await browser.storage.local.set({ screenshot: data });
    await sleep(200);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

const menuItems: Menus.CreateCreatePropertiesType[] = [
  {
    title: 'Take Screenshot',
    contexts: ['frame'],
    id: MENU_ITEM_SCREENSHOT,
    onclick: screenshot,
  },
];

if (Browser.detect() === 'firefox') {
  browser.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
      case MENU_ITEM_SCREENSHOT:
        screenshot(info, tab);
        break;
    }
  });
}
