import { ElementOption, InternalPlayerOptions, PlayerOptions } from './options';
import { createApp } from 'vue';
import Player from './components/Player.vue';
import { createLocalPlayerStorage } from './utils/createLocalPlayerStorage';
import { InjectionKey } from './utils/InjectionKey';
import playerStyles from './assets/tailwind.css?inline';
import { createTypedStorage } from './utils/createTypedStorage';
import { VueQueryPlugin } from 'vue-query';
import { stripHashAndQuery } from './utils/url-utils';

export function createPlayer(options?: PlayerOptions): AnimeSkipPlayer {
  const internalOptions = getInternalOptions(options);
  const app = createApp(Player)
    .provide(InjectionKey.PlayerOptions, internalOptions)
    .use(VueQueryPlugin);

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
      if (document.querySelector(tag) != null) return;

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
    },
    unmount() {
      app.unmount();
    },
  };
}

/**
 * Object used to interact with the Anime Skip Player.
 */
export interface AnimeSkipPlayer {
  /**
   * Mounts the player as a child of the provided root node.
   *
   * > This method can be called multiple times for a single `AnimeSkipPlayer` instance if the UI is
   * > deleted from the DOM.
   *
   * @param rootContainer The query selector or node parent that the player will be appended to.
   */
  mount(rootContainer: string | Element): void;
  /**
   * Removes the player from the DOM.
   */
  unmount(): void;
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
      const element = resolveElement(options?.video, 'body');

      if (element == null) {
        console.error('options.video:', element);
        throw Error(
          `options.video resoled to ${element}, but it must be a VIDEO element`,
        );
      }

      return element as HTMLVideoElement;
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
  };
}
