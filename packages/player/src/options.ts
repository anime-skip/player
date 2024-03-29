import { PlayerVisibility } from './utils/PlayerVisibility';
import { ColorTheme } from './utils/api';
import type { TypedStorage } from './utils/createTypedStorage';

export interface PlayerOptions {
  /**
   * The streaming service's name, shown above the episode info. Whitespace is trimmed.
   *
   * If not passed, it is not shown.
   */
  serviceName?: string;
  /**
   * The color theme to use when the user choose "dynamic" theme.
   */
  serviceTheme?: ColorTheme;
  /**
   * Storage implementation that the player should use.
   *
   * Defaults to a `localStorage` based implementation returned by `createLocalPlayerStorage`
   */
  storage?: IPlayerStorage;
  /**
   * A video element, a query selector to one, or a fucntion that returns one of those. Used to get
   * a reference to the video to control it (play, pause, volume, etc).
   *
   * Defaults to `"video"`, a query selector that selects the first video in the DOM.
   */
  video?: ElementOption;
  /**
   * Returns the element the fullscreen button should use.
   *
   * Defaults to `"body"`, making the entire body fullscreen.
   */
  fullscreenElement?: ElementOption;
  /**
   * Returns information about the current episode and show. You don't need to trim any strings,
   * they will be trimmed automatically. Empty strings will be transformed to `undefined` as well.
   *
   * Defaults to a function returning an empty object: `() => ({})`
   */
  getEpisodeInfo?: () => MaybePromise<{
    showName?: string | null;
    season?: string | null;
    episodeName?: string | null;
    number?: string | null;
    absoluteNumber?: string | null;
  }>;
  /**
   * The full API url that ends with /graphql.
   *
   * Defaults to the production API: "https://api.anime-skip.com/graphql"
   */
  apiUrl?: string;
  /**
   * Your app's client id. See https://anime-skip.com/docs/api for more details.
   *
   * Defaults to the shared, heavily rate limited client id: "ZGfO0sMF3eCwLYf8yMSCJjlynwNGRXWE"
   */
  apiClientId?: string;
  /**
   * Return a string representation that should be used when looking up the episode by
   * episode URL on the Anime Skip API.
   *
   * The resulting string should be a valid URL, and contain the minimum information necessary to be
   * unique per episode watched. If you are inside an iframe, it should return the parent page's URL
   * as seen from the search bar.
   *
   * By default, it will simply strip out the query parameters and hash from `location.href`,
   * leaving just the "protocol://host/path".
   */
  getEpisodeUrl?: () => MaybePromise<string>;

  /**
   * An optional callback that is executed when the player's visibility changes.
   *
   * Does nothing if not passed.
   */
  onVisibilityChange?: OnVisibilityChangeCallback;

  /**
   * Given some bounds, return a URL to the screenshot (usuaslly a base64 encoded data URL).
   */
  takeScreenshot?: (bounds: ScreenshotBounds) => Promise<string>;

  /**
   * When true, don't show a custom context menu when right-clicking.
   */
  disableContextMenu?: boolean;
}

export interface InternalPlayerOptions {
  serviceName: string | undefined;
  serviceTheme: ColorTheme | undefined;
  storage: TypedStorage;
  video: () => HTMLVideoElement;
  getEpisodeInfo: () => MaybePromise<InferredEpisodeInfo>;
  fullscreenElement: () => HTMLElement;
  apiUrl: string;
  apiClientId: string;
  getEpisodeUrl: () => MaybePromise<string>;
  onVisibilityChange: OnVisibilityChangeCallback | undefined;
  takeScreenshot: false | ((bounds: ScreenshotBounds) => Promise<string>);
  disableContextMenu: boolean;
}

export interface InferredEpisodeInfo {
  showName?: string;
  season?: string;
  episodeName?: string;
  number?: string;
  absoluteNumber?: string;
}

export type ElementOption = string | Element | (() => string | Element);

export type OnVisibilityChangeCallback = (
  newVisibility: PlayerVisibility,
  oldVisibility: PlayerVisibility,
) => void;

export interface ScreenshotBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}
/**
 * Storage implementation used by the player.
 */
export interface IPlayerStorage {
  /**
   * Get a single item for a given key from storage.
   */
  getItem: (key: string) => MaybePromise<any | null>;
  /**
   * Sets a single item in storage for the given key and value.
   *
   * Setting the value to `null` or `undefined` will set the value to `null`, same as if calling
   * `removeItem`.
   */
  setItem: (key: string, value: any) => MaybePromise<void>;
  /**
   * Removes a single item from storage.
   */
  removeItem: (key: string) => MaybePromise<void>;
  /**
   * Clear all items from storage.
   */
  clear: () => MaybePromise<void>;
}

/**
 * Callback executed when a value in storage is changed.
 */
export type StorageChangedCallback = (
  newValue: any | null,
  oldValue: any | null,
) => MaybePromise<void>;

/**
 * Call to remove the storage change listener.
 */
export type RemoveStorageListenerFn = () => void;

/**
 * Interface for interacting with the Anime Skip API.
 */
export interface IApiService {}

type MaybePromise<T> = T | Promise<T>;
