import Api from '@/shared/utils/Api';
import Browser from '@/shared/utils/Browser';
import { ActionContext } from 'vuex';
import { persistedKeys } from '@/shared/utils/Constants';

export function initialLoad(context: ActionContext<VuexState, VuexState>) {
    Browser.storage.getAll<VuexState>(persistedKeys).then(async (newState) => {
        context.commit('restoreState', newState);

        if (!newState.token) {
            context.commit('changeLoginState', false);
            return;
        }
        if (Date.now() <= newState.tokenExpiresAt!) {
            context.commit('changeLoginState', true);
            return;
        }
        if (newState.refreshToken == null) {
            context.commit('changeLoginState', false);
            return;
        }
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
    }).catch((err) => {
        console.error('Failed getting local storage', err);
    });
}


export function loginManual(
    { commit }: ActionContext<VuexState, VuexState>, { username, password }: LoginManualPayload,
) {
    commit('loginLoading', true);
    Api.loginManual(username, password)
        .then((loginData) => {
            console.log('login data', loginData);
            commit('login', loginData);
            commit('loginLoading', false);
        }).catch((err) => {
            commit('loginError');
            commit('loginLoading', false);
        });
}


export function loginRefresh(
    { commit }: ActionContext<VuexState, VuexState>, { refreshToken }: LoginRefreshPayload,
) {
    commit('loginLoading', true);
    Api.loginRefresh(refreshToken)
        .then(async (loginData) => {
            commit('login', loginData);
            commit('loginLoading', false);
        }).catch((_) => {
            commit('loginError');
            commit('loginLoading', false);
        });
}

export function togglePref(
    { commit, state }: ActionContext<VuexState, VuexState>,
    pref: keyof Api.Preferences,
) {
    const value = !state.myUser!.preferences[pref];
    commit('togglePref', { pref, value });
    Api.mutatePrefs(pref, value, state.token || '')
        .then(() => {
            commit('setPreferenceError', false);
            commit('updatePreference', { pref, value });
        }).catch((err) => {
            console.error('error', err);
            commit('setPreferenceError', true);
            setTimeout(() => {
                commit('togglePref', { pref, value: !value });
            }, 200);
        });
}
