type AxiosResponse<T> = import('axios').AxiosResponse<T>

declare namespace Api {
  interface Preferences {
    enableAutoSkip: boolean;
    skipBranding: boolean;
    skipIntros: boolean;
    skipNewIntros: boolean;
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

  interface LoginResponse {
    token: string;
    refreshToken: string;
    myUser: MyUser;
  }
}
