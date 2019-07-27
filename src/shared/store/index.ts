import Vue from 'vue';
import Vuex from 'vuex';
import * as mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

Vue.use(Vuex);

const initialState: VuexState = {
  token: undefined,
  tokenExpiresAt: undefined,
  refreshToken: undefined,
  refreshTokenExpiresAt: undefined,
  loginError: false,
  loginLoading: false,
  loginState: undefined,
  myUser: undefined,
};

export default new Vuex.Store({
  state: initialState,
  mutations,
  actions,
  getters,
});
