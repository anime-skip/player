import Browser from '@/common/utils/Browser';
import { ActionContext, Action } from 'vuex';
import {
  persistedKeys,
  TIMESTAMP_TYPE_NOT_SELECTED,
  UNAUTHORIZED_ERROR_MESSAGE,
} from '@/common/utils/Constants';
import mutations from './mutationTypes';
import { as, sleep } from '../utils/GlobalUtils';
import types from './actionTypes';
import RequestState from '../utils/RequestState';
import { AssertionError } from 'assert';
import mutationTypes from './mutationTypes';
import Utils from '../utils/Utils';
import Mappers from '../utils/Mappers';

// TODO make everything async

type VuexStateWithAccount = VuexState & { account: Api.Account };

// Helpers /////////////////////////////////////////////////////////////////////

function assertLoggedIn(
  context: ActionContext<VuexState, VuexState>
): asserts context is ActionContext<VuexStateWithAccount, VuexStateWithAccount> {
  if (context.state.account == null) {
    context.commit(mutations.loginRequestState, RequestState.NOT_REQUESTED);
    throw new AssertionError({ message: 'state.account does not exist, log in again' });
  }
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
async function callApi<A extends any[], R>(
  commit: ActionContext<VuexState, VuexState>['commit'],
  apiMethod: (...args: A) => Promise<R>,
  ...args: A
): Promise<R> {
  try {
    return await apiMethod(...args);
  } catch (err) {
    if (err.message == UNAUTHORIZED_ERROR_MESSAGE) {
      commit(mutationTypes.logOut);
    }
    throw err;
  }
}

// Actions /////////////////////////////////////////////////////////////////////

export default as<{ [type in ValueOf<typeof types>]: Action<VuexState, VuexState> }>({
  // General
  async [types.initialLoad](context) {
    const newState = await Browser.storage.getAll<Partial<VuexState>>(persistedKeys);
    context.commit(mutations.restoreState, { changes: newState });
  },
  async [types.showDialog]({ state, commit }, dialogName?: string) {
    if (state.activeDialog === dialogName) return;

    if (state.activeDialog) {
      commit(mutations.activeDialog, undefined);
      await sleep(250);
    }
    if (dialogName) {
      commit(mutations.activeDialog, dialogName);
    }
  },
  async [types.startEditing]({ commit, dispatch, getters }, onStartedEditing?: () => void) {
    if (!getters.isLoggedIn) {
      await dispatch(types.showDialog, 'AccountDialog');
      return;
    }
    if (!getters.hasEpisode) {
      await dispatch(types.showDialog, 'EditEpisodeDialog');
      return;
    }

    if (!getters.isEditing) {
      commit(mutations.toggleEditMode, true);
      commit(mutations.setDraftTimestamps, getters.timestamps);
    }
    if (onStartedEditing != null) {
      onStartedEditing();
    }
  },
  async [types.stopEditing]({ state, commit, dispatch }, discardChanges?: boolean) {
    if (!discardChanges) {
      const oldTimestamps = state.episode?.timestamps ?? [];
      const newTimestamps = state.draftTimestamps;
      await dispatch(types.updateTimestamps, {
        oldTimestamps,
        newTimestamps,
        episodeUrl: state.episodeUrl!,
        episode: state.episode,
      });
    }
    commit(mutations.toggleEditMode, false);
    commit(mutations.setDraftTimestamps, []);
  },
  async [types.apiCall](
    { commit },
    { apiCall, args }: { apiCall: (...args: unknown[]) => Promise<never>; args: never[] }
  ) {
    return await callApi(commit, apiCall, ...args);
  },
  async [types.createNewTimestamp]({ commit, dispatch }) {
    const video = global.getVideo();
    video.pause();

    await dispatch(types.startEditing, () => {
      commit(mutationTypes.setEditTimestampMode, 'add');
      commit(mutationTypes.setActiveTimestamp, {
        at: video.currentTime,
        typeId: TIMESTAMP_TYPE_NOT_SELECTED,
        id: Utils.randomId(),
        source: 'ANIME_SKIP',
        edited: true,
      });
      dispatch(types.showDialog, 'TimestampsPanel');
    });
  },

  // Auth
  async [types.loginManual]({ commit }, { username, password, callback }: LoginManualPayload) {
    try {
      commit(mutations.loginRequestState, RequestState.LOADING);
      const loginData = await callApi(commit, global.Api.loginManual, username, password);
      commit(mutations.login, loginData);
      commit(mutations.loginRequestState, RequestState.SUCCESS);
      callback?.();
    } catch (err) {
      console.warn('actions.loginManual', err);
      commit(mutations.loginRequestState, RequestState.FAILURE);
    }
  },

  // Preferences
  async [types.updatePreferences](context, pref: keyof Api.Preferences) {
    const { commit } = context;
    try {
      assertLoggedIn(context);
      const { state } = context;
      const allPreferences = state.account.preferences;
      const newValue = !allPreferences[pref];
      try {
        const newPreferences = {
          ...allPreferences,
          [pref]: newValue,
        };
        commit(mutations.preferencesRequestState, RequestState.LOADING);
        commit(mutations.togglePref, { pref, value: newValue });
        await callApi(commit, global.Api.updatePreferences, newPreferences);
        commit(mutations.preferencesRequestState, RequestState.SUCCESS);
        commit(mutations.persistPreferences, newPreferences);
      } catch (err) {
        commit(mutations.preferencesRequestState, RequestState.FAILURE);
        setTimeout(() => {
          commit(mutations.togglePref, { pref, value: !newValue });
        }, 200);
        throw err;
      }
    } catch (err) {
      console.warn('actions.updatePreferences', err);
    }
  },

  // Shows
  async [types.searchShows]({ commit }, name: string) {
    try {
      commit(mutationTypes.searchShowsRequestState, RequestState.LOADING);
      const results = await callApi(commit, global.Api.searchShows, name);
      commit(mutationTypes.searchShowsRequestState, RequestState.SUCCESS);
      commit(mutationTypes.searchShowsResult, results);
    } catch (err) {
      console.warn('actions.searchShows', err);
      commit(mutationTypes.searchShowsRequestState, RequestState.FAILURE);
    }
  },

  // Episodes
  async [types.linkEpisodeUrl](
    { state, commit, dispatch },
    { episode, onSuccess }: { episode: Api.EpisodeSearchResult; onSuccess?: () => void }
  ): Promise<void> {
    commit(mutationTypes.episodeRequestState, RequestState.LOADING);

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
      commit(mutationTypes.episodeRequestState, RequestState.SUCCESS);
      onSuccess?.();
      await dispatch(types.fetchEpisodeByUrl, episodeUrl.url);
    } catch (err) {
      console.warn('Failed to create new EpisodeUrl', err);
      commit(mutationTypes.episodeRequestState, RequestState.FAILURE);
    }
  },
  async [types.createEpisodeData](
    { state, commit, dispatch },
    { show: showData, episode: episodeData, episodeUrl: episodeUrlData }: CreateEpisodeDataPayload
  ) {
    try {
      // Setup
      dispatch(types.showDialog, undefined);
      commit(mutationTypes.episodeRequestState, RequestState.LOADING);

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
      await dispatch(types.fetchEpisodeByUrl, episodeUrl.url);
      commit(mutationTypes.episodeRequestState, RequestState.SUCCESS);
    } catch (err) {
      console.warn('actions.createEpisodeData', err);
      commit(mutationTypes.episodeRequestState, RequestState.FAILURE);
    }
  },
  async [types.createEpisodeFromThirdParty](
    { state, commit, dispatch },
    {
      thirdPartyEpisode,
      onSuccess,
    }: { thirdPartyEpisode: Api.ThirdPartyEpisode; onSuccess?: () => void }
  ) {
    commit(mutationTypes.episodeRequestState, RequestState.LOADING);
    try {
      const showName = thirdPartyEpisode.show.name;
      const showSearchResults = await callApi(commit, global.Api.searchShows, showName);
      const existingShow: Api.ShowSearchResult | undefined = showSearchResults.filter(
        searchResult => searchResult.name.toUpperCase() === showName.toUpperCase()
      )[0];
      commit(mutationTypes.episodeRequestState, RequestState.LOADING);

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

      await dispatch(types.createEpisodeData, payload);
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
        await dispatch(types.updateTimestamps, {
          oldTimestamps: [],
          newTimestamps: offsetTimestamps,
          episodeUrl: state.episodeUrl,
          episode: state.episode,
        });
      }
      onSuccess?.();
      commit(mutationTypes.episodeRequestState, RequestState.SUCCESS);
    } catch (err) {
      console.warn('Failed to create episode from third party data', err);
      commit(mutationTypes.episodeRequestState, RequestState.FAILURE);
    }
  },
  async [types.searchEpisodes]({ commit }, { name, showId }: { name: string; showId: string }) {
    try {
      commit(mutationTypes.searchEpisodesRequestState, RequestState.LOADING);
      const results = await callApi(commit, global.Api.searchEpisodes, name, showId);
      commit(mutationTypes.searchEpisodesResult, results);
      commit(mutationTypes.searchEpisodesRequestState, RequestState.SUCCESS);
    } catch (err) {
      console.warn('actions.searchEpisodes', err);
      commit(mutationTypes.searchEpisodesRequestState, RequestState.FAILURE);
    }
  },
  async [types.loadAllEpisodeData]({ commit, dispatch, state }, tabUrl = state.tabUrl) {
    commit(mutationTypes.setTimestamps, []);
    commit(mutationTypes.setEpisodeUrl, undefined);
    commit(mutationTypes.setEpisode, undefined);
    commit(mutationTypes.setInferredEpisodeInfo, undefined);
    commit(mutationTypes.setIsInitialBuffer, true);

    commit(mutationTypes.initialVideoDataRequestState, RequestState.LOADING);
    try {
      await Promise.all([
        dispatch(types.inferEpisodeInfo),
        dispatch(types.fetchEpisodeByUrl, tabUrl),
      ]);
      commit(mutationTypes.initialVideoDataRequestState, RequestState.SUCCESS);
    } catch (err) {
      commit(mutationTypes.initialVideoDataRequestState, RequestState.FAILURE);
    }

    if (
      state.episodeUrl == null &&
      state.inferredEpisodeInfo?.name != null &&
      state.inferredEpisodeInfo?.show != null
    ) {
      console.log({ inferred: state.inferredEpisodeInfo });
      dispatch(types.fetchThirdPartyEpisode, {
        name: state.inferredEpisodeInfo.name,
        showName: state.inferredEpisodeInfo.show,
      });
    }
  },
  async [types.fetchEpisodeByUrl]({ commit }, url) {
    try {
      commit(mutationTypes.episodeRequestState, RequestState.LOADING);
      const { episode, ...episodeUrl } = await callApi(commit, global.Api.fetchEpisodeByUrl, url);
      commit(mutationTypes.setEpisodeUrl, episodeUrl);
      commit(mutationTypes.setEpisode, episode);
      commit(mutationTypes.episodeRequestState, RequestState.SUCCESS);
    } catch (err) {
      console.warn('actions.fetchEpisodeByUrl', err);
      commit(mutationTypes.setEpisodeUrl, undefined);
    }
  },
  async [types.inferEpisodeInfo]({ commit }) {
    try {
      commit(mutationTypes.episodeRequestState, RequestState.LOADING);
      const episodeInfo = await global.inferEpisodeInfo();
      if (episodeInfo == null) throw new Error('Could not infer episode info');
      commit(mutationTypes.episodeRequestState, RequestState.SUCCESS);
      commit(mutationTypes.setInferredEpisodeInfo, episodeInfo);
    } catch (err) {
      console.warn('actions.inferEpisodeInfo', err);
      commit(mutationTypes.episodeRequestState, RequestState.FAILURE);
      commit(mutationTypes.setEpisodeUrl, undefined);
    }
  },
  async [types.fetchThirdPartyEpisode](
    { commit },
    { name, showName }: { name: string; showName: string }
  ) {
    console.log({ name, showName });
    try {
      commit(mutationTypes.episodeRequestState, RequestState.LOADING);
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
        commit(mutationTypes.setEpisodeUrl, undefined);
        commit(mutationTypes.setEpisode, {
          ...episode,
          timestamps,
        });
      }
      commit(mutationTypes.episodeRequestState, RequestState.SUCCESS);
    } catch (err) {
      console.warn('actions.fetchThirdPartyEpisode', err);
      commit(mutationTypes.setEpisodeUrl, undefined);
      commit(mutationTypes.setEpisode, undefined);
    }
  },
  async [types.addMissingDurations]({ commit, state, getters }, duration: number) {
    if (!getters.isLoggedIn || !duration) return;

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

      let newEpisode: Api.Episode = { ...episode };
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
      commit(mutationTypes.setEpisodeUrl, newEpisodeUrlNoEpisode);
      commit(mutationTypes.setEpisode, newEpisode);
    }
  },

  // Timestamps
  async [types.updateTimestamps](
    { commit, dispatch },
    {
      oldTimestamps: offsetOldTimestamps,
      newTimestamps: offsetNewTimestamps,
      episodeUrl,
      episode,
    }: {
      oldTimestamps: Api.Timestamp[];
      newTimestamps: Api.AmbigousTimestamp[];
      episodeUrl: Api.EpisodeUrlNoEpisode;
      episode: Api.Episode;
    }
  ) {
    const removeOffset = <T extends Api.AmbigousTimestamp>(timestamp: T): T => {
      const at = Utils.undoTimestampOffset(episodeUrl?.timestampsOffset, timestamp.at);
      return {
        ...timestamp,
        at,
      };
    };
    const oldTimestamps: Api.Timestamp[] = offsetOldTimestamps.map(removeOffset);
    const newTimestamps: Api.AmbigousTimestamp[] = offsetNewTimestamps.map(removeOffset);
    commit(mutationTypes.setSaveTimestampRequestState, RequestState.LOADING);
    const { toCreate, toUpdate, toDelete } = Utils.computeTimestampDiffs(
      oldTimestamps,
      newTimestamps
    );
    commit(mutationTypes.setTimestamps, newTimestamps);

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
      commit(mutationTypes.setSaveTimestampRequestState, RequestState.SUCCESS);
    } catch (err) {
      commit(mutationTypes.setSaveTimestampRequestState, RequestState.FAILURE);
      commit(mutationTypes.setTimestamps, oldTimestamps);
    }
    dispatch(types.fetchEpisodeByUrl, episodeUrl.url);
  },
});
