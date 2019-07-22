import { persistedKeys } from '@/shared/utils/Constants';
import Browser from '@/shared/utils/Browser';
import Vue from 'vue';

export function restoreState(state: VuexState, localStorageState: VuexState) {
  for (const field in localStorageState) {
    if (state.hasOwnProperty(field)) {
      // @ts-ignore
      Vue.set(state, field, localStorageState[field]);
    }
  }
}

export function login(state: VuexState, loginPayload: Api.LoginResponse) {
  Vue.set(state, 'token', loginPayload.token);
  Vue.set(state, 'tokenExpiresAt', Date.now() + 43200000); // 12 hours
  Vue.set(state, 'refreshToken', loginPayload.refreshToken);
  Vue.set(state, 'refreshTokenExpiresAt', Date.now() + 604800000); // 7 days
  Vue.set(state, 'loginError', false);
  Vue.set(state, 'myUser', loginPayload.myUser);
  changeLoginState(state, true);
  persistAccount(state);
}

export function loginError(state: VuexState) {
  Vue.set(state, 'token', undefined);
  Vue.set(state, 'refreshToken', undefined);
  Vue.set(state, 'loginError', true);
  changeLoginState(state, false);
}

export function changeLoginState(state: VuexState, newLoginState: boolean | undefined) {
  Vue.set(state, 'loginState', newLoginState);
}

export function loginLoading(state: VuexState, isLoading: boolean) {
  Vue.set(state, 'loginLoading', isLoading);
}

export function togglePref(state: VuexState, change: { pref: keyof Api.Preferences, value: any }) {
  Vue.set(state.myUser!.preferences, change.pref, change.value);
}

export function updatePreference(state: VuexState, payload: { pref: keyof Api.Preferences, value: any }) {
  Vue.set(state.myUser!.preferences, payload.pref, payload.value);
  persistAccount(state);
}

export function setPreferenceError(state: VuexState, isError: boolean) {
  Vue.set(state, 'preferenceChangeError', isError);
  if (isError) {
    setTimeout(() => {
      Vue.set(state, 'preferenceChangeError', false);
    }, 5000);
  }
}

// Helpers /////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function persistAccount(state: VuexState): Promise<void> {
  for (const key of persistedKeys) {
    // @ts-ignore
    await Browser.storage.setItem(key, JSON.stringify(state[key]));
  }
}
