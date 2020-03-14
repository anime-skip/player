import { as } from '../utils/GlobalUtils';
import { GetterTree } from 'vuex';

export default as<GetterTree<VuexState, VuexState>>({
  // General
  state(state): VuexState {
    return state;
  },

  // Login
  loginState(state): boolean | undefined {
    return state.loginState;
  },
  isLoggingIn(state): boolean {
    return !!state.loginLoading;
  },

  // Authentication
  token(state): string | undefined {
    if (state.tokenExpiresAt && state.tokenExpiresAt <= Date.now()) {
      return undefined;
    }
    return state.token;
  },
  refreshToken(state): string | undefined {
    if (
      state.refreshTokenExpiresAt &&
      state.refreshTokenExpiresAt <= Date.now()
    ) {
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
  preferenceChangeError(state): boolean {
    return !!state.preferenceChangeError;
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
