import {
  REFRESH_TOKEN_DURATION,
  ACCESS_TOKEN_DURATION,
  DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS,
  DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS,
} from '@/common/utils/Constants';
import Browser from '@/common/utils/Browser';
import { MutationTree } from 'vuex';
import { MutationTypes } from './mutationTypes';
import RequestState from '../utils/RequestState';
import Utils from '../utils/Utils';
import { State } from './state';
import { changePlaybackRate, loginRequestState, persistAccount } from './mutationUtils';

// Typings /////////////////////////////////////////////////////////////////////

export interface Mutations {
  [MutationTypes.ACTIVE_DIALOG](state: State, dialogName: string | undefined): void;
  [MutationTypes.CHANGE_PLAYBACK_RATE](state: State, playbackRate: RequestState): void;
  [MutationTypes.TOGGLE_EDIT_MODE](state: State, isEditing: boolean): void;
  [MutationTypes.SET_TAB_URL](state: State, tabUrl: string): void;
  [MutationTypes.SET_HAS_SKIPPED_FROM_ZERO](state: State, hasSkippedFromZero: boolean): void;
  [MutationTypes.SET_DURATION](state: State, duration: number): void;
  [MutationTypes.SET_IS_INITIAL_BUFFER](state: State, newIsInitialBuffer: boolean): void;

  // Storage
  [MutationTypes.RESTORE_STATE](
    state: State,
    { changes, callback }: { changes: Partial<State>; callback?: () => void }
  ): void;
  [MutationTypes.PERSIST_PREFERENCES](state: State, payload: Api.Preferences): void;

  // Keyboard
  [MutationTypes.SET_PRIMARY_KEYBOARD_SHORTCUT](
    state: State,
    { type, value }: { type: KeyboardShortcutAction; value: string | undefined }
  ): void;
  [MutationTypes.SET_SECONDARY_KEYBOARD_SHORTCUT](
    state: State,
    { type, value }: { type: KeyboardShortcutAction; value: string | undefined }
  ): void;

  // Login
  [MutationTypes.LOG_IN](state: State, loginPayload: Api.LoginResponse): void;
  [MutationTypes.LOG_OUT](state: State): void;
  [MutationTypes.SET_LOGIN_REQUEST_STATE](state: State, requestState: RequestState): void;

  // Preferences
  [MutationTypes.TOGGLE_PREFERENCE](
    state: State,
    change: { preference: keyof Api.Preferences; value: boolean }
  ): void;
  [MutationTypes.SET_PREFERENCES_REQUEST_STATE](state: State, requestState: RequestState): void;

  // Shows
  [MutationTypes.SET_SEARCH_SHOWS_RESULT](state: State, shows: Api.ShowSearchResult[]): void;
  [MutationTypes.SET_SEARCH_SHOWS_REQUEST_STATE](state: State, requestState: RequestState): void;

  // Episodes
  [MutationTypes.SET_SEARCH_EPISODES_RESULT](
    state: State,
    episodes: Api.EpisodeSearchResult[]
  ): void;
  [MutationTypes.SET_SEARCH_EPISODES_REQUEST_STATE](state: State, requestState: RequestState): void;
  [MutationTypes.SET_EPISODE_URL](state: State, episodeUrl?: Api.EpisodeUrlNoEpisode): void;
  [MutationTypes.SET_EPISODE](state: State, episode?: Api.Episode): void;
  [MutationTypes.SET_INFERRED_EPISODE_INFO](state: State, episode?: InferredEpisodeInfo): void;
  [MutationTypes.SET_EPISODE_REQUEST_STATE](state: State, requestState: RequestState): void;
  [MutationTypes.SET_INITIAL_VIDEO_DATA_REQUEST_STATE](
    state: State,
    requestState: RequestState
  ): void;

  // Timestamps
  [MutationTypes.SET_ACTIVE_TIMESTAMP](state: State, timestamp: Api.AmbiguousTimestamp): void;
  [MutationTypes.CLEAR_ACTIVE_TIMESTAMP](state: State): void;
  [MutationTypes.SET_HOVERED_TIMESTAMP](state: State, timestamp: Api.AmbiguousTimestamp): void;
  [MutationTypes.CLEAR_HOVERED_TIMESTAMP](state: State): void;
  [MutationTypes.UPDATE_TIMESTAMP_IN_DRAFTS](
    state: State,
    newTimestamp: Api.AmbiguousTimestamp
  ): void;
  [MutationTypes.DELETE_DRAFT_TIMESTAMP](
    state: State,
    deletedTimestamp: Api.AmbiguousTimestamp
  ): void;
  [MutationTypes.SET_DRAFT_TIMESTAMPS](state: State, timestamps: Api.AmbiguousTimestamp[]): void;
  [MutationTypes.SET_TIMESTAMPS](state: State, timestamps: Api.AmbiguousTimestamp[]): void;
  [MutationTypes.CLEAR_EDIT_TIMESTAMP_MODE](state: State): void;
  [MutationTypes.SET_EDIT_TIMESTAMP_MODE](state: State, editMode: 'add' | 'edit' | undefined): void;
  [MutationTypes.SET_SAVE_TIMESTAMP_REQUEST_STATE](state: State, requestState: RequestState): void;
}

// Mutations ///////////////////////////////////////////////////////////////////

export const mutations: MutationTree<State> & Mutations = {
  // General
  [MutationTypes.ACTIVE_DIALOG](state, dialogName) {
    state.activeDialog = dialogName;
  },
  [MutationTypes.CHANGE_PLAYBACK_RATE]: changePlaybackRate,
  [MutationTypes.TOGGLE_EDIT_MODE](state, isEditing) {
    state.isEditing = isEditing;
  },
  [MutationTypes.SET_TAB_URL](state, tabUrl) {
    state.tabUrl = Browser.transformServiceUrl(tabUrl);
  },
  [MutationTypes.SET_HAS_SKIPPED_FROM_ZERO](state, hasSkippedFromZero) {
    state.hasSkippedFromZero = hasSkippedFromZero;
  },
  [MutationTypes.SET_DURATION](state, duration) {
    state.duration = duration;
  },
  [MutationTypes.SET_IS_INITIAL_BUFFER](state, newIsInitialBuffer: boolean) {
    state.isInitialBuffer = newIsInitialBuffer;
  },

  // Storage
  [MutationTypes.RESTORE_STATE](state, { changes, callback }) {
    for (const field in changes) {
      /* eslint-disable-next-line no-prototype-builtins */
      if (state.hasOwnProperty(field)) {
        if (field === 'playbackRate') {
          const playbackRate = (changes[field] as number) || 1;
          changePlaybackRate(state, playbackRate);
        } else {
          // @ts-ignore
          state[field] = changes[field]; // TODO: Test set
        }
      }
    }
    state.preferencesLastUpdatedAt = Date.now();
    if (callback) callback();
  },
  [MutationTypes.PERSIST_PREFERENCES](state, payload) {
    if (!state.account) {
      console.warn('updatePreference() called without account in the store');
      return;
    }
    state.account.preferences = payload; // TODO: Test set removal
    persistAccount(state);
  },

  // Keyboard
  [MutationTypes.SET_PRIMARY_KEYBOARD_SHORTCUT](state, { type, value }) {
    if (state.primaryKeyboardShortcuts == null) {
      state.primaryKeyboardShortcuts = {
        ...DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS,
        [type]: value,
      };
    } else {
      state.primaryKeyboardShortcuts[type] = value; // TODO: Test set removal
    }
    persistAccount(state);
  },
  [MutationTypes.SET_SECONDARY_KEYBOARD_SHORTCUT](state, { type, value }) {
    if (state.secondaryKeyboardShortcuts == null) {
      state.secondaryKeyboardShortcuts = {
        ...DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS,
        [type]: value,
      };
    } else {
      state.secondaryKeyboardShortcuts[type] = value; // TODO: Test set removal
    }
    persistAccount(state);
  },

  // Login
  [MutationTypes.LOG_IN](state, loginPayload) {
    const now = Date.now();

    state.token = loginPayload.authToken;
    state.tokenExpiresAt = now + ACCESS_TOKEN_DURATION;
    state.refreshToken = loginPayload.refreshToken;
    state.refreshTokenExpiresAt = now + REFRESH_TOKEN_DURATION;
    state.account = loginPayload.account;

    loginRequestState(state, RequestState.SUCCESS);
    persistAccount(state);
  },
  [MutationTypes.LOG_OUT](state) {
    state.token = undefined;
    state.tokenExpiresAt = undefined;
    state.refreshToken = undefined;
    state.refreshTokenExpiresAt = undefined;
    state.account = undefined;
    loginRequestState(state, RequestState.NOT_REQUESTED);
    persistAccount(state);
  },
  [MutationTypes.SET_LOGIN_REQUEST_STATE](state, requestState) {
    loginRequestState(state, requestState);
  },

  // Preferences
  [MutationTypes.TOGGLE_PREFERENCE](state, change) {
    if (!state.account) {
      console.warn('togglePref() called without account in the store');
      return;
    }
    state.account.preferences[change.preference] = change.value; // TODO: Test set removal
    state.preferencesLastUpdatedAt = Date.now();
  },
  [MutationTypes.SET_PREFERENCES_REQUEST_STATE](state, requestState) {
    state.preferencesRequestState = requestState;
  },

  // Shows
  [MutationTypes.SET_SEARCH_SHOWS_RESULT](state, shows = []) {
    state.searchShowsResult = shows;
  },
  [MutationTypes.SET_SEARCH_SHOWS_REQUEST_STATE](state, requestState) {
    state.searchShowsRequestState = requestState;
  },

  // Episodes
  [MutationTypes.SET_SEARCH_EPISODES_RESULT](state, episodes = []) {
    state.searchEpisodesResult = episodes;
  },
  [MutationTypes.SET_SEARCH_EPISODES_REQUEST_STATE](state, requestState) {
    state.searchEpisodesRequestState = requestState;
  },
  [MutationTypes.SET_EPISODE_URL](state, episodeUrl) {
    state.episodeUrl = episodeUrl;
  },
  [MutationTypes.SET_EPISODE](state, episode) {
    state.episode = episode;
    state.timestamps = (episode?.timestamps || []).sort(Utils.timestampSorter);
  },
  [MutationTypes.SET_INFERRED_EPISODE_INFO](state, episode) {
    state.inferredEpisodeInfo = episode;
  },
  [MutationTypes.SET_EPISODE_REQUEST_STATE](state, requestState) {
    state.episodeRequestState = requestState;
  },
  [MutationTypes.SET_INITIAL_VIDEO_DATA_REQUEST_STATE](state, requestState) {
    state.initialVideoDataRequestState = requestState;
  },

  // Timestamps
  [MutationTypes.SET_ACTIVE_TIMESTAMP](state, timestamp) {
    state.activeTimestamp = timestamp;
  },
  [MutationTypes.CLEAR_ACTIVE_TIMESTAMP](state) {
    state.activeTimestamp = undefined;
  },
  [MutationTypes.SET_HOVERED_TIMESTAMP](state, timestamp) {
    state.hoveredTimestamp = timestamp;
  },
  [MutationTypes.CLEAR_HOVERED_TIMESTAMP](state) {
    state.hoveredTimestamp = undefined;
  },
  [MutationTypes.UPDATE_TIMESTAMP_IN_DRAFTS](state, newTimestamp) {
    const index = state.draftTimestamps.findIndex(
      draftTimestamp => draftTimestamp.id === newTimestamp.id
    );
    let unsortedTimestamps: Api.AmbiguousTimestamp[];
    if (index == -1) {
      unsortedTimestamps = [...state.draftTimestamps, newTimestamp];
    } else {
      unsortedTimestamps = [...state.draftTimestamps];
      unsortedTimestamps[index] = newTimestamp;
    }
    state.draftTimestamps = unsortedTimestamps.sort(Utils.timestampSorter);
  },
  [MutationTypes.DELETE_DRAFT_TIMESTAMP](state, deletedTimestamp) {
    state.draftTimestamps = state.draftTimestamps.filter(item => {
      return item.id !== deletedTimestamp.id;
    });
  },
  [MutationTypes.SET_DRAFT_TIMESTAMPS](state, timestamps) {
    state.draftTimestamps = [...timestamps].sort(Utils.timestampSorter);
  },
  [MutationTypes.SET_TIMESTAMPS](state, timestamps) {
    state.timestamps = [...timestamps].sort(Utils.timestampSorter);
  },
  [MutationTypes.CLEAR_EDIT_TIMESTAMP_MODE](state) {
    state.editTimestampMode = undefined;
  },
  [MutationTypes.SET_EDIT_TIMESTAMP_MODE](state, editMode) {
    state.editTimestampMode = editMode;
  },
  [MutationTypes.SET_SAVE_TIMESTAMP_REQUEST_STATE](state, requestState) {
    state.saveTimestampsRequestState = requestState;
  },
};
