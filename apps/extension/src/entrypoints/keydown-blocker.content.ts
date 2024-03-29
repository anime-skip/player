import { forwardKeydownEvent } from '@anime-skip/player';

/**
 * Stop all keydown events before the website can process them, and re-dispatches them as
 * "anime-skip:keydown" for the player to handle.
 */
export default defineContentScript({
  matches: [
    // Crunchyroll
    '*://static.crunchyroll.com/vilos-v2/web/vilos/player.html',
    // Aniwave (9anime)
    '*://mcloud.bz/e/*',
    '*://www.mp4upload.com/embed-*',
    '*://vidplay.online/e/*',
    // Aniwatch (Zoro)
    '*://megacloud.tv/e/embed-*',
    '*://watchsb.com/e/*',
  ],
  runAt: 'document_start',
  allFrames: true,

  main(ctx) {
    logger.log('Blocking keydown events at', location.href);
    ctx.addEventListener(
      window,
      'keydown',
      (event) => {
        const activeTag = document.activeElement?.tagName;
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

        event.stopPropagation();
        forwardKeydownEvent(event);
      },
      {
        // Run this listener before any others in the tree, without this the stopPropogation call is
        // executed AFTER the page's keydown listener has already ran
        capture: true,
      },
    );
  },
});
