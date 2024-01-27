import { PlayerVisibility } from '@anime-skip/player';

export default defineBackground(() => {
  messaging.onMessage('getTopFrameUrl', async ({ sender, data }) => {
    return messaging.sendMessage('getTopFrameUrl', data, sender.tab?.id);
  });

  messaging.onMessage('getEpisodeInfoFromHelper', ({ sender }) => {
    // Send the message back to the tab, asking the helper to get the episode info
    return messaging.sendMessage(
      'getEpisodeInfoFromHelper',
      undefined,
      sender.tab?.id,
    );
  });

  // Setup screenshot process
  browser.contextMenus.create({
    id: 'screenshot',
    title: 'Take Screenshot',
  });
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    try {
      await messaging.sendMessage(
        'setPlayerVisibility',
        PlayerVisibility.Hidden,
        tab?.id,
      );
      const res = await browser.tabs.captureVisibleTab(tab?.windowId, {
        format: 'jpeg',
        quality: 100,
      });
      await messaging.sendMessage('sendScreenshot', res, tab?.id);
    } finally {
      await messaging.sendMessage(
        'setPlayerVisibility',
        PlayerVisibility.Visible,
        tab?.id,
      );
    }
  });

  // messaging.onMessage('takeScreenshot', async ({ data: bounds }) => {
  //   const full = await browser.tabs.captureVisibleTab(undefined, {
  //     format: 'jpeg',
  //     quality: 100,
  //     // rect: bounds,
  //   });
  //   return full;
  // });
});
