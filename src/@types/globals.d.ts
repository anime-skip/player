declare interface ServiceHelpers {
  /**
   * Returns the root element's query. The player is injected into the root element as a child, so
   * this method dictates where the player will be injected at
   */
  getRootQuery(): string;
  /**
   * Query used to get the video element the player wraps around
   */
  getVideoQuery(): string;
  /**
   * Returns the video element. If necessary, this method can be overridden, but a single instance
   * that all services use is defined in `all.ts`
   */
  getVideo: undefined | (() => HTMLVideoElement);
  /**
   * Sometimes, the player should not be injected when the url is matched (funimation show preview)
   */
  doNotReplacePlayer: (() => boolean) | undefined;
  /**
   * Get the current webpage's suggested episode info. This method is async, so a messenger can be
   * used to communicate with the background and base webpages.
   */
  inferEpisodeInfo(): Promise<InferredEpisodeInfo>;

  /**
   * Convert a raw URL string to one that can be used with Anime Skip (remove query params, etc)
   * @param inputUrl The raw URL
   */
  transformServiceUrl?: (inputUrl: string) => string;

  /**
   * Get the options the the player provides (quality, subtitles, etc). Return enough info to
   * display the items (icon, name), as well as the actual HTML node so that it can be clicked on to
   * trigger the change
   */
  getPlayerOptions: () => PlayerOptionGroup[] | undefined;
  /**
   * Add a callback that gets called when a video changes (duration is different than before)
   */
  onVideoChanged(callback: (video: HTMLVideoElement) => void): void;
  Api: Api.Implementation;
  service: Service;
  serviceDisplayName: 'Anime Skip Example' | 'VRV' | 'Funimation' | undefined;

  // keyboard-blocker.ts
  addKeyDownListener: (callback: (event: KeyboardEvent) => void) => void;
  removeKeyDownListener: (callback: (event: KeyboardEvent) => void) => void;
}

declare global {
  namespace NodeJS {
    interface Global extends ServiceHelpers {}
  }
}
export default global;
