
export function loginState(state: VuexState): boolean | undefined {
    return state.loginState;
}

export function token(state: VuexState) {
    if (state.tokenExpiresAt && state.tokenExpiresAt <= Date.now()) {
        return undefined;
    }
    return state.token;
}

export function refreshToken(state: VuexState) {
    if (state.refreshTokenExpiresAt && state.refreshTokenExpiresAt <= Date.now()) {
        return undefined;
    }
    return state.refreshToken;
}

export function state(state: VuexState) {
    return state;
}

export function isLoggingIn(state: VuexState) {
    return state.loginLoading;
}
