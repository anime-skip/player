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

async function screenshot(_info: Menus.OnClickData, tab?: Tabs.Tab) {
  console.log('Taking screenshot');
  try {
    // Get size & position for cropping
    const iframeBounds: ScreenshotDetails = await messenger.send(
      '@anime-skip/parent-screenshot-details',
      undefined,
      tab?.id
    );
    const videoBounds: ScreenshotDetails = await messenger.send(
      '@anime-skip/player-screenshot-details',
      undefined,
      tab?.id
    );
    const x = iframeBounds.left + videoBounds.left;
    const y = iframeBounds.top + videoBounds.top;
    const width = videoBounds.width;
    const height = videoBounds.height;
    console.log({ iframeBounds, videoBounds, x, y, width, height });

    if (width == 0 || height == 0) throw Error(`Video dimension was 0 (w=${width}, h=${height})`);

    // Take screenshot
    const data = await browser.tabs.captureVisibleTab(tab?.windowId, {
      format: 'png',
      rect: { height, width, x, y },
    });
    await browser.storage.local.set({ screenshot: data });
    await sleep(200); // TODO: Double check that this is needed for some reason
  } catch (err) {
    console.error(err);
    throw err;
  }
}

const menuItems: Menus.CreateCreatePropertiesType[] = [
  {
    title: 'Take Screenshot',
    contexts: ['all'],
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
