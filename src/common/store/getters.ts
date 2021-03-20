import { GetterTree } from 'vuex';
import RequestState from '../utils/RequestState';
import {
  DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS,
  DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS,
} from '../utils/Constants';
import Browser from '../utils/Browser';
import Utils from '../utils/Utils';
import { State } from './state';
import { GetterTypes } from './getterTypes';
import { Store } from '.';

// Typings /////////////////////////////////////////////////////////////////////

export interface Getters {
  [GetterTypes.TAB_URL](state: State): string;
  [GetterTypes.DURATION](state: State): number | undefined;
  [GetterTypes.IS_LOGGING_IN](state: State): boolean;
  [GetterTypes.IS_LOGIN_ERROR](state: State): boolean;
  [GetterTypes.TOKEN](state: State): string | undefined;
  [GetterTypes.REFRESH_TOKEN](state: State): string | undefined;
  [GetterTypes.PREFERENCES](state: State): Api.Preferences | undefined;
  [GetterTypes.HAS_PREFERENCE_ERROR](state: State): boolean;
  [GetterTypes.PRIMARY_KEYBOARD_SHORTCUTS](state: State): KeyboardShortcutsMap;
  [GetterTypes.SECONDARY_KEYBOARD_SHORTCUTS](state: State): KeyboardShortcutsMap;
  [GetterTypes.KEY_COMBO_COUNT_MAP](state: State): { [keyCombo: string]: number | undefined };
  [GetterTypes.DISPLAY_EPISODE_INFO](state: State): DisplayEpisodeInfo;
  [GetterTypes.HAS_EPISODE](state: State): boolean;
  [GetterTypes.TIMESTAMPS](state: State): Api.AmbiguousTimestamp[];
  [GetterTypes.DRAFT_TIMESTAMPS](state: State): Api.AmbiguousTimestamp[];
  [GetterTypes.ACTIVE_TIMESTAMPS](
    state: State,
    getters: Store['getters']
  ): Api.AmbiguousTimestamp[];
  [GetterTypes.APPLY_TIMESTAMP_DIFF](
    state: State
  ): (timestamp: Api.Timestamp | Api.AmbiguousTimestamp) => Api.AmbiguousTimestamp;
  [GetterTypes.CAN_EDIT_TIMESTAMPS](state: State, getters: Store['getters']): boolean;
  [GetterTypes.IS_SAVING_TIMESTAMPS](state: State): boolean;
}

// Getters /////////////////////////////////////////////////////////////////////

export const getters: GetterTree<State, State> & Getters = {
  // General
  [GetterTypes.TAB_URL]({ tabUrl }) {
    return Browser.transformServiceUrl(tabUrl);
  },
  [GetterTypes.DURATION]({ playerState }) {
    return playerState.duration || undefined;
  },

  // Login
  [GetterTypes.IS_LOGGING_IN]({ loginRequestState }) {
    return loginRequestState === RequestState.LOADING;
  },
  [GetterTypes.IS_LOGIN_ERROR]({ loginRequestState }) {
    return loginRequestState === RequestState.FAILURE;
  },

  // Authentication
  [GetterTypes.TOKEN](state) {
    if (state.tokenExpiresAt && state.tokenExpiresAt <= Date.now()) {
      return undefined;
    }
    return state.token;
  },
  [GetterTypes.REFRESH_TOKEN](state) {
    if (state.refreshTokenExpiresAt && state.refreshTokenExpiresAt <= Date.now()) {
      return undefined;
    }
    return state.refreshToken;
  },

  // Preferences
  [GetterTypes.PREFERENCES](state) {
    if (!state.account) {
      return undefined;
    }
    return state.account.preferences;
  },
  [GetterTypes.HAS_PREFERENCE_ERROR]({ preferencesRequestState }) {
    return preferencesRequestState === RequestState.FAILURE;
  },

  // Keyboard shortcuts
  [GetterTypes.PRIMARY_KEYBOARD_SHORTCUTS]({ primaryKeyboardShortcuts }) {
    return primaryKeyboardShortcuts ?? DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS;
  },
  [GetterTypes.SECONDARY_KEYBOARD_SHORTCUTS]({ secondaryKeyboardShortcuts }) {
    return secondaryKeyboardShortcuts ?? DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS;
  },
  [GetterTypes.KEY_COMBO_COUNT_MAP]({ primaryKeyboardShortcuts, secondaryKeyboardShortcuts }) {
    const map: { [keyCombo: string]: number | undefined } = {};
    Object.values(primaryKeyboardShortcuts ?? DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS).forEach(
      (keyCombo?: string) => {
        if (keyCombo) {
          map[keyCombo] = (map[keyCombo] ?? 0) + 1;
        }
      }
    );
    Object.values(secondaryKeyboardShortcuts ?? DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS).forEach(
      (keyCombo?: string) => {
        if (keyCombo) {
          map[keyCombo] = (map[keyCombo] ?? 0) + 1;
        }
      }
    );
    return map;
  },

  // Episodes
  [GetterTypes.DISPLAY_EPISODE_INFO]({ inferredEpisodeInfo, episode }) {
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
  [GetterTypes.HAS_EPISODE]({ episodeUrl }) {
    return episodeUrl != null;
  },

  // Timestamps
  [GetterTypes.TIMESTAMPS]({ timestamps, episodeUrl, episode, playerState }) {
    // Find the offset
    let timestampsOffset = episodeUrl?.timestampsOffset;
    if (timestampsOffset == null && episode?.baseDuration != null && playerState.duration != null) {
      timestampsOffset = Utils.computeTimestampsOffset(episode.baseDuration, playerState.duration);
    }

    // Apply the offset
    const offsetTimestamps = timestamps.map(timestamp => {
      const at = Utils.applyTimestampsOffset(timestampsOffset, timestamp.at);
      return {
        ...timestamp,
        at,
      };
    });

    const duration = playerState.duration;
    if (duration == null) return offsetTimestamps;

    // Remove out of bounds timestamps
    const offsetBoundedTimestamps = offsetTimestamps.filter(
      timestamp => timestamp.at <= duration && timestamp.at >= 0
    );
    return offsetBoundedTimestamps;
  },
  [GetterTypes.DRAFT_TIMESTAMPS](state) {
    let drafts = [...state.draftTimestamps];
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
  [GetterTypes.ACTIVE_TIMESTAMPS](state, getters) {
    return state.isEditing
      ? getters[GetterTypes.DRAFT_TIMESTAMPS]
      : getters[GetterTypes.TIMESTAMPS];
  },
  [GetterTypes.APPLY_TIMESTAMP_DIFF](state) {
    return function (timestamp) {
      const original = state.timestamps.find(t => t.id === timestamp.id);
      const edited = original?.at !== timestamp.at || original.typeId !== timestamp.typeId;
      return {
        ...timestamp,
        edited,
      };
    };
  },
  [GetterTypes.CAN_EDIT_TIMESTAMPS](state) {
    if (!state.isLoggedIn) return false;
    const episodeUrl = state.episodeUrl;
    if (episodeUrl == null) return false;
    const episode = state.episode;
    if (episode == null) return false;
    const { name, show } = episode;
    if (!name || !show?.name) return false;
    if (name === 'Unknown Episode' || show?.name === 'Unknown Show') return false;
    return true;
  },
  [GetterTypes.IS_SAVING_TIMESTAMPS](state) {
    return state.saveTimestampsRequestState === RequestState.LOADING;
  },
};
