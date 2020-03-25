interface VideoInjection {
  addTime: (seconds: number) => void;
  togglePlayPause: () => void;
  nextTimestamp: () => void;
  previousTimestamp: () => void;
  setMuted: (isMuted: boolean) => void;
}

declare type MessageType = keyof Api.Implementation;
declare type MessageTypeListenerMap<T> = Partial<{ [type in MessageType]: T }>;
declare type MessageTypeMap<T> = Record<MessageType, T>;

declare interface MessagePayload extends Implements<MessageTypeMap<any>, MessagePayload> {
  loginManual: { username: string; password: string };
  loginRefresh: string;
  updatePreferences: Api.Preferences;
  searchShows: string;
  searchEpisodes: string;
  fetchEpisodeByUrl: string;
}

declare interface MessageResponse extends Implements<MessageTypeMap<any>, MessageResponse> {
  loginManual: Api.LoginResponse;
  loginRefresh: Api.LoginResponse;
  updatePreferences: void;
  searchShows: Api.ShowSearchResult[];
  searchEpisodes: Api.EpisodeSearchResult[];
  fetchEpisodeByUrl: Api.EpisodeUrl;
}

declare type MessageListener<T extends MessageType> = (
  payload: MessagePayload[T]
) => Promise<MessageResponse[T]>;
declare type MessageListeners = { [type in MessageType]: MessageListener<type> };

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

declare interface SkippablePreference {
  key: keyof Api.Preferences;
  title: string;
  help: string;
}

declare interface PlaybackRate {
  value: number;
  display: string;
  hideWhenSmall?: boolean;
}

type ValueOf<T> = T[keyof T];
type Implements<T, U extends T> = {};
