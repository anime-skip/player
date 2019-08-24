import Api from '@/shared/utils/Api';
import Browser from '@/shared/utils/Browser';
import { ActionContext } from 'vuex';
import { persistedKeys } from '@/shared/utils/Constants';

export function loginManual(
  { commit }: ActionContext<VuexState, VuexState>,
  { username, password }: LoginManualPayload
): void {
  commit('loginLoading', true);
  Api.loginManual(username, password)
    .then(loginData => {
      commit('login', loginData);
      commit('loginLoading', false);
    })
    .catch(() => {
      commit('loginError');
      commit('loginLoading', false);
    });
}

export function loginRefresh(
  { commit }: ActionContext<VuexState, VuexState>,
  { refreshToken }: LoginRefreshPayload
): void {
  commit('loginLoading', true);
  Api.loginRefresh(refreshToken)
    .then(async loginData => {
      commit('login', loginData);
      commit('loginLoading', false);
    })
    .catch(_ => {
      commit('loginError');
      commit('loginLoading', false);
    });
}

export function initialLoad(
  context: ActionContext<VuexState, VuexState>
): void {
  Browser.storage
    .getAll<VuexState>(persistedKeys)
    .then(async newState => {
      context.commit('restoreState', newState);

      if (!newState.token) {
        context.commit('changeLoginState', false);
        return;
      }
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      if (Date.now() <= newState.tokenExpiresAt!) {
        context.commit('changeLoginState', true);
        return;
      }
      if (newState.refreshToken == null) {
        context.commit('changeLoginState', false);
        return;
      }
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      if (Date.now() > newState.refreshTokenExpiresAt!) {
        context.commit('changeLoginState', false);
        return;
      }

      try {
        await loginRefresh(context, { refreshToken: newState.refreshToken });
        context.commit('changeLoginState', true);
      } catch (err) {
        console.error('Failed to get auth token with the refresh token', err);
        context.commit('changeLoginState', false);
      }
    })
    .catch(err => {
      console.error('Failed getting local storage', err);
    });
}

export function togglePref(
  { commit, state }: ActionContext<VuexState, VuexState>,
  pref: keyof Api.Preferences
): void {
  let value = false;
  if (state.myUser) {
    value = !state.myUser.preferences[pref];
  }
  commit('togglePref', { pref, value });
  Api.mutatePrefs(pref, value, state.token || '')
    .then(() => {
      commit('setPreferenceError', false);
      commit('updatePreference', { pref, value });
    })
    .catch(() => {
      commit('setPreferenceError', true);
      setTimeout(() => {
        commit('togglePref', { pref, value: !value });
      }, 200);
    });
}
