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
  