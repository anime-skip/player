import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import { initialState } from './state';
import actionTypes from './actionTypes';
import createLogger from 'vuex/dist/logger';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: initialState,
  mutations,
  actions,
  getters,
  plugins: [createLogger()],
});
store.dispatch(actionTypes.initialLoad);

export default store;
