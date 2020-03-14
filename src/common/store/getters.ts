import { as } from '../utils/GlobalUtils';
import { GetterTree } from 'vuex';
import RequestState from '../utils/RequestState';

export default as<GetterTree<VuexState, VuexState>>({
  // General
  state(state): VuexState {
    return state;
  },
  activeDialog(state): string {
    return state.activeDialog;
  },

  // Login
  isLoggingIn({ loginRequestState }): boolean {
    console.log('isLoggingIn', loginRequestState === RequestState.LOADING);
    return loginRequestState === RequestState.LOADING;
  },
  isLoggedIn({ loginRequestState }): boolean {
    console.log('isLoggedIn', loginRequestState === RequestState.SUCCESS);
    return loginRequestState === RequestState.SUCCESS;
  },

  // Authentication
  token(state): string | undefined {
    if (state.tokenExpiresAt && state.tokenExpiresAt <= Date.now()) {
      return undefined;
    }
    return state.token;
  },
  refreshToken(state): string | undefined {
    if (state.refreshTokenExpiresAt && state.refreshTokenExpiresAt <= Date.now()) {
      return undefined;
    }
    return state.refreshToken;
  },

  // Preferences
  preferences(state): Api.Preferences | undefined {
    if (!state.account) {
      return undefined;
    }
    return state.account.preferences;
  },

  // Shows

  // Episodes
  episode(state): Api.Episode | undefined {
    return state.episode;
  },

  // Timestamps
  timestamps(state): Api.Timestamp[] {
    if (state.episode == null) {
      return [];
    }
    return state.episode.timestamps;
  },
});
