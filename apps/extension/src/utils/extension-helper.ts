import { PlayerOptions } from '@anime-skip/player';
import type { ContentScriptContext } from 'wxt/client';

export function initExtensionHelper(options: HelperOptions) {
  initKeyboardShortcutForwarder(options.ctx);
  messaging.onMessage('getEpisodeInfoFromHelper', () =>
    options.getEpisodeInfo(),
  );
}

export interface HelperOptions {
  ctx: ContentScriptContext;
  getEpisodeInfo: NonNullable<PlayerOptions['getEpisodeInfo']>;
}
