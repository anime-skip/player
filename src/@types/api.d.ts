type AxiosResponse<T> = import('axios').AxiosResponse<T>;

declare interface GraphQlBody {
  query?: string;
  variables?: { [variableName: string]: any };
}

declare namespace Api {
  type TimestampSource = 'ANIME_SKIP' | 'BETTER_VRV';

  interface Implementation {
    loginManual(username: string, password: string): Promise<Api.LoginResponse>;
    loginRefresh(refreshToken: string): Promise<Api.LoginRefreshResponse>;
    updatePreferences(prefs: Api.Preferences): Promise<void>;

    createShow(data: Api.InputShow): Promise<Api.Show>;
    searchShows(name: string): Promise<Api.ShowSearchResult[]>;

    createEpisode(data: Api.InputEpisode, showId: string): Promise<Api.EpisodeSearchResult>;
    searchEpisodes(name: string, showId?: string): Promise<Api.EpisodeSearchResult[]>;
    updateEpisode(id: string, input: Api.InputEpisode): Promise<Api.Episode>;

    createEpisodeUrl(
      data: Api.InputEpisodeUrl,
      episodeId: string
    ): Promise<Api.EpisodeUrlNoEpisode>;
    deleteEpisodeUrl(episodeUrl: string): Promise<Api.EpisodeUrlNoEpisode>;
    fetchEpisodeByUrl(url: string): Promise<Api.EpisodeUrl>;
    fetchEpisodeByName(name: string, showName: string): Promise<Api.ThirdPartyEpisode[]>;
    updateEpisodeUrl(url: string, inputUrl: Api.InputEpisodeUrl): Promise<Api.EpisodeUrlNoEpisode>;

    createTimestamp(episodeId: string, timestamp: Api.InputTimestamp): Promise<Api.Timestamp>;
    updateTimestamp(newTimestamp: Api.Timestamp): Promise<Api.Timestamp>;
    deleteTimestamp(timestampId: string): Promise<Api.Timestamp>;
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

  interface InputShow {
    name: string;
    originalName?: string;
    website?: string;
    image?: string;
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

  interface ThirdPartyShow {
    name: string;
  }

  interface EpisodeUrlNoEpisode {
    url: string;
    createdAt: number;
    duration?: number;
    timestampsOffset?: number;
  }

  interface EpisodeUrl extends EpisodeUrlNoEpisode {
    episode: Episode;
  }

  interface InputEpisodeUrl {
    url: string;
    duration?: number;
    timestampsOffset?: number;
  }

  interface EpisodeSearchResult {
    id: string;
    name?: string;
    season?: string;
    absoluteNumber?: string;
    number?: string;
    baseDuration?: number;
  }

  interface InputEpisode {
    name?: string;
    season?: string;
    number?: string;
    absoluteNumber?: string;
    baseDuration?: number;
  }

  interface Episode extends EpisodeSearchResult {
    show?: Show;
    timestamps: Timestamp[];
  }

  type ThirdPartyEpisode =
    | {
        id: string;
        season?: string;
        number?: string;
        absoluteNumber?: string;
        name?: string;
        source: 'ANIME_SKIP';
        baseDuration?: number;
        timestamps: ThirdPartyTimestamp[];
        show: ThirdPartyShow;
      }
    | {
        id?: string;
        season?: string;
        number?: string;
        absoluteNumber?: string;
        name?: string;
        source: 'BETTER_VRV';
        baseDuration?: number;
        timestamps: ThirdPartyTimestamp[];
        show: ThirdPartyShow;
      };

  interface InputTimestamp {
    at: number;
    typeId: string;
    source?: TimestampSource;
  }

  interface Timestamp extends InputTimestamp {
    id: string;
    source: TimestampSource;
  }

  interface AmbigousTimestamp extends InputTimestamp {
    /**
     * It is a number when it is local, randomly generated. It is remote when the id is a string (GUID)
     */
    id: number | string;
    source: TimestampSource;
    edited?: boolean;
  }

  interface ThirdPartyTimestamp {
    id?: string;
    at: number;
    typeId: string;
  }

  interface TimestampType {
    id: string;
    name: string;
    description: string;
  }

  interface LoginResponse {
    authToken: string;
    refreshToken: string;
    account: Account;
  }

  interface LoginRefreshResponse {
    authToken: string;
    refreshToken: string;
  }
}
