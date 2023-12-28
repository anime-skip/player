import {
  PlayerOptions,
  PlayerVisibility,
  createPlayer,
} from '@anime-skip/player';
import { ContentScriptContext } from 'wxt/client';

export function initExtensionPlayer(options: ExtensionPlayerOptions): void {
  logger.log(`Mounted ${options.serviceName} player`);
  const isDev = import.meta.env.MODE === 'development';

  initKeyboardShortcutReciever(options.ctx);

  const player = createPlayer({
    storage: createExtensionPlayerStorage(),
    apiClientId: CLIENT_ID,
    apiUrl: isDev ? TEST_API_URL : PROD_API_URL,
    getEpisodeInfo() {
      // Send messsage to background
      return messaging.sendMessage('getEpisodeInfoFromHelper', undefined);
    },
    onVisibilityChange(visiblity) {
      const isVisible = visiblity === PlayerVisibility.Visible;

      if (isVisible) {
        document.documentElement.setAttribute('anime-skip-visible', '');
      } else {
        document.documentElement.removeAttribute('anime-skip-visible');
      }
    },
    async getEpisodeUrl() {
      const { url } = await messaging.sendMessage('getSenderTab', undefined);
      if (url == null) throw Error("Could not find episode's URL");

      return options.transformServiceUrl(url);
    },
    ...options,
  });
  player.mount(options.parentElement);

  options.ctx.onInvalidated(() => player.unmount());
}

export interface ExtensionPlayerOptions
  extends Omit<PlayerOptions, 'apiClientId' | 'apiUrl' | 'storage'> {
  ctx: ContentScriptContext;
  parentElement: string | Element;
  transformServiceUrl(url: string): string;
  isDisabled(): boolean;
}
