declare type Service =
  | 'test-service'
  | 'vrv'
  | 'funimation'
  | 'funimation-2021-09-26'
  | 'crunchyroll';

declare type ServiceDisplayName =
  | 'Anime Skip Test'
  | 'VRV'
  | 'Funimation'
  | 'Crunchyroll'
  | undefined;

declare type SupportedBrowser = 'firefox' | 'chrome';

declare type ExtensionMode = 'dev' | 'test' | 'staged' | 'beta' | 'prod';

declare interface LoginManualPayload {
  username: string;
  password: string;
  callback?: () => Promise<void> | void;
}

declare interface LoginRefreshPayload {
  refreshToken: string;
}

declare interface PlayerState {
  isActive: boolean;
  isBuffering: boolean;
  isPaused: boolean;
}

declare interface PlaybackRate {
  value: number;
  display: string;
  hideWhenSmall?: boolean;
}

type ValueOf<T> = T[keyof T];
type Implements<T, U extends T> = {};

type BrowserType =
  | 'chrome'
  | 'firefox'
  | 'safari'
  | 'opera'
  | 'ie'
  | 'edge'
  | 'edgechromium'
  | 'unsupported';

interface AutocompleteItem<T = any> {
  key?: string;
  title: string;
  subtitle?: string;
  data?: T;
}

/**
 * Episode data pulled from the parent webpage
 */
interface InferredEpisodeInfo {
  name?: string;
  number?: string;
  absoluteNumber?: string;
  season?: string;
  show?: string;
}

/**
 * Episode info that is displayed in the top left of the player
 */
interface DisplayEpisodeInfo {
  name: string;
  number?: string;
  absoluteNumber?: string;
  season?: string;
  show: string;
}

interface PlayerOptionGroup {
  title: string;
  icon?: string;
  options: PlayerOption[];
}

interface PlayerOption {
  title: string;
  isSelected: boolean;
  node: HTMLElement;
}

declare interface TextInputRef {
  focus(selectAll?: boolean): void;
}

interface ScreenshotDetails {
  width: number;
  height: number;
  left: number;
  top: number;
}
