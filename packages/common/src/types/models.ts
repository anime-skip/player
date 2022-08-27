export interface LoginManualPayload {
  username: string;
  password: string;
  callback?: () => Promise<void> | void;
}

export interface LoginRefreshPayload {
  refreshToken: string;
}

export interface PlayerState {
  isActive: boolean;
  isBuffering: boolean;
  isPaused: boolean;
}

export interface PlaybackRate {
  value: number;
  display: string;
  hideWhenSmall?: boolean;
}

export interface AutocompleteItem<T = any> {
  key?: string;
  title: string;
  subtitle?: string;
  data?: T;
}

/**
 * Episode data pulled from the parent webpage
 */
export interface CrawledEpisodeInfo {
  name?: string;
  number?: string;
  absoluteNumber?: string;
  season?: string;
  show?: string;
}

/**
 * Episode info that is displayed in the top left of the player
 */
export interface DisplayEpisodeInfo {
  name: string;
  number?: string;
  absoluteNumber?: string;
  season?: string;
  show: string;
}

export interface PlayerOptionGroup {
  title: string;
  icon?: string;
  options: PlayerOption[];
}

export interface PlayerOption {
  title: string;
  isSelected: boolean;
  node: HTMLElement;
}

export interface TextInputRef {
  focus(selectAll?: boolean): void;
}

export interface ScreenshotDetails {
  width: number;
  height: number;
  left: number;
  top: number;
}
