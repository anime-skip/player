import Browser from 'webextension-polyfill';

Browser.storage.local.clear();

Browser.runtime.onInstalled.addListener(({ reason }) => {
  Browser.contextMenus.create({
    title: 'Anime Skip: Grab Dom',
  });
});

Browser.contextMenus.onClicked.addListener(() => {
  Browser.tabs.create({
    url: Browser.runtime.getURL('/inspector.html'),
    active: true,
  });
});
