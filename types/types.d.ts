declare interface LoginManualPayload {
  username: string;
  password: string;
}

declare interface LoginRefreshPayload {
  refreshToken: string;
}

declare interface PlayerState {
  isActive: boolean;
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

interface CreateEpisodeDataPayload {
  show:
    | {
        create: false;
        showId: string;
      }
    | {
        create: true;
        name: string;
      };
  episode:
    | {
        create: false;
        episodeId: string;
      }
    | {
        create: true;
        data: Api.InputEpisode;
      };
  episodeUrl:
    | {
        create: false;
        url: string;
      }
    | {
        create: true;
        data: Api.InputEpisodeUrl;
      };
}
