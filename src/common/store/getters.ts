import { as } from '../utils/GlobalUtils';
import { GetterTree } from 'vuex';
import RequestState from '../utils/RequestState';
import {
  DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS,
  DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS,
} from '../utils/Constants';
import Browser from '../utils/Browser';
import Utils from '../utils/Utils';

export default as<GetterTree<VuexState, VuexState>>({
  // General
  tabUrl({ tabUrl }): string {
    return Browser.transformServiceUrl(tabUrl);
  },
  duration({ duration }) {
    return duration || undefined;
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

  // Keyboard shortcuts
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

  // Episodes
  displayEpisodeInfo({ inferredEpisodeInfo, episode }): DisplayEpisodeInfo {
    if (episode != null) {
      return {
        absoluteNumber: episode.absoluteNumber,
        number: episode.number,
        name: episode.name || 'Unknown Episode',
        season: episode.season,
        show: episode.show?.name || 'Unknown Show',
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
  hasEpisode({ episodeUrl }): boolean {
    return episodeUrl != null;
  },

  // Timestamps
  timestamps({ timestamps, episodeUrl, episode, duration }): Api.AmbigousTimestamp[] {
    // Find the offset
    let timestampsOffset = episodeUrl?.timestampsOffset;
    if (timestampsOffset == null && episode?.baseDuration != null && duration != null) {
      timestampsOffset = Utils.computeTimestampsOffset(episode.baseDuration, duration);
    }

    // Apply the offset
    const offsetTimestamps = timestamps.map(timestamp => {
      const at = Utils.applyTimestampsOffset(timestampsOffset, timestamp.at);
      return {
        ...timestamp,
        at,
      };
    });
    if (duration == null) return offsetTimestamps;

    // Remove out of bounds timestamps
    const offsetBoundedTimestamps = offsetTimestamps.filter(
      timestamp => timestamp.at <= duration && timestamp.at >= 0
    );
    return offsetBoundedTimestamps;
  },
  draftTimestamps(state): Api.AmbigousTimestamp[] {
    let drafts = state.draftTimestamps;
    if (state.activeTimestamp != null) {
      const activeIndex = drafts.findIndex(timestamp => timestamp.id === state.activeTimestamp?.id);
      const activeIsExisting = activeIndex !== -1;
      if (activeIsExisting) {
        drafts.splice(activeIndex, 1, state.activeTimestamp);
      } else {
        drafts = [...drafts, state.activeTimestamp].sort(Utils.timestampSorter);
      }
    }
    return drafts;
  },
  activeTimestamps(state, getters): Api.AmbigousTimestamp[] {
    return state.isEditing ? getters.draftTimestamps : getters.timestamps;
  },
  canEditTimestamps(state, getters): boolean {
    if (!getters.isLoggedIn) return false;
    const episodeUrl = state.episodeUrl;
    if (episodeUrl == null) return false;
    const episode = state.episode;
    if (episode == null) return false;
    const { name, show } = episode;
    if (!name || !show?.name) return false;
    if (name === 'Unknown Episode' || show?.name === 'Unknown Show') return false;
    return true;
  },
  isSavingTimestamps(state): boolean {
    return state.saveTimestampsRequestState === RequestState.LOADING;
  },
});
