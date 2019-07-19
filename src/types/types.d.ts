declare function getRootQuery(): string;

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
    loginState?: boolean,
    myUser?: Api.MyUser;
}

declare interface LoginManualPayload {
    username: string;
    password: string;
}

declare interface LoginRefreshPayload {
    refreshToken: string;
}