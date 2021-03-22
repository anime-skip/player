import { createStore, CommitOptions, DispatchOptions } from 'vuex';
import { mutations, Mutations } from './mutations';
import { actions, Actions } from './actions';
import { getters, Getters } from './getters';
import { state, State } from './state';
import { Store as VuexStore } from 'vuex';
import plugins from './plugins';

export interface Store extends Omit<VuexStore<State>, 'commit' | 'getters' | 'dispatch'> {
  commit<K extends keyof Mutations>(
    key: K,
    payload?: Parameters<Mutations[K]>[1],
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;

  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };

  dispatch<K extends keyof Actions>(
    key: K,
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
}

export const store: Store = createStore({
  state,
  mutations,
  actions,
  getters,
  plugins,
  strict: process.env.NODE_ENV !== 'production',
});
