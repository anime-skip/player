import Browser from '@/common/utils/Browser';
import { ActionContext, Action } from 'vuex';
import { persistedKeys } from '@/common/utils/Constants';
import mutations from './mutationTypes';
import { as, sleep } from '../utils/GlobalUtils';
import types from './actionTypes';
import RequestState from '../utils/RequestState';
import { AssertionError } from 'assert';
import mutationTypes from './mutationTypes';

// TODO make everything async

type VuexStateWithAccount = VuexState & { account: Api.Account };

// Helpers /////////////////////////////////////////////////////////////////////

async function loginRefresh(
  { commit }: ActionContext<VuexState, VuexState>,
  { refreshToken }: LoginRefreshPayload
): Promise<void> {
  console.info('actions.loginRefresh', { refreshToken });
  try {
    commit(mutations.loginRequestState, RequestState.LOADING);
    const loginData = await global.Api.loginRefresh(refreshToken);
    commit(mutations.login, loginData);
    commit(mutations.loginRequestState, RequestState.SUCCESS);
  } catch (err) {
    console.error('actions.loginRefresh');
    commit(mutations.loginRequestState, RequestState.FAILURE);
  }
}

function assertLoggedIn(
  context: ActionContext<VuexState, VuexState>
): asserts context is ActionContext<VuexStateWithAccount, VuexStateWithAccount> {
  if (context.state.account == null) {
    context.commit(mutations.loginRequestState, RequestState.NOT_REQUESTED);
    throw new AssertionError({ message: 'state.account does not exist, log in again' });
  }
}

// Actions /////////////////////////////////////////////////////////////////////

export default as<{ [type in ValueOf<typeof types>]: Action<VuexState, VuexState> }>({
  // General
  async [types.initialLoad](context, callback?: () => void) {
    console.info('actions.initialLoad', { callback });
    try {
      const newState = await Browser.storage.getAll<Partial<VuexState>>(persistedKeys);
      context.commit(mutations.restoreState, { changes: newState });

      if (!newState.token) {
        context.commit(mutations.loginRequestState, RequestState.NOT_REQUESTED);
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (Date.now() <= newState.tokenExpiresAt!) {
        context.commit(mutations.loginRequestState, RequestState.SUCCESS);
        return;
      }
      if (newState.refreshToken == null) {
        context.commit(mutations.loginRequestState, RequestState.NOT_REQUESTED);
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (Date.now() > newState.refreshTokenExpiresAt!) {
        context.commit(mutations.loginRequestState, RequestState.NOT_REQUESTED);
        return;
      }

      await loginRefresh(context, { refreshToken: newState.refreshToken });

      if (callback) callback();
    } catch (err) {
      console.error('actions.initialLoad', err);
      context.commit(mutations.loginRequestState, RequestState.NOT_REQUESTED);
    }
  },
  async [types.showDialog]({ state, commit }, dialogName?: string) {
    console.info('actions.showDialog', { dialogName });
    if (state.activeDialog === dialogName) return;

    if (state.activeDialog) {
      commit(mutations.activeDialog, undefined);
      await sleep(250);
    }
    if (dialogName) {
      commit(mutations.activeDialog, dialogName);
    }
  },

  // Auth
  async [types.loginManual]({ commit }, { username, password }: LoginManualPayload) {
    console.info('actions.loginManual', { username });
    try {
      commit(mutations.loginRequestState, RequestState.LOADING);
      const loginData = await global.Api.loginManual(username, password);
      commit(mutations.login, loginData);
      commit(mutations.loginRequestState, RequestState.SUCCESS);
    } catch (err) {
      console.error('actions.loginManual', err);
      commit(mutations.loginRequestState, RequestState.FAILURE);
    }
  },
  [types.loginRefresh]: loginRefresh,

  // Preferences
  async [types.updatePreferences](context, pref: keyof Api.Preferences) {
    console.info('actions.updatePreferences', { pref });
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
        await global.Api.updatePreferences(newPreferences);
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
      console.error('actions.updatePreferences', err);
    }
  },

  // Shows

  // Episodes
  async [types.fetchEpisodeByUrl]({ commit }, url) {
    console.info('actions.fetchEpisodeByUrl', { url });
    try {
      commit(mutationTypes.episodeRequestState, RequestState.LOADING);
      const episodeUrl = await global.Api.fetchEpisodeByUrl(url);
      commit(mutationTypes.episodeRequestState, RequestState.SUCCESS);
      commit(mutationTypes.setEpisodeInfo, episodeUrl);
    } catch (err) {
      console.error('actions.fetchEpisodeByUrl', err);
      commit(mutationTypes.episodeRequestState, RequestState.FAILURE);
    }
  },
});
