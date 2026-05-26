import { createApp } from 'vue';
import { QueryClient, VueQueryPlugin } from 'vue-query';

import Player from './components/Player.vue';
import { ElementOption, InternalPlayerOptions, PlayerOptions } from './options';
import { createLocalPlayerStorage } from './utils/createLocalPlayerStorage';
import { createTypedStorage } from './utils/createTypedStorage';
import { InjectionKey } from './utils/InjectionKey';
import { PlayerEvent } from './utils/PlayerEvent';
import { PlayerVisibility } from './utils/PlayerVisibility';
import { stripHashAndQuery } from './utils/url-utils';

import playerStyles from './assets/tailwind.css?inline';

export function createPlayer(options?: PlayerOptions): AnimeSkipPlayer {
  const internalOptions = getInternalOptions(options);

  const queryClient = new QueryClient();

  const app = createApp(Player)
    .provide(InjectionKey.PlayerOptions, internalOptions)
    .use(VueQueryPlugin, { queryClient });

  // const playerCss = window.animeSkipPlayerCss ?? '/* Anime Skip Player styles missing... */';
  // delete window.animeSkipPlayerCss;
  const playerCss = playerStyles;

  return {
    async mount(rootContainer) {
      // Setup the root container
      const rootElement =
        typeof rootContainer == 'string'
          ? document.querySelector(rootContainer)
          : rootContainer;
      if (rootElement == null)
        throw Error(
          'Cannot mount Anime Skip Player. Root container not found in DOM',
        );

      // Don't do anything if it's already mounted
      const tag = 'anime-skip-player';
      if (document.querySelector(tag) != null) {
        console.log('Anime skip player already mounted, skipping');
        return;
      }

      // Create the ShadowRoot
      const shadowElement = document.createElement(tag);
      const shadow = shadowElement.attachShadow({ mode: 'closed' });
      shadowElement.style.position = 'absolute';
      shadowElement.style.inset = '0';
      shadowElement.style.pointerEvents = 'none'; // Allow clicking through the element. Vue will capture clicks as needed
      shadowElement.style.zIndex = '9999';
      shadowElement.style.overflow = 'hidden';

      const shadowHtml = document.createElement('html');
      shadowHtml.style.width = '100%';
      shadowHtml.style.height = '100%';
      shadowHtml.style.backgroundColor = 'transparent';

      // Add the player styles into the shadow's DOM
      const shadowStyle = document.createElement('style');
      shadowStyle.appendChild(document.createTextNode(playerCss));
      shadowHtml.appendChild(shadowStyle);

      // Mount the Vue app inside the ShadowRoot
      const shadowBody = document.createElement('body');
      shadowBody.style.width = '100%';
      shadowBody.style.height = '100%';
      shadowHtml.appendChild(shadowBody);
      app.provide(InjectionKey.ShadowRoot, { shadowHtml, shadow });
      app.mount(shadowBody);

      // Add the ShadowRoot to the DOM
      shadow.append(shadowHtml);
      rootElement.appendChild(shadowElement);
      console.log('Done', { rootElement, shadow, shadowBody });
    },
    unmount() {
      queryClient.clear();
      queryClient.cancelQueries();
      queryClient.unmount();
      app.unmount();
    },
    setPlayerVisibility(visibility) {
      PlayerEvent.dispatch({
        type: 'setPlayerVisibility',
        visibility,
      });
    },
    showScreenshot(url) {
      PlayerEvent.dispatch({
        type: 'showScreenshot',
        url,
      });
    },
  };
}

/** Object used to interact with the Anime Skip Player. */
export interface AnimeSkipPlayer {
  /**
   * Mounts the player as a child of the provided root node.
   *
   * > This method can be called multiple times for a single `AnimeSkipPlayer`
   * > instance if the UI is deleted from the DOM.
   *
   * @param rootContainer The query selector or node parent that the player will
   *   be appended to.
   */
  mount(rootContainer: string | Element): void;
  /** Removes the player from the DOM. */
  unmount(): void;

  /** Change the player's UI visibility. */
  setPlayerVisibility(visibility: PlayerVisibility): void;

  /**
   * Tell the player to display a captured screenshot.
   *
   * @param url Can be a regular URL or a data URL.
   */
  showScreenshot(url: string): void;
}

function getInternalOptions(options?: PlayerOptions): InternalPlayerOptions {
  const resolveElement = <T extends Element>(
    getter: ElementOption | undefined,
    defaultQuery: string,
  ): T | undefined => {
    let value: Element | string | null;
    if (getter == null) value = document.querySelector(defaultQuery);
    else value = typeof getter === 'function' ? getter() : getter!;
    return (
      (typeof value === 'string'
        ? document.querySelector<T>(value)
        : (value as T)) || undefined
    );
  };

  return {
    serviceName: options?.serviceName?.trim(),
    serviceTheme: options?.serviceTheme,

    storage: createTypedStorage(options?.storage ?? createLocalPlayerStorage()),

    fullscreenElement: () => {
      const element = resolveElement(options?.fullscreenElement, 'body');

      if (element == null) {
        console.error('options.fullscreenElement resolved to', element);
        throw Error(
          `options.fullscreenElement resoled to ${element}, but it must exist`,
        );
      }

      return element as HTMLElement;
    },

    video: () => {
      const element = resolveElement(options?.video, 'video');

      if (element == null) {
        console.error('options.video:', element);
        throw Error(
          `options.video resoled to ${element}, but it must be a VIDEO element`,
        );
      }

      if (element.tagName !== 'VIDEO') {
        console.error('options.video:', element);
        throw Error(
          `options.video resolved to a ${element.tagName} element, but it must be a VIDEO element`,
        );
      }

      return element as HTMLVideoElement;
    },

    async getEpisodeInfo() {
      const res = (await options?.getEpisodeInfo?.()) ?? {};
      return {
        showName: res.showName?.trim() || undefined,
        season: res.season?.trim() || undefined,
        episodeName: res.episodeName?.trim() || undefined,
        number: res.number?.trim() || undefined,
        absoluteNumber: res.absoluteNumber?.trim() || undefined,
      };
    },

    apiUrl: options?.apiUrl ?? 'https://api.anime-skip.com/graphql',
    apiClientId: options?.apiClientId ?? 'ZGfO0sMF3eCwLYf8yMSCJjlynwNGRXWE',

    getEpisodeUrl:
      options?.getEpisodeUrl ?? (() => stripHashAndQuery(location.href)),

    onVisibilityChange: options?.onVisibilityChange,

    takeScreenshot: options?.takeScreenshot ?? false,

    disableContextMenu: options?.disableContextMenu ?? false,
  };
}
