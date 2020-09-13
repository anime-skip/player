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
  browserType({ browserType }) {
    return browserType;
  },
  hasSkippedFromZero({ hasSkippedFromZero }) {
    return hasSkippedFromZero;
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
  displayEpisodeInfo(state): DisplayEpisodeInfo {
    const { episodeUrl, inferredEpisodeInfo } = state;
    return {
      absoluteNumber: episodeUrl?.episode.absoluteNumber || inferredEpisodeInfo?.absoluteNumber,
      number: episodeUrl?.episode.number || inferredEpisodeInfo?.number,
      name: episodeUrl?.episode.name || inferredEpisodeInfo?.name || 'Unknown Episode',
      season: episodeUrl?.episode.season || inferredEpisodeInfo?.season,
      show: episodeUrl?.episode.show?.name || inferredEpisodeInfo?.show || 'Unknown Show',
    };
  },
  inferredEpisodeInfo({ inferredEpisodeInfo }): InferredEpisodeInfo | undefined {
    return inferredEpisodeInfo;
  },
  episodeRequestState({ episodeRequestState }): RequestState {
    return episodeRequestState;
  },
  hasEpisode({ episodeUrl }): boolean {
    return episodeUrl != null;
  },

  // Timestamps
  timestamps({ timestamps }): Api.AmbigousTimestamp[] {
    console.info({ timestamps });
    return timestamps;
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
  canEditTimestamps(_, getters): boolean {
    const episodeInfo: DisplayEpisodeInfo = getters.episodeInfo;
    if (episodeInfo == null) return false;
    const { name, show } = episodeInfo;
    if (!name || !show) return false;
    if (name === 'Unknown Episode' || show === 'Unknown Show') return false;
    return true;
  },
});
