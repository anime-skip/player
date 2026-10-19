import type { PlayerOptions } from '@anime-skip/player';

import type { ContentScriptContext } from '#imports';

export function initExtensionHelper(options: HelperOptions) {
  initKeyboardShortcutForwarder(options.ctx);
  messaging.onMessage('getEpisodeInfoFromHelper', () =>
    options.getEpisodeInfo(),
  );
  messaging.onMessage('getServiceSegmentsFromHelper', async () => {
    try {
      return (await options.getServiceSegments?.()) ?? [];
    } catch (err) {
      logger.warn('Failed to get service segments', err);
      return [];
    }
  });
  messaging.onMessage('getTopFrameUrl', () => location.href);
}

export interface HelperOptions {
  ctx: ContentScriptContext;
  getEpisodeInfo: NonNullable<PlayerOptions['getEpisodeInfo']>;
  /**
   * Return the segments (intro, credits, etc) the streaming service itself
   * knows about. Runs in the top frame, where the page's URL and cookies are
   * available.
   */
  getServiceSegments?: NonNullable<PlayerOptions['getServiceSegments']>;
}
