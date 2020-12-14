import Browser from '@/common/utils/Browser';
import { ActionContext, ActionTree } from 'vuex';
import { persistedKeys, TIMESTAMP_TYPE_NOT_SELECTED } from '@/common/utils/Constants';
import { sleep } from '../utils/GlobalUtils';
import { ActionTypes } from './actionTypes';
import RequestState from '../utils/RequestState';
import Utils from '../utils/Utils';
import Mappers from '../utils/Mappers';
import { State } from './state';
import { MutationTypes } from './mutationTypes';
import { assertLoggedIn, callApi } from './actionUtils';
import type { Store } from '.';
import { GetterTypes } from './getterTypes';

// Typings /////////////////////////////////////////////////////////////////////

export interface AugmentedActionContext<S = State>
  extends Omit<ActionContext<S, S>, 'commit' | 'getters'> {
  commit: Store['commit'];
  getters: Store['getters'];
}

export interface Actions {
  [ActionTypes.INITIAL_LOAD](context: AugmentedActionContext): Promise<void>;
  [ActionTypes.SHOW_DIALOG](context: AugmentedActionContext, dialogName?: string): Promise<void>;
  [ActionTypes.START_EDITING](
    context: AugmentedActionContext,
    onStartedEditing?: () => void
  ): Promise<void>;
  [ActionTypes.STOP_EDITING](
    context: AugmentedActionContext,
    discardChanges?: boolean
  ): Promise<void>;
  [ActionTypes.API_CALL]<R, A extends never[]>(
    context: AugmentedActionContext,
    payload: { apiCall: (...args: A) => Promise<R>; args: A }
  ): Promise<R>;
  [ActionTypes.CREATE_NEW_TIMESTAMP](context: AugmentedActionContext): Promise<void>;
  [ActionTypes.LOGIN_MANUAL](
    context: AugmentedActionContext,
    payload: LoginManualPayload
  ): Promise<void>;
  [ActionTypes.UPDATE_PREFERENCES](
    context: AugmentedActionContext,
    pref: keyof Api.Preferences
  ): Promise<void>;
  [ActionTypes.SEARCH_SHOWS](context: AugmentedActionContext, name: string): Promise<void>;
  [ActionTypes.LINK_EPISODE_URL](
    context: AugmentedActionContext,
    payload: { episode: Api.EpisodeSearchResult; onSuccess?: () => void }
  ): Promise<void>;
  [ActionTypes.CREATE_EPISODE_DATA](
    context: AugmentedActionContext,
    payload: CreateEpisodeDataPayload
  ): Promise<void>;
  [ActionTypes.CREATE_EPISODE_FROM_THIRD_PARTY](
    context: AugmentedActionContext,
    payload: { thirdPartyEpisode: Api.ThirdPartyEpisode; onSuccess?: () => void }
  ): Promise<void>;
  [ActionTypes.SEARCH_EPISODES](
    context: AugmentedActionContext,
    payload: { name: string; showId: string }
  ): Promise<void>;
  [ActionTypes.LOAD_ALL_EPISODE_DATA](
    context: AugmentedActionContext,
    tabUrl: string
  ): Promise<void>;
  [ActionTypes.FETCH_EPISODE_BY_URL](context: AugmentedActionContext, url: string): Promise<void>;
  [ActionTypes.INFER_EPISODE_INFO](context: AugmentedActionContext): Promise<void>;
  [ActionTypes.FETCH_THIRD_PARTY_EPISODE](
    context: AugmentedActionContext,
    payload: { name: string; showName: string }
  ): Promise<void>;
  [ActionTypes.ADD_MISSING_DURATIONS](
    context: AugmentedActionContext,
    duration: number
  ): Promise<void>;
  [ActionTypes.UPDATE_TIMESTAMPS](
    context: AugmentedActionContext,
    payload: {
      oldTimestamps: Api.Timestamp[];
      newTimestamps: Api.AmbiguousTimestamp[];
      episodeUrl: Api.EpisodeUrlNoEpisode;
      episode: Api.Episode;
    }
  ): Promise<void>;
}

// Actions /////////////////////////////////////////////////////////////////////

export const actions: ActionTree<State, State> & Actions = {
  // General
  async [ActionTypes.INITIAL_LOAD](context) {
    const newState = await Browser.storage.getAll<Partial<State>>(persistedKeys);
    context.commit(MutationTypes.RESTORE_STATE, { changes: newState });
  },
  async [ActionTypes.SHOW_DIALOG]({ state, commit }, dialogName) {
    if (state.activeDialog === dialogName) return;

    if (state.activeDialog) {
      commit(MutationTypes.ACTIVE_DIALOG, undefined);
      await sleep(250);
    }
    if (dialogName) {
      commit(MutationTypes.ACTIVE_DIALOG, dialogName);
    }
  },
  async [ActionTypes.START_EDITING]({ commit, dispatch, getters, state }, onStartedEditing) {
    if (!state.isLoggedIn) {
      await dispatch(ActionTypes.SHOW_DIALOG, 'AccountDialog');
      return;
    }
    if (!getters[GetterTypes.HAS_EPISODE]) {
      await dispatch(ActionTypes.SHOW_DIALOG, 'EditEpisodeDialog');
      return;
    }

    if (!state.isEditing) {
      commit(MutationTypes.TOGGLE_EDIT_MODE, true);
      commit(MutationTypes.SET_DRAFT_TIMESTAMPS, getters[GetterTypes.TIMESTAMPS]);
    }
    if (onStartedEditing != null) {
      onStartedEditing();
    }
  },
  async [ActionTypes.STOP_EDITING]({ state, commit, dispatch }, discardChanges) {
    if (!discardChanges) {
      const oldTimestamps = state.episode?.timestamps ?? [];
      const newTimestamps = state.draftTimestamps;
      await dispatch(ActionTypes.UPDATE_TIMESTAMPS, {
        oldTimestamps,
        newTimestamps,
        episodeUrl: state.episodeUrl!,
        episode: state.episode,
      });
    }
    commit(MutationTypes.TOGGLE_EDIT_MODE, false);
    commit(MutationTypes.SET_DRAFT_TIMESTAMPS, []);
  },
  async [ActionTypes.API_CALL]({ commit }, { apiCall, args }) {
    return await callApi(commit, apiCall, ...args);
  },
  async [ActionTypes.CREATE_NEW_TIMESTAMP]({ commit, dispatch }) {
    const video = global.getVideo();
    video.pause();

    await dispatch(ActionTypes.START_EDITING, () => {
      commit(MutationTypes.SET_EDIT_TIMESTAMP_MODE, 'add');
      commit(MutationTypes.SET_ACTIVE_TIMESTAMP, {
        at: video.currentTime,
        typeId: TIMESTAMP_TYPE_NOT_SELECTED,
        id: Utils.randomId(),
        source: 'ANIME_SKIP',
        edited: true,
      });
      dispatch(ActionTypes.SHOW_DIALOG, 'TimestampsPanel');
    });
  },

  // Auth
  async [ActionTypes.LOGIN_MANUAL]({ commit }, { username, password, callback }) {
    try {
      commit(MutationTypes.SET_LOGIN_REQUEST_STATE, RequestState.LOADING);
      const loginData = await callApi(commit, global.Api.loginManual, username, password);
      commit(MutationTypes.LOG_IN, loginData);
      commit(MutationTypes.SET_LOGIN_REQUEST_STATE, RequestState.SUCCESS);
      callback?.();
    } catch (err) {
      console.warn('actions.loginManual', err);
      commit(MutationTypes.SET_LOGIN_REQUEST_STATE, RequestState.FAILURE);
    }
  },

  // Preferences
  async [ActionTypes.UPDATE_PREFERENCES](context, preference) {
    const { commit } = context;
    try {
      assertLoggedIn(context);
      const { state } = context;
      const allPreferences = state.account.preferences;
      const newValue = !allPreferences[preference];
      try {
        const newPreferences = {
          ...allPreferences,
          [preference]: newValue,
        };
        commit(MutationTypes.SET_PREFERENCES_REQUEST_STATE, RequestState.LOADING);
        commit(MutationTypes.TOGGLE_PREFERENCE, { preference, value: newValue });
        await callApi(commit, global.Api.updatePreferences, newPreferences);
        commit(MutationTypes.SET_PREFERENCES_REQUEST_STATE, RequestState.SUCCESS);
        commit(MutationTypes.PERSIST_PREFERENCES, newPreferences);
      } catch (err) {
        commit(MutationTypes.SET_PREFERENCES_REQUEST_STATE, RequestState.FAILURE);
        setTimeout(() => {
          commit(MutationTypes.TOGGLE_PREFERENCE, { preference, value: !newValue });
        }, 200);
        throw err;
      }
    } catch (err) {
      console.warn('actions.updatePreferences', err);
    }
  },

  // Shows
  async [ActionTypes.SEARCH_SHOWS]({ commit }, name) {
    try {
      commit(MutationTypes.SET_SEARCH_SHOWS_REQUEST_STATE, RequestState.LOADING);
      const results = await callApi(commit, global.Api.searchShows, name);
      commit(MutationTypes.SET_SEARCH_SHOWS_REQUEST_STATE, RequestState.SUCCESS);
      commit(MutationTypes.SET_SEARCH_SHOWS_RESULT, results);
    } catch (err) {
      console.warn('actions.searchShows', err);
      commit(MutationTypes.SET_SEARCH_SHOWS_REQUEST_STATE, RequestState.FAILURE);
    }
  },

  // Episodes
  async [ActionTypes.LINK_EPISODE_URL](
    { commit, state, dispatch },
    { episode, onSuccess }
  ): Promise<void> {
    commit(MutationTypes.SET_EPISODE_REQUEST_STATE, RequestState.LOADING);

    const duration = state.duration;
    const baseDuration = episode.baseDuration;
    let timestampsOffset: number | undefined;
    if (baseDuration != null && duration != null) {
      timestampsOffset = Utils.computeTimestampsOffset(baseDuration, duration);
    }
    const episodeUrl: Api.InputEpisodeUrl = {
      url: state.tabUrl,
      duration,
      timestampsOffset,
    };

    try {
      await callApi(commit, global.Api.deleteEpisodeUrl, episodeUrl.url);
    } catch (err) {
      // Do nothing
    }
    try {
      await callApi(commit, global.Api.createEpisodeUrl, episodeUrl, episode.id);
      commit(MutationTypes.SET_EPISODE_REQUEST_STATE, RequestState.SUCCESS);
      onSuccess?.();
      await dispatch(ActionTypes.FETCH_EPISODE_BY_URL, episodeUrl.url);
    } catch (err) {
      console.warn('Failed to create new EpisodeUrl', err);
      commit(MutationTypes.SET_EPISODE_REQUEST_STATE, RequestState.FAILURE);
    }
  },
  async [ActionTypes.CREATE_EPISODE_DATA](
    { commit, dispatch, state },
    { show: showData, episode: episodeData, episodeUrl: episodeUrlData }
  ) {
    try {
      // Setup
      dispatch(ActionTypes.SHOW_DIALOG, undefined);
      commit(MutationTypes.SET_EPISODE_REQUEST_STATE, RequestState.LOADING);

      // Show
      let showId: string;
      if (showData.create) {
        const result = await await callApi(commit, global.Api.createShow, {
          name: showData.name,
        });
        showId = result.id;
      } else {
        showId = showData.showId;
      }

      // Episode
      let episodeId: string;
      if (episodeData.create) {
        const result = await callApi(commit, global.Api.createEpisode, episodeData.data, showId);
        episodeId = result.id;
      } else {
        episodeId = episodeData.episodeId;
      }

      // EpisodeUrl
      let episodeUrl: Api.EpisodeUrlNoEpisode;
      if (episodeUrlData.create) {
        try {
          await callApi(commit, global.Api.deleteEpisodeUrl, episodeUrlData.data.url);
        } catch (err) {
          // Do nothing
        }
        episodeUrl = await callApi(
          commit,
          global.Api.createEpisodeUrl,
          episodeUrlData.data,
          episodeId
        );
      } else {
        episodeUrl = state.episodeUrl!;
      }

      // Update the data
      await dispatch(ActionTypes.FETCH_EPISODE_BY_URL, episodeUrl.url);
      commit(MutationTypes.SET_EPISODE_REQUEST_STATE, RequestState.SUCCESS);
    } catch (err) {
      console.warn('actions.createEpisodeData', err);
      commit(MutationTypes.SET_EPISODE_REQUEST_STATE, RequestState.FAILURE);
    }
  },
  async [ActionTypes.CREATE_EPISODE_FROM_THIRD_PARTY](
    { commit, state, dispatch },
    { thirdPartyEpisode, onSuccess }
  ) {
    commit(MutationTypes.SET_EPISODE_REQUEST_STATE, RequestState.LOADING);
    try {
      const showName = thirdPartyEpisode.show.name;
      const showSearchResults = await callApi(commit, global.Api.searchShows, showName);
      const existingShow: Api.ShowSearchResult | undefined = showSearchResults.filter(
        searchResult => searchResult.name.toUpperCase() === showName.toUpperCase()
      )[0];
      commit(MutationTypes.SET_EPISODE_REQUEST_STATE, RequestState.LOADING);

      const episode: Api.InputEpisode = {
        name: thirdPartyEpisode.name,
        absoluteNumber: thirdPartyEpisode.absoluteNumber,
        baseDuration: thirdPartyEpisode.baseDuration ?? state.duration,
        number: thirdPartyEpisode.number,
        season: thirdPartyEpisode.season,
      };
      const episodeUrl: Api.InputEpisodeUrl = {
        url: state.tabUrl,
        duration: state.duration,
        timestampsOffset:
          state.duration != null && thirdPartyEpisode.baseDuration != null
            ? Utils.computeTimestampsOffset(thirdPartyEpisode.baseDuration, state.duration)
            : undefined,
      };
      const payload: CreateEpisodeDataPayload = {
        show:
          existingShow == null
            ? {
                create: true,
                name: showName,
              }
            : {
                create: false,
                showId: existingShow.id,
              },
        episode: {
          create: true,
          data: episode,
        },
        episodeUrl: {
          create: true,
          data: episodeUrl,
        },
      };

      await dispatch(ActionTypes.CREATE_EPISODE_DATA, payload);
      if (thirdPartyEpisode.timestamps.length > 0) {
        console.info(
          'Timestamps:',
          JSON.parse(
            JSON.stringify({
              thirdParty: thirdPartyEpisode.timestamps,
              ambiguous: Mappers.thirdPartyEpisodeToAmbiguousTimestamps(thirdPartyEpisode),
            })
          )
        );
        const timestamps = Mappers.thirdPartyEpisodeToAmbiguousTimestamps(thirdPartyEpisode);
        const offsetTimestamps = timestamps.map(timestamp => ({
          ...timestamp,
          at: Utils.applyTimestampsOffset(episodeUrl.timestampsOffset, timestamp.at),
        }));
        await dispatch(ActionTypes.UPDATE_TIMESTAMPS, {
          oldTimestamps: [],
          newTimestamps: offsetTimestamps,
          episodeUrl: state.episodeUrl,
          episode: state.episode,
        });
      }
      onSuccess?.();
      commit(MutationTypes.SET_EPISODE_REQUEST_STATE, RequestState.SUCCESS);
    } catch (err) {
      console.warn('Failed to create episode from third party data', err);
      commit(MutationTypes.SET_EPISODE_REQUEST_STATE, RequestState.FAILURE);
    }
  },
  async [ActionTypes.SEARCH_EPISODES]({ commit }, { name, showId }) {
    try {
      commit(MutationTypes.SET_SEARCH_EPISODES_REQUEST_STATE, RequestState.LOADING);
      const results = await callApi(commit, global.Api.searchEpisodes, name, showId);
      commit(MutationTypes.SET_SEARCH_EPISODES_RESULT, results);
      commit(MutationTypes.SET_SEARCH_EPISODES_REQUEST_STATE, RequestState.SUCCESS);
    } catch (err) {
      console.warn('actions.searchEpisodes', err);
      commit(MutationTypes.SET_SEARCH_EPISODES_REQUEST_STATE, RequestState.FAILURE);
    }
  },
  async [ActionTypes.LOAD_ALL_EPISODE_DATA]({ commit, dispatch, state }, tabUrl = state.tabUrl) {
    commit(MutationTypes.SET_TIMESTAMPS, []);
    commit(MutationTypes.SET_EPISODE_URL, undefined);
    commit(MutationTypes.SET_EPISODE, undefined);
    commit(MutationTypes.SET_INFERRED_EPISODE_INFO, undefined);
    commit(MutationTypes.SET_IS_INITIAL_BUFFER, true);

    commit(MutationTypes.SET_INITIAL_VIDEO_DATA_REQUEST_STATE, RequestState.LOADING);
    try {
      await Promise.all([
        dispatch(ActionTypes.INFER_EPISODE_INFO),
        dispatch(ActionTypes.FETCH_EPISODE_BY_URL, tabUrl),
      ]);
      commit(MutationTypes.SET_INITIAL_VIDEO_DATA_REQUEST_STATE, RequestState.SUCCESS);
    } catch (err) {
      commit(MutationTypes.SET_INITIAL_VIDEO_DATA_REQUEST_STATE, RequestState.FAILURE);
    }

    if (
      state.episodeUrl == null &&
      state.inferredEpisodeInfo?.name != null &&
      state.inferredEpisodeInfo?.show != null
    ) {
      dispatch(ActionTypes.FETCH_THIRD_PARTY_EPISODE, {
        name: state.inferredEpisodeInfo.name,
        showName: state.inferredEpisodeInfo.show,
      });
    }
  },
  async [ActionTypes.FETCH_EPISODE_BY_URL]({ commit }: AugmentedActionContext, url) {
    try {
      commit(MutationTypes.SET_EPISODE_REQUEST_STATE, RequestState.LOADING);
      const { episode, ...episodeUrl } = await callApi(commit, global.Api.fetchEpisodeByUrl, url);
      commit(MutationTypes.SET_EPISODE_URL, episodeUrl);
      commit(MutationTypes.SET_EPISODE, episode);
      commit(MutationTypes.SET_EPISODE_REQUEST_STATE, RequestState.SUCCESS);
    } catch (err) {
      console.warn('actions.fetchEpisodeByUrl', err);
      commit(MutationTypes.SET_EPISODE_URL, undefined);
    }
  },
  async [ActionTypes.INFER_EPISODE_INFO]({ commit }) {
    try {
      commit(MutationTypes.SET_EPISODE_REQUEST_STATE, RequestState.LOADING);
      const episodeInfo = await global.inferEpisodeInfo();
      if (episodeInfo == null) throw new Error('Could not infer episode info');
      commit(MutationTypes.SET_EPISODE_REQUEST_STATE, RequestState.SUCCESS);
      commit(MutationTypes.SET_INFERRED_EPISODE_INFO, episodeInfo);
    } catch (err) {
      console.warn('actions.inferEpisodeInfo', err);
      commit(MutationTypes.SET_EPISODE_REQUEST_STATE, RequestState.FAILURE);
      commit(MutationTypes.SET_EPISODE_URL, undefined);
    }
  },
  async [ActionTypes.FETCH_THIRD_PARTY_EPISODE]({ commit }, { name, showName }) {
    console.log({ name, showName });
    try {
      commit(MutationTypes.SET_EPISODE_REQUEST_STATE, RequestState.LOADING);
      const episodes: Api.ThirdPartyEpisode[] = await callApi(
        commit,
        global.Api.fetchEpisodeByName,
        name,
        showName
      );
      const episodesWithTimestamps = episodes.filter(episode => episode.timestamps.length > 0);
      if (episodesWithTimestamps.length > 0) {
        const episode = episodesWithTimestamps[0];
        const timestamps = Mappers.thirdPartyEpisodeToAmbiguousTimestamps(episode);
        commit(MutationTypes.SET_EPISODE_URL, undefined);
        commit(MutationTypes.SET_EPISODE, {
          ...episode,
          // TODO! Fix this typing
          // @ts-ignore
          timestamps,
        });
      }
      commit(MutationTypes.SET_EPISODE_REQUEST_STATE, RequestState.SUCCESS);
    } catch (err) {
      console.warn('actions.fetchThirdPartyEpisode', err);
      commit(MutationTypes.SET_EPISODE_URL, undefined);
      commit(MutationTypes.SET_EPISODE, undefined);
    }
  },
  async [ActionTypes.ADD_MISSING_DURATIONS]({ commit, state, getters }, duration) {
    if (!state.isLoggedIn || !duration) return;

    const episodeUrl = state.episodeUrl;
    const episode = state.episode;

    if (episodeUrl == null || episode == null) {
      console.log('Did not update durations, episode or url was undefined', {
        episode,
        episodeUrl,
      });
    } else {
      const newBaseDuration = episode.baseDuration ?? duration;
      const newUrlDuration = episodeUrl.duration ?? duration;
      const newTimestampsOffset =
        episodeUrl.timestampsOffset ??
        Utils.computeTimestampsOffset(newBaseDuration, newUrlDuration);

      let newEpisode = { ...episode };
      if (newBaseDuration != episode.baseDuration) {
        newEpisode = await callApi(commit, global.Api.updateEpisode, episode.id, {
          absoluteNumber: episode.absoluteNumber,
          baseDuration: newBaseDuration,
          name: episode.name,
          number: episode.number,
          season: episode.season,
        });
      }
      let newEpisodeUrlNoEpisode: Api.EpisodeUrlNoEpisode = { ...episodeUrl };
      if (
        newUrlDuration != episodeUrl.duration ||
        newTimestampsOffset != episodeUrl.timestampsOffset
      ) {
        newEpisodeUrlNoEpisode = await callApi(
          commit,
          global.Api.updateEpisodeUrl,
          episodeUrl.url,
          {
            url: episodeUrl.url,
            duration: newUrlDuration,
            timestampsOffset: newTimestampsOffset,
          }
        );
      }
      commit(MutationTypes.SET_EPISODE_URL, newEpisodeUrlNoEpisode);
      commit(MutationTypes.SET_EPISODE, newEpisode);
    }
  },

  // Timestamps
  async [ActionTypes.UPDATE_TIMESTAMPS](
    { commit, dispatch },
    { oldTimestamps: offsetOldTimestamps, newTimestamps: offsetNewTimestamps, episodeUrl, episode }
  ) {
    const removeOffset = <T extends Api.AmbiguousTimestamp>(timestamp: T): T => {
      const at = Utils.undoTimestampOffset(episodeUrl?.timestampsOffset, timestamp.at);
      return {
        ...timestamp,
        at,
      };
    };
    const oldTimestamps: Api.Timestamp[] = offsetOldTimestamps.map(removeOffset);
    const newTimestamps: Api.AmbiguousTimestamp[] = offsetNewTimestamps.map(removeOffset);
    commit(MutationTypes.SET_SAVE_TIMESTAMP_REQUEST_STATE, RequestState.LOADING);
    const { toCreate, toUpdate, toDelete } = Utils.computeTimestampDiffs(
      oldTimestamps,
      newTimestamps
    );
    commit(MutationTypes.SET_TIMESTAMPS, newTimestamps);

    try {
      for (const toCreateItem of toCreate) {
        await callApi(commit, global.Api.createTimestamp, episode.id, toCreateItem);
      }
      for (const toUpdateItem of toUpdate) {
        await callApi(commit, global.Api.updateTimestamp, toUpdateItem);
      }
      for (const toDeleteItem of toDelete) {
        await callApi(commit, global.Api.deleteTimestamp, toDeleteItem.id);
      }
      commit(MutationTypes.SET_SAVE_TIMESTAMP_REQUEST_STATE, RequestState.SUCCESS);
    } catch (err) {
      commit(MutationTypes.SET_SAVE_TIMESTAMP_REQUEST_STATE, RequestState.FAILURE);
      commit(MutationTypes.SET_TIMESTAMPS, oldTimestamps);
    }
    dispatch(ActionTypes.FETCH_EPISODE_BY_URL, episodeUrl.url);
  },
};
