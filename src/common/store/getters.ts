import { as } from '../utils/GlobalUtils';
import { GetterTree } from 'vuex';
import RequestState from '../utils/RequestState';
import {
  DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS,
  DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS,
} from '../utils/Constants';
import Browser from '../utils/Browser';

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
    return Browser.transformServiceUrl(tabUrl);
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

  // Keyboard shortcusts
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  primaryKeyboardShortcuts({ primaryKeyboardShortcuts }): any {
    return primaryKeyboardShortcuts ?? DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS;
  },
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  secondaryKeyboardShortcuts({ secondaryKeyboardShortcuts }): any {
    return secondaryKeyboardShortcuts ?? DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS;
  },
  keyComboCountMap({
    primaryKeyboardShortcuts,
    secondaryKeyboardShortcuts,
  }): { [keyCombo: string]: number | undefined } {
    const map: { [keyCombo: string]: number | undefined } = {};
    Object.values(primaryKeyboardShortcuts ?? DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS).forEach(
      keyCombo => {
        if (keyCombo) {
          map[keyCombo] = (map[keyCombo] ?? 0) + 1;
        }
      }
    );
    Object.values(secondaryKeyboardShortcuts ?? DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS).forEach(
      keyCombo => {
        if (keyCombo) {
          map[keyCombo] = (map[keyCombo] ?? 0) + 1;
        }
      }
    );
    return map;
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
    if (episodeUrl != null) {
      return {
        absoluteNumber: episodeUrl.episode.absoluteNumber,
        number: episodeUrl.episode.number,
        name: episodeUrl.episode.name || 'Unknown Episode',
        season: episodeUrl.episode.season,
        show: episodeUrl.episode.show?.name || 'Unknown Show',
      };
    }
    return {
      absoluteNumber: inferredEpisodeInfo?.absoluteNumber,
      number: inferredEpisodeInfo?.number,
      name: inferredEpisodeInfo?.name || 'Unknown Episode',
      season: inferredEpisodeInfo?.season,
      show: inferredEpisodeInfo?.show || 'Unknown Show',
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
    return timestamps;
  },
  activeTimestamp(state): Api.AmbigousTimestamp | undefined {
    return state.activeTimestamp;
  },
  draftTimestamps(state): Api.AmbigousTimestamp[] {
    return state.draftTimestamps;
  },
  activeTimestamps(_, getters): Api.AmbigousTimestamp[] {
    return getters.isEditing ? getters.draftTimestamps : getters.timestamps;
  },
  editTimestampMode(state): 'edit' | 'add' | undefined {
    return state.editTimestampMode;
  },
  canEditTimestamps(_, getters): boolean {
    if (!getters.isLoggedIn) return false;
    const episodeInfo: Api.EpisodeUrl = getters.episodeUrl;
    if (episodeInfo == null) return false;
    const { name, show } = episodeInfo.episode;
    if (!name || !show?.name) return false;
    if (name === 'Unknown Episode' || show?.name === 'Unknown Show') return false;
    return true;
  },
  isSavingTimestamps(state): boolean {
    return state.saveTimestampsRequestState === RequestState.LOADING;
  },
});
