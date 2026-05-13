import { PlayerOptions } from '@anime-skip/player';

import type { ContentScriptContext } from '#imports';

export function initExtensionHelper(options: HelperOptions) {
  initKeyboardShortcutForwarder(options.ctx);
  messaging.onMessage('getEpisodeInfoFromHelper', () =>
    options.getEpisodeInfo(),
  );
  messaging.onMessage('getTopFrameUrl', () => location.href);
}

export interface HelperOptions {
  ctx: ContentScriptContext;
  getEpisodeInfo: NonNullable<PlayerOptions['getEpisodeInfo']>;
}
