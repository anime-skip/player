export default defineBackground(() => {
  messaging.onMessage('getSenderTab', async ({ sender }) => {
    return sender.tab!;
  });

  messaging.onMessage('getEpisodeInfoFromHelper', ({ sender }) => {
    // Send the message back to the tab, asking the helper to get the episode info
    return messaging.sendMessage(
      'getEpisodeInfoFromHelper',
      undefined,
      sender.tab?.id,
    );
  });
});
