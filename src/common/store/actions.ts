import Api from '@/common/Api';
import Browser from '@/common/utils/Browser';
import { ActionContext, Action } from 'vuex';
import { persistedKeys } from '@/common/utils/Constants';
import mutations from './mutationTypes';
import { as } from '../utils/GlobalUtils';
import types from './actionTypes';
import RequestState from '../utils/RequestState';

// TODO make everything async

// Helpers /////////////////////////////////////////////////////////////////////

function loginRefresh(
  { commit }: ActionContext<VuexState, VuexState>,
  { refreshToken }: LoginRefreshPayload
): void {
  commit(mutations.loginRequestState, RequestState.LOADING);
  Api.loginRefresh(refreshToken)
    .then(async loginData => {
      commit(mutations.login, loginData);
      commit(mutations.loginRequestState, RequestState.SUCCESS);
    })
    .catch(_ => {
      commit(mutations.loginRequestState, RequestState.FAILURE);
    });
}

// Actions /////////////////////////////////////////////////////////////////////

export default as<{ [type in ValueOf<typeof types>]: Action<VuexState, VuexState> }>({
  // General
  [types.initialLoad](context) {
    Browser.storage
      .getAll<Partial<VuexState>>(persistedKeys)
      .then(async newState => {
        context.commit(mutations.restoreState, newState);

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
      })
      .catch(err => {
        console.error('Failed getting local storage', err);
      });
  },

  // Auth
  [types.loginManual]({ commit }, { username, password }: LoginManualPayload) {
    commit(mutations.loginRequestState, RequestState.LOADING);
    Api.loginManual(username, password)
      .then(loginData => {
        commit(mutations.login, loginData);
        commit(mutations.loginRequestState, RequestState.SUCCESS);
      })
      .catch(() => {
        commit(mutations.loginRequestState, RequestState.FAILURE);
      });
  },
  [types.loginRefresh]: loginRefresh,

  [types.updatePreferences]({ commit, state }, pref: keyof Api.Preferences) {
    if (state.account == null) {
      commit(mutations.preferencesRequestState, RequestState.FAILURE);
      return;
    }
    const allPreferences = state.account.preferences;
    const newValue = !allPreferences[pref];
    const newPreferences = {
      ...allPreferences,
      [pref]: newValue,
    };
    commit(mutations.preferencesRequestState, RequestState.LOADING);
    commit(mutations.togglePref, { pref, value: newValue });
    Api.updatePreferences(newPreferences)
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
});
