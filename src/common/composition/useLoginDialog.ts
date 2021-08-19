import { useStore } from 'vuex';
import { MutationTypes } from '../store/mutationTypes';

export default function useLoginDialog() {
  const store = useStore();

  return {
    openLoginDialog() {
      store.commit(MutationTypes.TOGGLE_LOGIN_DIALOG, true);
    },
    closeLoginDialog() {
      store.commit(MutationTypes.TOGGLE_LOGIN_DIALOG, false);
    },
    toggleLoginDialog() {
      store.commit(MutationTypes.TOGGLE_LOGIN_DIALOG, !store.state.isShowingLoginDialog);
    },
  };
}
