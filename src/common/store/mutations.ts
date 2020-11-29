import {
  persistedKeys,
  REFRESH_TOKEN_DURATION,
  ACCESS_TOKEN_DURATION,
  DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS,
  DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS,
} from '@/common/utils/Constants';
import Browser from '@/common/utils/Browser';
import Vue from 'vue';
import { Mutation } from 'vuex';
import types from './mutationTypes';
import { as } from '../utils/GlobalUtils';
import RequestState from '../utils/RequestState';
import Utils from '../utils/Utils';

// Helpers /////////////////////////////////////////////////////////////////////

async function persistAccount(state: VuexState): Promise<void> {
  for (const key of persistedKeys) {
    await Browser.storage.setItem(key, state[key]);
  }
}

function loginRequestState(state: VuexState, loginRequestState: RequestState): void {
  state.loginRequestState = loginRequestState;
  Browser.storage.setItem('loginRequestState', loginRequestState);
}

function changePlaybackRate(state: VuexState, playbackRate: RequestState): void {
  state.playbackRate = playbackRate;
  Browser.storage.getItem('playbackRate').then(storedRate => {
    if (storedRate !== playbackRate) {
      Browser.storage.setItem('playbackRate', playbackRate);
    }
  });

  const video = global.getVideo();
  if (video) {
    video.playbackRate = playbackRate || 1;
  }
}

// Mutations ///////////////////////////////////////////////////////////////////

export default as<
  {
    [type in ValueOf<typeof types>]: Mutation<VuexState>;
  }
>({
  // General
  [types.activeDialog](state, dialogName: string | undefined) {
    state.activeDialog = dialogName;
  },
  [types.changePlaybackRate]: changePlaybackRate,
  [types.toggleEditMode](state, isEditing: boolean) {
    state.isEditing = isEditing;
  },
  [types.setTabUrl](state, tabUrl) {
    state.tabUrl = Browser.transformServiceUrl(tabUrl);
  },
  [types.setHasSkippedFromZero](state, hasSkippedFromZero) {
    state.hasSkippedFromZero = hasSkippedFromZero;
  },
  [types.setDuration](state, duration) {
    state.duration = duration;
  },

  // Storage
  [types.restoreState](
    state,
    { changes, callback }: { changes: Partial<VuexState>; callback?: () => void }
  ) {
    for (const field in changes) {
      /* eslint-disable-next-line no-prototype-builtins */
      if (state.hasOwnProperty(field)) {
        if (field === 'playbackRate') {
          const playbackRate = (changes[field] as number) || 1;
          changePlaybackRate(state, playbackRate);
        } else {
          // @ts-ignore
          Vue.set(state, field, changes[field]);
        }
      }
    }
    state.preferencesLastUpdatedAt = Date.now();
    if (callback) callback();
  },
  [types.persistPreferences](state, payload: Api.Preferences) {
    if (!state.account) {
      console.warn('updatePreference() called without account in the store');
      return;
    }
    Vue.set(state.account, 'preferences', payload);
    persistAccount(state);
  },

  // Keyboard
  [types.setPrimaryKeyboardShortcut](
    state,
    { type, value }: { type: KeyboardShortcutAction; value: string | undefined }
  ) {
    if (state.primaryKeyboardShortcuts == null) {
      state.primaryKeyboardShortcuts = {
        ...DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS,
        [type]: value,
      };
    } else {
      Vue.set(state.primaryKeyboardShortcuts, type, value);
    }
    persistAccount(state);
  },
  [types.setSecondaryKeyboardShortcut](
    state,
    { type, value }: { type: KeyboardShortcutAction; value: string | undefined }
  ) {
    if (state.secondaryKeyboardShortcuts == null) {
      state.secondaryKeyboardShortcuts = {
        ...DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS,
        [type]: value,
      };
    } else {
      Vue.set(state.secondaryKeyboardShortcuts, type, value);
    }
    persistAccount(state);
  },

  // Login
  [types.login](state, loginPayload: Api.LoginResponse) {
    const now = Date.now();

    state.token = loginPayload.authToken;
    state.tokenExpiresAt = now + ACCESS_TOKEN_DURATION;
    state.refreshToken = loginPayload.refreshToken;
    state.refreshTokenExpiresAt = now + REFRESH_TOKEN_DURATION;
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
  [types.togglePref](state, change: { pref: keyof Api.Preferences; value: boolean }) {
    if (!state.account) {
      console.warn('togglePref() called without account in the store');
      return;
    }
    Vue.set(state.account.preferences, change.pref, change.value);
    state.preferencesLastUpdatedAt = Date.now();
  },
  [types.preferencesRequestState](state, requestState: RequestState) {
    state.preferencesRequestState = requestState;
  },

  // Shows
  [types.searchShowsResult](state, shows: Api.ShowSearchResult[] = []) {
    state.searchShowsResult = shows;
  },
  [types.searchShowsRequestState](state, requestState: RequestState) {
    state.searchShowsRequestState = requestState;
  },

  // Episodes
  [types.searchEpisodesResult](state, episodes: Api.EpisodeSearchResult[] = []) {
    state.searchEpisodesResult = episodes;
  },
  [types.searchEpisodesRequestState](state, requestState: RequestState) {
    state.searchEpisodesRequestState = requestState;
  },
  [types.setEpisodeUrl](state, episodeUrl?: Api.EpisodeUrlNoEpisode) {
    state.episodeUrl = episodeUrl;
  },
  [types.setEpisode](state, episode?: Api.Episode) {
    state.episode = episode;
    state.timestamps = (episode?.timestamps || []).sort(Utils.timestampSorter);
  },
  [types.setInferredEpisodeInfo](state, episode?: InferredEpisodeInfo) {
    state.inferredEpisodeInfo = episode;
  },
  [types.episodeRequestState](state, requestState: RequestState) {
    state.episodeRequestState = requestState;
  },

  // Timestamps
  [types.setActiveTimestamp](state, timestamp: Api.AmbigousTimestamp) {
    state.activeTimestamp = timestamp;
  },
  [types.clearActiveTimestamp](state) {
    state.activeTimestamp = undefined;
  },
  [types.updateDraftTimestamp](state, newTimestamp: Api.AmbigousTimestamp) {
    const index = state.draftTimestamps.findIndex(
      draftTimestamp => draftTimestamp.id === newTimestamp.id
    );
    let unsortedTimestamps: Api.AmbigousTimestamp[];
    if (index == -1) {
      unsortedTimestamps = [...state.draftTimestamps, newTimestamp];
    } else {
      unsortedTimestamps = [...state.draftTimestamps];
      unsortedTimestamps[index] = newTimestamp;
    }
    state.draftTimestamps = unsortedTimestamps.sort(Utils.timestampSorter);
  },
  [types.deleteDraftTimestamp](state, deletedTimestamp: Api.AmbigousTimestamp) {
    state.draftTimestamps = state.draftTimestamps.filter(item => {
      return item.id !== deletedTimestamp.id;
    });
  },
  [types.setDraftTimestamps](state, timestamps: Api.AmbigousTimestamp[]) {
    state.draftTimestamps = [...timestamps].sort(Utils.timestampSorter);
  },
  [types.setTimestamps](state, timestamps: Api.AmbigousTimestamp[]) {
    state.timestamps = [...timestamps].sort(Utils.timestampSorter);
  },
  [types.clearEditTimestampMode](state) {
    state.editTimestampMode = undefined;
  },
  [types.setEditTimestampMode](state, editMode: 'add' | 'edit' | undefined) {
    state.editTimestampMode = editMode;
  },
  [types.setSaveTimestampRequestState](state, requestState: RequestState) {
    state.saveTimestampsRequestState = requestState;
  },
});
