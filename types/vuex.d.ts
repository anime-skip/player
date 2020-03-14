declare interface VuexState {
  token?: string;
  tokenExpiresAt?: number;
  refreshToken?: string;
  refreshTokenExpiresAt?: number;
  loginRequestState: RequestState;
  account?: Api.Account;
  preferencesRequestState?: RequestState;
  episode?: Api.Episode;
}
