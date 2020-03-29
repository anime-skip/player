type AxiosResponse<T> = import('axios').AxiosResponse<T>;

declare interface GraphQlBody {
  query?: string;
  variables?: { [variableName: string]: any };
}

declare namespace Api {
  interface Implementation {
    loginManual(username: string, password: string): Promise<Api.LoginResponse>;
    loginRefresh(refreshToken: string): Promise<Api.LoginResponse>;
    updatePreferences(prefs: Api.Preferences): Promise<void>;

    searchShows(name: string): Promise<Api.ShowSearchResult[]>;

    searchEpisodes(name: string): Promise<Api.EpisodeSearchResult[]>;

    createEpisodeUrl(data: Api.InputEpisodeUrl, episodeId: string): Promise<Api.EpisodeUrl>;
    fetchEpisodeByUrl(url: string): Promise<Api.EpisodeUrl>;
  }

  interface Preferences {
    enableAutoSkip: boolean;
    enableAutoPlay: boolean;
    skipBranding: boolean;
    skipIntros: boolean;
    skipNewIntros: boolean;
    skipMixedIntros: boolean;
    skipRecaps: boolean;
    skipFiller: boolean;
    skipCanon: boolean;
    skipTransitions: boolean;
    skipTitleCard: boolean;
    skipCredits: boolean;
    skipNewCredits: boolean;
    skipMixedCredits: boolean;
    skipPreview: boolean;
  }

  interface Account {
    username: string;
    emailVerified: boolean;
    preferences: Preferences;
  }

  interface ShowSearchResult {
    id: string;
    name: string;
    originalName?: string;
  }

  interface Show extends ShowSearchResult {
    website?: string;
    image?: string;
  }

  interface EpisodeUrl {
    episode: Episode;
  }

  interface InputEpisodeUrl {
    url: string;
  }

  interface EpisodeSearchResult {
    id: string;
    name?: string;
    season?: number;
    absoluteNumber?: number;
    number?: number;
  }

  interface InputEpisode {
    name?: string;
    season?: number;
    number?: number;
    absoluteNumber?: number;
  }

  interface Episode extends EpisodeSearchResult {
    show?: Show;
    timestamps: Timestamp[];
  }

  interface Timestamp {
    id: number;
    at: number;
    typeId: number;
  }

  interface LoginResponse {
    authToken: string;
    refreshToken: string;
    account: Account;
  }
}
