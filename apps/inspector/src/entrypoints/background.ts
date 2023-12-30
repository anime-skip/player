import { NetworkRequest } from '@/utils/network-repo';

export default defineBackground(() => {
  browser.action.onClicked.addListener(openInspector);

  const menuItemId = 'inspect';
  browser.contextMenus.create({
    id: menuItemId,
    title: 'Open Inspector',
  });
  browser.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === menuItemId) openInspector();
  });

  const idb = openIdb();
  const networkRepo = createIdbNetworkRepo(idb);
  messaging.onMessage('saveNetworkRequest', async ({ sender, data }) => {
    const tabId = sender.tab?.id;
    const frameId = sender.frameId;
    if (tabId == null || frameId == null) return;

    const request: NetworkRequest = {
      ...data,
      tabId,
      frameId,
    };
    console.log('Saving network request', request);
    await networkRepo.upsert(request);
  });

  messaging.onMessage('listNetworkRequests', () => networkRepo.list());
  messaging.onMessage('getNetworkRequest', ({ data: id }) =>
    networkRepo.get(id),
  );
  messaging.onMessage('getTabs', async () => {
    const tabs = await browser.tabs.query({});
    return Promise.all(
      tabs.map(async (tab) => {
        const frames =
          tab.id == null
            ? []
            : (await browser.webNavigation.getAllFrames({ tabId: tab.id })) ??
              [];
        return {
          tab,
          frames,
        };
      }),
    );
  });

  messaging.onMessage('getFrameBodyInnerHtml', async ({ data }) => {
    return await messaging.sendMessage(
      'getFrameBodyInnerHtml',
      data,
      data.tabId,
    );
  });
  messaging.onMessage('getFrameHtml', async ({ data }) => {
    return await messaging.sendMessage('getFrameHtml', data, data.tabId);
  });
});

async function openInspector() {
  const position = await windowPosition.getValue();
  const url = browser.runtime.getURL('/inspector.html');

  const exsitingWindows = await browser.windows.getAll({});
  const windowsAndTabs = await Promise.all(
    exsitingWindows.map(async (win) => ({
      window: win,
      tabs: await browser.tabs.query({ windowId: win.id }),
    })),
  );
  const existingInspector = windowsAndTabs.find(({ tabs }) =>
    tabs.find(
      (tab) => tab.url?.startsWith(url) || tab.pendingUrl?.startsWith(url),
    ),
  );

  if (existingInspector?.window.id != null) {
    await browser.windows.update(existingInspector.window.id, {
      focused: true,
    });
  } else {
    await browser.windows.create({
      url: url,
      type: 'panel',
      ...position,
    });
  }
}
