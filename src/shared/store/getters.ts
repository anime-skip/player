export function loginState(state: VuexState): boolean | undefined {
    return state.loginState;
}

export function token(state: VuexState): string | undefined {
    if (state.tokenExpiresAt && state.tokenExpiresAt <= Date.now()) {
        return undefined;
    }
    return state.token;
}

export function refreshToken(state: VuexState): string | undefined {
    if (state.refreshTokenExpiresAt && state.refreshTokenExpiresAt <= Date.now()) {
        return undefined;
    }
    return state.refreshToken;
}

export function state(state: VuexState): VuexState {
    return state;
}

export function isLoggingIn(state: VuexState): boolean {
    return !!state.loginLoading;
}

export function preferences(state: VuexState): Api.Preferences | undefined {
    if (!state.myUser) {
        return undefined;
    }
    return state.myUser.preferences;
}

export function preferenceChangeError(state: VuexState): boolean {
    return !!state.preferenceChangeError;
}
