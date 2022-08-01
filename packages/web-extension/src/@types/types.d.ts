type Service =
  | 'test-service'
  | 'vrv'
  | 'funimation'
  | 'funimation-2021-09-26'
  | 'crunchyroll'
  | 'crunchyroll-beta'
  | 'zoro'
  | '9anime';

type ServiceDisplayName =
  | 'Anime Skip Test'
  | 'VRV'
  | 'Funimation'
  | 'Crunchyroll'
  | 'Zoro.to'
  | '9anime'
  | undefined;

type SupportedBrowser = 'firefox' | 'chrome';

type ExtensionMode = 'dev' | 'test' | 'staged' | 'beta' | 'prod';

// type OffscreenCanvas = undefined | (() => {});

declare class OffscreenCanvas {
  constructor(readonly width: number, readonly height: number);
  getContext(type: '2d'): CanvasRenderingContext2D;
  convertToBlob(options?: { type?: string; quality?: number }): Promise<Blob>;
}
