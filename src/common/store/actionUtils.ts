import { UNAUTHORIZED_ERROR_MESSAGE } from '../utils/Constants';
import RequestState from '../utils/RequestState';
import { AugmentedActionContext } from './actions';
import { MutationTypes } from './mutationTypes';
import { State } from './state';

type LoggedInState = State & { account: Api.Account };

export function assertLoggedIn(
  context: AugmentedActionContext
): asserts context is AugmentedActionContext<LoggedInState> {
  if (!context.state.isLoggedIn) {
    context.commit(MutationTypes.SET_LOGIN_REQUEST_STATE, RequestState.NOT_REQUESTED);
    throw new Error('state.account does not exist, log in again');
  }
}

export async function callApi<A extends unknown[], R>(
  commit: AugmentedActionContext['commit'],
  apiMethod: (...args: A) => Promise<R>,
  ...args: A
): Promise<R> {
  try {
    return await apiMethod(...args);
  } catch (err) {
    if (err.message == UNAUTHORIZED_ERROR_MESSAGE) {
      commit(MutationTypes.LOG_OUT);
    }
    throw err;
  }
}
