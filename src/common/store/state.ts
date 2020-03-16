import RequestState from '../utils/RequestState';

export const initialState: VuexState = {
  activeDialog: undefined,
  playbackRate: 1,
  token: undefined,
  tokenExpiresAt: undefined,
  refreshToken: undefined,
  refreshTokenExpiresAt: undefined,
  loginRequestState: RequestState.NOT_REQUESTED,
  account: undefined,
  preferencesRequestState: RequestState.NOT_REQUESTED,
  episodeUrl: undefined,
  episodeRequestState: RequestState.NOT_REQUESTED,
};
