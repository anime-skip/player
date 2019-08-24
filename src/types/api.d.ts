type AxiosResponse<T> = import('axios').AxiosResponse<T>;

declare interface GraphQlBody {
  query?: string;
  variables?: { [variableName: string]: any };
}

declare namespace Api {
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
    skipMixedCredits: boolean;
    skipPreview: boolean;
  }
  interface MyUser {
    username: string;
    verified: boolean;
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
  }
  interface Timestamp {
    id: number;
    time: number;
    _typeId: number;
  }

  interface LoginResponse {
    token: string;
    refreshToken: string;
    myUser: MyUser;
  }
}
