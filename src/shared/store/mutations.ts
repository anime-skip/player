import { persistedKeys } from '@/shared/utils/Constants';
import Browser from '@/shared/utils/Browser';

export function restoreState(state: VuexState, localStorageState: VuexState) {
    for (const field in state) {
        if (state.hasOwnProperty(field)) {
            // @ts-ignore
            state[field] = localStorageState[field];
        }
    }
}

export function login(state: VuexState, loginPayload: Api.LoginResponse) {
    state.token = loginPayload.token;
    state.tokenExpiresAt = Date.now() + 43200000; // 12 hours
    state.refreshToken = loginPayload.refreshToken;
    state.refreshTokenExpiresAt = Date.now() + 604800000; // 7 days
    state.loginError = false;
    changeLoginState(state, true);
    persistAccount(state);
}

export function loginError(state: VuexState) {
    state.token = undefined;
    state.refreshToken = undefined;
    state.loginError = true;
    changeLoginState(state, false);
}

export function changeLoginState(state: VuexState, newLoginState: boolean | undefined) {
    state.loginState = newLoginState;
    console.log('changeLoginState', newLoginState);
}

export function loginLoading(state: VuexState, isLoading: boolean) {
    state.loginLoading = isLoading;
}

async function persistAccount(state: VuexState): Promise<void> {
    for (const key of persistedKeys) {
        // @ts-ignore
        console.log('persisting', { [key]: state[key] });
        // @ts-ignore
        await Browser.storage.setItem(key, state[key]);
    }
    console.log('persisted', await Browser.storage.getAll(persistedKeys));
}
