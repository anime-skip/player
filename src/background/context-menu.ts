import browser, { Menus, Tabs } from 'webextension-polyfill';
import { error, loadedLog, log } from '~/common/utils/log';
import Messenger from '~/common/utils/Messenger';

const MENU_ITEM_SCREENSHOT = 'screenshot';

export function initContextMenu() {
  loadedLog('background/context-menu.ts');

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
    log('Taking screenshot');
    try {
      await messenger.send('@anime-skip/start-screenshot', undefined, tab?.id);
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
      log({ iframeBounds, videoBounds, x, y, width, height });

      if (width == 0 || height == 0) throw Error(`Video dimension was 0 (w=${width}, h=${height})`);

      // Take screenshot
      const data = await browser.tabs.captureVisibleTab(tab?.windowId, {
        format: 'png',
      });
      const cropped = await cropDataUrl(data, x, y, width, height);
      log('saved screenshot');
      log('cropped:', cropped.length);
      log('full:', data.length);
      await browser.storage.local.set({ screenshot: cropped });
    } catch (err) {
      error(err);
      throw err;
    } finally {
      await messenger.send('@anime-skip/stop-screenshot', undefined, tab?.id);
    }
  }

  function cropDataUrl(
    data: string,
    x: number,
    y: number,
    newWidth: number,
    newHeight: number
  ): Promise<string> {
    return new Promise(function (res) {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx?.drawImage(img, -x, -y);
        const dataURI = canvas.toDataURL();
        res(dataURI);
      };
      img.src = data;
    });
  }

  const menuItems: Menus.CreateCreatePropertiesType[] = [
    {
      title: 'Take Screenshot',
      contexts: ['all', 'frame'],
      id: MENU_ITEM_SCREENSHOT,
      onclick: screenshot,
    },
  ];

  if (TARGET_BROWSER === 'firefox') {
    browser.contextMenus.onClicked.addListener((info, tab) => {
      switch (info.menuItemId) {
        case MENU_ITEM_SCREENSHOT:
          screenshot(info, tab);
          break;
      }
    });
  }
}
