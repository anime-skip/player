import Browser from '@/common/utils/Browser';
import { ActionContext, Action } from 'vuex';
import { persistedKeys } from '@/common/utils/Constants';
import mutations from './mutationTypes';
import { as, sleep } from '../utils/GlobalUtils';
import types from './actionTypes';
import RequestState from '../utils/RequestState';
import { stat } from 'fs';
import { AssertionError } from 'assert';
import mutationTypes from './mutationTypes';

// TODO make everything async

type VuexStateWithAccount = VuexState & { account: Api.Account };

// Helpers /////////////////////////////////////////////////////////////////////

function loginRefresh(
  { commit }: ActionContext<VuexState, VuexState>,
  { refreshToken }: LoginRefreshPayload
): void {
  commit(mutations.loginRequestState, RequestState.LOADING);
  global.Api.loginRefresh(refreshToken)
    .then(async loginData => {
      commit(mutations.login, loginData);
      commit(mutations.loginRequestState, RequestState.SUCCESS);
    })
    .catch(_ => {
      commit(mutations.loginRequestState, RequestState.FAILURE);
    });
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
  [types.initialLoad](context, callback?: () => void) {
    Browser.storage
      .getAll<Partial<VuexState>>(persistedKeys)
      .then(async newState => {
        context.commit(mutations.restoreState, { changes: newState });

        if (!newState.token) {
          context.commit(mutations.loginRequestState, RequestState.NOT_REQUESTED);
          return;
        }
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        if (Date.now() <= newState.tokenExpiresAt!) {
          context.commit(mutations.loginRequestState, RequestState.SUCCESS);
          return;
        }
        if (newState.refreshToken == null) {
          context.commit(mutations.loginRequestState, RequestState.NOT_REQUESTED);
          return;
        }
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        if (Date.now() > newState.refreshTokenExpiresAt!) {
          context.commit(mutations.loginRequestState, RequestState.NOT_REQUESTED);
          return;
        }

        try {
          await loginRefresh(context, { refreshToken: newState.refreshToken });
        } catch (err) {
          console.error('Failed to get auth token with the refresh token', err);
        }
        if (callback) callback();
      })
      .catch(err => {
        console.error('Failed getting local storage', err);
      });
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

  // Auth
  [types.loginManual]({ commit }, { username, password }: LoginManualPayload) {
    commit(mutations.loginRequestState, RequestState.LOADING);
    global.Api.loginManual(username, password)
      .then(loginData => {
        commit(mutations.login, loginData);
        commit(mutations.loginRequestState, RequestState.SUCCESS);
      })
      .catch(() => {
        commit(mutations.loginRequestState, RequestState.FAILURE);
      });
  },
  [types.loginRefresh]: loginRefresh,

  // Preferences
  [types.updatePreferences](context, pref: keyof Api.Preferences) {
    assertLoggedIn(context);
    const { commit, state } = context;

    const allPreferences = state.account.preferences;
    const newValue = !allPreferences[pref];
    const newPreferences = {
      ...allPreferences,
      [pref]: newValue,
    };
    commit(mutations.preferencesRequestState, RequestState.LOADING);
    commit(mutations.togglePref, { pref, value: newValue });
    global.Api.updatePreferences(newPreferences)
      .then(() => {
        commit(mutations.preferencesRequestState, RequestState.SUCCESS);
        commit(mutations.persistPreferences, newPreferences);
      })
      .catch(() => {
        commit(mutations.preferencesRequestState, RequestState.FAILURE);
        setTimeout(() => {
          commit(mutations.togglePref, { pref, value: !newValue });
        }, 200);
      });
  },

  // Shows

  // Episodes
  async [types.fetchEpisodeByUrl]({ commit, state }, url) {
    try {
      this.commit(mutationTypes.episodeRequestState, RequestState.LOADING);
      const episodeUrl = await global.Api.fetchEpisodeByUrl(url);
      this.commit(mutationTypes.episodeRequestState, RequestState.SUCCESS);
      this.commit(mutationTypes.setEpisodeInfo, episodeUrl);
    } catch (err) {
      this.commit(mutationTypes.episodeRequestState, RequestState.FAILURE);
    }
  },
});
