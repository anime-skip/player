chrome.runtime.onInstalled.addListener(() => {
  // chrome.declarativeContent.onPageChanged.removeRules(
  //   undefined,
  //   () => {
  //     chrome.declarativeContent.onPageChanged.addRules([{
  //       conditions: [
  //         new chrome.declarativeContent.PageStateMatcher({
  //           pageUrl: { hostEquals: 'vrv.co' },
  //         }),
  //       ],
  //       actions: [
  //         new chrome.declarativeContent.ShowPageAction()
  //       ],
  //     }]);
  //   });
});
