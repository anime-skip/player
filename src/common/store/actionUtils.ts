import RequestState from '../utils/RequestState';
import { AugmentedActionContext } from './actions';
import { MutationTypes } from './mutationTypes';
import { State } from './state';
import { AssertionError } from 'assert';
import { UNAUTHORIZED_ERROR_MESSAGE } from '../utils/Constants';

type LoggedInState = State & { account: Api.Account };

export function assertLoggedIn(
  context: AugmentedActionContext
): asserts context is AugmentedActionContext<LoggedInState> {
  if (context.state.account == null) {
    context.commit(MutationTypes.SET_LOGIN_REQUEST_STATE, RequestState.NOT_REQUESTED);
    throw new AssertionError({ message: 'state.account does not exist, log in again' });
  }
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export async function callApi<A extends any[], R>(
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
