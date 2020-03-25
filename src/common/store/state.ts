import RequestState from '../utils/RequestState';

export const initialState: VuexState = {
  activeDialog: 'EpisodeEditorDialog', // undefined,
  playbackRate: 1,
  isEditing: true,

  token: undefined,
  tokenExpiresAt: undefined,
  refreshToken: undefined,
  refreshTokenExpiresAt: undefined,
  loginRequestState: RequestState.NOT_REQUESTED,

  account: undefined,
  preferencesRequestState: RequestState.NOT_REQUESTED,

  searchShowsResult: [],
  searchShowsRequestState: RequestState.NOT_REQUESTED,

  searchEpisodesResult: [],
  searchEpisodesRequestState: RequestState.NOT_REQUESTED,
  episodeUrl: undefined,
  episodeRequestState: RequestState.NOT_REQUESTED,
};
