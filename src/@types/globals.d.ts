/**
 * Returns the root element's query. The player is injected into the root element as a child, so
 * this method dictates where the player will be injected at
 */
declare function getRootQuery(): string;

declare var getWaitForQuery: undefined | (() => string);

/**
 * Query used to get the video element the player wraps around
 */
declare function getVideoQuery(): string;

/**
 * Returns the video element. If necessary, this method can be overridden, but a single instance
 * that all services use is defined in `all.ts`
 */
declare var getVideo: undefined | (() => HTMLVideoElement);

/**
 * Sometimes, the player should not be injected when the url is matched (funimation show preview)
 */
declare var doNotReplacePlayer: (() => boolean) | undefined;

/**
 * Get the current webpage's suggested episode info. This method is async, so a messenger can be
 * used to communicate with the background and base webpages.
 */
declare function inferEpisodeInfo(): Promise<InferredEpisodeInfo>;

/**
 * Convert a raw URL string to one that can be used with Anime Skip (remove query params, etc)
 * @param inputUrl The raw URL
 */
declare var transformServiceUrl: (inputUrl: string) => string;

/**
 * Get the options the the player provides (quality, subtitles, etc). Return enough info to
 * display the items (icon, name), as well as the actual HTML node so that it can be clicked on to
 * trigger the change.
 *
 * Set to undefined or return undefined if player options are not available for the service
 */
declare function getPlayerOptions():
  | Promise<PlayerOptionGroup[] | undefined>
  | PlayerOptionGroup[]
  | undefined;

/**
 * Add a callback that gets called when a video changes (duration is different than before)
 */
declare function onVideoChanged(callback: (video: HTMLVideoElement) => void): void;

declare var service: Service;
declare var serviceDisplayName: ServiceDisplayName;

declare function addKeyDownListener(callback: (event: KeyboardEvent) => void): void;
declare function removeKeyDownListener(callback: (event: KeyboardEvent) => void): void;

// Defined globals
declare const EXTENSION_VERSION: string;
declare const EXTENSION_MODE: ExtensionMode;
declare const TARGET_BROWSER: SupportedBrowser;
