declare interface ServiceHelpers {
  getRootQuery(): string;
  getVideoQuery(): string;
  getVideo(): HTMLVideoElement;
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
  onVideoChanged(callback: (video: HTMLVideoElement) => void): void;
  Api: Api.Implementation;
  service: 'vrv' | 'funimation' | 'example' | undefined;
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
