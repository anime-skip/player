interface VideoInjection {
  addTime: (seconds: number) => void;
  togglePlayPause: () => void;
  nextTimestamp: () => void;
  previousTimestamp: () => void;
  setMuted: (isMuted: boolean) => void;
}

declare type MessageType = 'fetchEpisode';
declare type MessageTypeMap<T = any> = Partial<{ [type in MessageType]: T }>;

declare interface MessagePayload extends MessageTypeMap {
  fetchEpisode: string;
}

declare interface MessageResponse extends MessageTypeMap {
  fetchEpisode: Api.Episode;
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

declare interface SkippablePreference {
  key: keyof Api.Preferences;
  title: string;
  help: string;
}

type ValueOf<T> = T[keyof T];
