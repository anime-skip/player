import browser, { Menus, Tabs } from 'webextension-polyfill';
import { error, loadedLog, log } from '~/common/utils/log';
import Messenger from '~/common/utils/Messenger';
import { ScreenshotDetails } from '~types';

const MENU_ITEM_SCREENSHOT = 'screenshot';

// @ts-expect-error: Untyped API?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OC = OffscreenCanvas as any;

const dataUrlToBlob = (dataUrl: string) => fetch(dataUrl).then(res => res.blob());
function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = _e => resolve(reader.result as string);
    reader.onerror = _e => reject(reader.error);
    reader.onabort = _e => reject(new Error('Read aborted'));
    reader.readAsDataURL(blob);
  });
}

export function initContextMenu() {
  loadedLog('background/context-menu.ts');

  const messenger = new Messenger<
    ContextMenuMessageTypes,
    ContextMenuMessageListenerMap,
    ContextMenuMessagePayloadMap,
    ContextMenuMessageResponseMap
  >('context-menu', {
    '@anime-skip/setup-context-menu': async () =>
      menuItems.forEach(item => {
        browser.contextMenus.create(item, () => {
          const err = browser.runtime.lastError;
          if (err && err.message !== `Cannot create item with duplicate id ${item.id}`) {
            error(err);
          }
        });
      }),
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
    return new Promise(function (res, rej) {
      if (typeof createImageBitmap !== 'undefined' && typeof OC !== 'undefined') {
        dataUrlToBlob(data)
          .then(async blob => {
            const img = await createImageBitmap(blob);
            const canvas = new OC(newWidth, newHeight);
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, -x, -y);
            const outputBlob = await canvas.convertToBlob({ type: 'image/png' });
            const url = await blobToDataURL(outputBlob);
            res(url);
          })
          .catch(rej);
      } else if (typeof document !== 'undefined') {
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
      } else {
        error(
          'Cannot take screenshot: document or createImageBitmap and OffscreenCanvas are not defined'
        );
      }
    });
  }

  const menuItems: Menus.CreateCreatePropertiesType[] = [
    {
      title: 'Take Screenshot',
      contexts: ['all', 'frame'],
      id: MENU_ITEM_SCREENSHOT,
    },
  ];

  browser.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
      case MENU_ITEM_SCREENSHOT:
        screenshot(info, tab);
        break;
    }
  });
}
