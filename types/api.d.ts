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
    fetchEpisodeByUrl(url: string): Promise<Api.Episode>;
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

  interface Show {
    id: number;
    name: string;
    originalName?: string;
    website?: string;
    image?: string;
  }

  interface Episode {
    id: number;
    name?: string;
    season?: number;
    absoluteNumber?: number;
    number?: number;
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
