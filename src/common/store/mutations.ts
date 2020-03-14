import { persistedKeys } from '@/common/utils/Constants';
import Browser from '@/common/utils/Browser';
import Vue from 'vue';

// Helpers /////////////////////////////////////////////////////////////////////

async function persistAccount(state: VuexState): Promise<void> {
  for (const key of persistedKeys) {
    // @ts-ignore
    await Browser.storage.setItem(key, JSON.stringify(state[key]));
  }
}

// Mutations ///////////////////////////////////////////////////////////////////

export function restoreState(
  state: VuexState,
  localStorageState: Partial<VuexState>
): void {
  for (const field in localStorageState) {
    if (state.hasOwnProperty(field)) {
      // @ts-ignore
      Vue.set(state, field, localStorageState[field]);
    }
  }
}

export function changeLoginState(
  state: VuexState,
  newLoginState: boolean | undefined
): void {
  Vue.set(state, 'loginState', newLoginState);
  Browser.storage.setItem('loginState', newLoginState);
}

export function login(state: VuexState, loginPayload: Api.LoginResponse): void {
  Vue.set(state, 'token', loginPayload.authToken);
  Vue.set(state, 'tokenExpiresAt', Date.now() + 43200000); // 12 hours
  Vue.set(state, 'refreshToken', loginPayload.refreshToken);
  Vue.set(state, 'refreshTokenExpiresAt', Date.now() + 604800000); // 7 days
  Vue.set(state, 'loginError', false);
  Vue.set(state, 'account', loginPayload.account);
  changeLoginState(state, true);
  persistAccount(state);
}

export function logOut(state: VuexState): void {
  Vue.set(state, 'token', undefined);
  Vue.set(state, 'tokenExpiresAt', undefined);
  Vue.set(state, 'refreshToken', undefined);
  Vue.set(state, 'refreshTokenExpiresAt', undefined);
  Vue.set(state, 'loginError', false);
  Vue.set(state, 'account', undefined);
  changeLoginState(state, false);
  persistAccount(state);
}

export function loginError(state: VuexState): void {
  Vue.set(state, 'token', undefined);
  Vue.set(state, 'refreshToken', undefined);
  Vue.set(state, 'loginError', true);
  changeLoginState(state, false);
}

export function loginLoading(state: VuexState, isLoading: boolean): void {
  Vue.set(state, 'loginLoading', isLoading);
}

export function togglePref(
  state: VuexState,
  change: { pref: keyof Api.Preferences; value: any }
): void {
  if (!state.account) {
    console.warn('togglePref() called without account in the store');
    return;
  }
  Vue.set(state.account.preferences, change.pref, change.value);
}

export function persistPreferences(
  state: VuexState,
  payload: Api.Preferences
): void {
  if (!state.account) {
    console.warn('updatePreference() called without account in the store');
    return;
  }
  Vue.set(state.account, 'preferences', payload);
  persistAccount(state);
}

export function setPreferenceError(state: VuexState, isError: boolean): void {
  Vue.set(state, 'preferenceChangeError', isError);
  if (isError) {
    setTimeout(() => {
      Vue.set(state, 'preferenceChangeError', false);
    }, 5000);
  }
}

export function setEpisodeInfo(state: VuexState, episode: Api.Episode): void {
  Vue.set(state, 'episode', episode);
}