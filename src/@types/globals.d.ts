declare interface ServiceHelpers {
  getRootQuery(): string;
  getVideoQuery(): string;
  getVideo(): HTMLVideoElement;
  inferEpisodeInfo(): Promise<InferredEpisodeInfo>;

  /**
   * Convert a raw URL string to one that can be used with Anime Skip (remove query params, etc)
   * @param inputUrl The raw URL
   */
  transformServiceUrl(inputUrl: string): string;
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
