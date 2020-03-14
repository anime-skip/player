import Api from '@/common/Api';
import Browser from '@/common/utils/Browser';
import { ActionContext } from 'vuex';
import { persistedKeys } from '@/common/utils/Constants';
import types from './types';

export function loginManual(
  { commit }: ActionContext<VuexState, VuexState>,
  { username, password }: LoginManualPayload
): void {
  commit(types.loginLoading, true);
  Api.loginManual(username, password)
    .then(loginData => {
      commit(types.login, loginData);
      commit(types.loginLoading, false);
    })
    .catch(() => {
      commit(types.loginError);
      commit(types.loginLoading, false);
    });
}

export function loginRefresh(
  { commit }: ActionContext<VuexState, VuexState>,
  { refreshToken }: LoginRefreshPayload
): void {
  commit(types.loginLoading, true);
  Api.loginRefresh(refreshToken)
    .then(async loginData => {
      commit(types.login, loginData);
      commit(types.loginLoading, false);
    })
    .catch(_ => {
      commit(types.loginError);
      commit(types.loginLoading, false);
    });
}

export function initialLoad(context: ActionContext<VuexState, VuexState>): void {
  Browser.storage
    .getAll<Partial<VuexState>>(persistedKeys)
    .then(async newState => {
      context.commit(types.restoreState, newState);

      if (!newState.token) {
        context.commit(types.changeLoginState, false);
        return;
      }
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      if (Date.now() <= newState.tokenExpiresAt!) {
        context.commit(types.changeLoginState, true);
        return;
      }
      if (newState.refreshToken == null) {
        context.commit(types.changeLoginState, false);
        return;
      }
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      if (Date.now() > newState.refreshTokenExpiresAt!) {
        context.commit(types.changeLoginState, false);
        return;
      }

      try {
        await loginRefresh(context, { refreshToken: newState.refreshToken });
        context.commit(types.changeLoginState, true);
      } catch (err) {
        console.error('Failed to get auth token with the refresh token', err);
        context.commit(types.changeLoginState, false);
      }
    })
    .catch(err => {
      console.error('Failed getting local storage', err);
    });
}

export function updatePreferences(
  { commit, state }: ActionContext<VuexState, VuexState>,
  pref: keyof Api.Preferences
): void {
  if (state.account == null) {
    commit(types.setPreferenceError, true);
    return;
  }
  const allPreferences = state.account.preferences;
  const newValue = !allPreferences[pref];
  const newPreferences = {
    ...allPreferences,
    [pref]: newValue,
  };
  commit(types.togglePref, { pref, value: newValue });
  Api.updatePreferences(newPreferences)
    .then(() => {
      commit(types.setPreferenceError, false);
      commit(types.persistPreferences, newPreferences);
    })
    .catch(() => {
      commit(types.setPreferenceError, true);
      setTimeout(() => {
        commit(types.togglePref, { pref, value: !newValue });
      }, 200);
    });
}
