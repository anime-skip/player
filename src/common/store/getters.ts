import { as } from '../utils/GlobalUtils';
import { GetterTree } from 'vuex';
import RequestState from '../utils/RequestState';

export default as<GetterTree<VuexState, VuexState>>({
  // General
  state(state): VuexState {
    return state;
  },
  activeDialog(state): string | undefined {
    return state.activeDialog;
  },
  playbackRate({ playbackRate }): number {
    return playbackRate;
  },
  isEditing({ isEditing }): boolean {
    return isEditing;
  },
  tabUrl({ tabUrl }): string {
    return tabUrl;
  },

  // Login
  isLoggingIn({ loginRequestState }): boolean {
    return loginRequestState === RequestState.LOADING;
  },
  isLoggedIn({ loginRequestState }): boolean {
    return loginRequestState === RequestState.SUCCESS;
  },
  isLogInError({ loginRequestState }): boolean {
    return loginRequestState === RequestState.FAILURE;
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
  hasPreferenceError({ preferencesRequestState }): boolean {
    return preferencesRequestState === RequestState.FAILURE;
  },
  preferencesLastUpdatedAt({ preferencesLastUpdatedAt }): number {
    return preferencesLastUpdatedAt;
  },

  // Shows
  searchShowsResult({ searchShowsResult }): Api.ShowSearchResult[] {
    return searchShowsResult;
  },

  // Episodes
  searchEpisodesResult({ searchEpisodesResult }): Api.EpisodeSearchResult[] {
    return searchEpisodesResult;
  },
  episodeUrl({ episodeUrl }): Api.EpisodeUrl | undefined {
    return episodeUrl;
  },
  episodeRequestState({ episodeRequestState }): RequestState {
    return episodeRequestState;
  },

  // Timestamps
  timestamps(state): Api.Timestamp[] {
    if (state.episodeUrl == null) {
      return [];
    }
    return state.episodeUrl.episode.timestamps;
  },
  activeTimestamp(state): Api.AmbigousTimestamp | undefined {
    return state.activeTimestamp;
  },
  draftTimestamps(state): Api.AmbigousTimestamp[] {
    return state.draftTimestamps;
  },
  editTimestampMode(state): 'edit' | 'add' | undefined {
    return state.editTimestampMode;
  },
});
