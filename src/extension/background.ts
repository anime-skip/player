chrome.runtime.onInstalled.addListener(() => {
  if (browser) {
    // browser.tabs.executeScript({ file: '/js/player.js'});
  } else if (chrome) {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'vrv.co' },
          }),
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ],
      }]);
    });
  }
});
