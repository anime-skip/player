import { persistedKeys } from '@/common/utils/Constants';
import Browser from '@/common/utils/Browser';
import Vue from 'vue';
import { Mutation } from 'vuex';
import types from './mutationTypes';
import { as } from '../utils/GlobalUtils';
import RequestState from '../utils/RequestState';

// Helpers /////////////////////////////////////////////////////////////////////

async function persistAccount(state: VuexState): Promise<void> {
  for (const key of persistedKeys) {
    // @ts-ignore
    await Browser.storage.setItem(key, JSON.stringify(state[key]));
  }
}

function loginRequestState(state: VuexState, loginRequestState: RequestState): void {
  state.loginRequestState = loginRequestState;
  Browser.storage.setItem('loginRequestState', loginRequestState);
}

// Mutations ///////////////////////////////////////////////////////////////////

export default as<
  {
    [type in ValueOf<typeof types>]: Mutation<VuexState>;
  }
>({
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
  [types.login](state, loginPayload: Api.LoginResponse) {
    state.token = loginPayload.authToken;
    state.tokenExpiresAt = Date.now() + 43200000; // 12 hours
    state.refreshToken = loginPayload.refreshToken;
    state.refreshTokenExpiresAt = Date.now() + 604800000; // 7 days
    state.account = loginPayload.account;
    loginRequestState(state, RequestState.SUCCESS);
    persistAccount(state);
  },
  [types.logOut](state) {
    state.token = undefined;
    state.tokenExpiresAt = undefined;
    state.refreshToken = undefined;
    state.refreshTokenExpiresAt = undefined;
    state.account = undefined;
    loginRequestState(state, RequestState.NOT_REQUESTED);
    persistAccount(state);
  },
  [types.loginRequestState](state, requestState: RequestState) {
    loginRequestState(state, requestState);
  },

  // Preferences
  [types.togglePref](state, change: { pref: keyof Api.Preferences; value: any }) {
    if (!state.account) {
      console.warn('togglePref() called without account in the store');
      return;
    }
    Vue.set(state.account.preferences, change.pref, change.value);
  },
  [types.preferencesRequestState](state, requestState: RequestState) {
    state.preferencesRequestState = requestState;
  },

  // Episodes
  [types.setEpisodeInfo](state, episode: Api.Episode) {
    state.episode = episode;
  },
});
