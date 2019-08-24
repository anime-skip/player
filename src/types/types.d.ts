declare function getRootQuery(): string;
interface VideoInjection {
  addTime: (seconds: number) => void;
  togglePlayPause: () => void;
  nextTimestamp: () => void;
  previousTimestamp: () => void;
  setMuted: (isMuted: boolean) => void;
}
declare const video: HTMLVideoElement & VideoInjection;
declare function getElementsToHide(): HTMLElement[];

declare type MessageType = 'loginStateChanged';

declare interface MessagePayload {
  loginStateChanged: boolean;
}

declare interface MessageResponse {
  loginStateChanged: undefined;
}

declare interface VuexState {
  token?: string;
  tokenExpiresAt?: number;
  refreshToken?: string;
  refreshTokenExpiresAt?: number;
  loginError: boolean;
  loginLoading: boolean;
  /**
   * `undefined` - Unknown if they are logged in or not
   * `true` - Auth token exists and is valid
   * `false` - Auth token is invalid or does not exist
   */
  loginState?: boolean;
  myUser?: Api.MyUser;
  preferenceChangeError?: boolean;
}

declare interface LoginManualPayload {
  username: string;
  password: string;
}

declare interface LoginRefreshPayload {
  refreshToken: string;
}

declare interface PlayerState {
  isActive: boolean;
  isEditing: boolean;
  isBuffering: boolean;
  isLoadingEpisodeInfo: boolean;
  isPaused: boolean;
  isFullscreen: boolean;
  isMuted: boolean;
}
