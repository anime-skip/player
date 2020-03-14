declare function getRootQuery(): string;
declare function getVideoQuery(): string;
interface VideoInjection {
  addTime: (seconds: number) => void;
  togglePlayPause: () => void;
  nextTimestamp: () => void;
  previousTimestamp: () => void;
  setMuted: (isMuted: boolean) => void;
}
declare function getVideo(): HTMLVideoElement;
declare function onVideoChanged(
  callback: (video: HTMLVideoElement) => void
): void;

declare type MessageType = 'fetchEpisode';
declare type MessageTypeMap<T = any> = Partial<{ [type in MessageType]: T }>;

declare interface MessagePayload extends MessageTypeMap {
  fetchEpisode: string;
}

declare interface MessageResponse extends MessageTypeMap {
  fetchEpisode: Api.Episode;
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
  account?: Api.Account;
  preferenceChangeError?: boolean;
  episode?: Api.Episode;
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
