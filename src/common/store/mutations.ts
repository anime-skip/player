import { persistedKeys } from '@/common/utils/Constants';
import Browser from '@/common/utils/Browser';
import Vue from 'vue';
import { Mutation } from 'vuex';
import types from './types';

// Helpers /////////////////////////////////////////////////////////////////////

async function persistAccount(state: VuexState): Promise<void> {
  for (const key of persistedKeys) {
    // @ts-ignore
    await Browser.storage.setItem(key, JSON.stringify(state[key]));
  }
}

function changeLoginState(state: VuexState, newLoginState: boolean | undefined): void {
  state.loginState = newLoginState;
  Browser.storage.setItem('loginState', newLoginState);
}

// Mutations ///////////////////////////////////////////////////////////////////

export const mutations: {
  [type in ValueOf<typeof types>]: Mutation<VuexState>;
} = {
  // Storage
  [types.restoreState](state, localStorageState: Partial<VuexState>) {
    for (const field in localStorageState) {
      if (state.hasOwnProperty(field)) {
        // @ts-ignore
        Vue.set(state, field, localStorageState[field]);
      }
    }
  },
  [types.persistPreferences](state, payload: Api.Preferences) {
    if (!state.account) {
      console.warn('updatePreference() called without account in the store');
      return;
    }
    Vue.set(state.account, 'preferences', payload);
    persistAccount(state);
  },

  // Login
  [types.changeLoginState]: changeLoginState,
  [types.login](state, loginPayload: Api.LoginResponse) {
    state.token = loginPayload.authToken;
    state.tokenExpiresAt = Date.now() + 43200000; // 12 hours
    state.refreshToken = loginPayload.refreshToken;
    state.refreshTokenExpiresAt = Date.now() + 604800000; // 7 days
    state.loginError = false;
    state.account = loginPayload.account;
    changeLoginState(state, true);
    persistAccount(state);
  },
  [types.logOut](state) {
    state.token = undefined;
    state.tokenExpiresAt = undefined;
    state.refreshToken = undefined;
    state.refreshTokenExpiresAt = undefined;
    state.loginError = false;
    state.account = undefined;
    changeLoginState(state, false);
    persistAccount(state);
  },
  [types.loginError](state) {
    state.token = undefined;
    state.refreshToken = undefined;
    state.loginError = true;
    changeLoginState(state, false);
  },
  [types.loginLoading](state, isLoading: boolean) {
    state.loginLoading = isLoading;
  },

  // Preferences
  [types.togglePref](state, change: { pref: keyof Api.Preferences; value: any }) {
    if (!state.account) {
      console.warn('togglePref() called without account in the store');
      return;
    }
    Vue.set(state.account.preferences, change.pref, change.value);
  },
  [types.setPreferenceError](state, isError: boolean) {
    state.preferenceChangeError = isError;
    if (isError) {
      setTimeout(() => {
        state.preferenceChangeError = false;
      }, 5000);
    }
  },

  // Episodes
  [types.setEpisodeInfo](state, episode: Api.Episode) {
    state.episode = episode;
  },
};
