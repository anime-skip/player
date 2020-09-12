declare interface ServiceHelpers {
  getRootQuery(): string;
  getVideoQuery(): string;
  getVideo(): HTMLVideoElement;
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
