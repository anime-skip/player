import RequestState from '../utils/RequestState';
import Browser from '../utils/Browser';

export const initialState: VuexState = {
  activeDialog: undefined,
  playbackRate: 1,
  isEditing: false,
  tabUrl: Browser.getIframeReferrer(),
  browserType: Browser.detect(),
  hasSkippedFromZero: false,

  token: undefined,
  tokenExpiresAt: undefined,
  refreshToken: undefined,
  refreshTokenExpiresAt: undefined,
  loginRequestState: RequestState.NOT_REQUESTED,

  account: undefined,
  preferencesRequestState: RequestState.NOT_REQUESTED,
  preferencesLastUpdatedAt: 0,

  primaryKeyboardShortcuts: undefined,
  secondaryKeyboardShortcuts: undefined,

  searchShowsResult: [],
  searchShowsRequestState: RequestState.NOT_REQUESTED,

  searchEpisodesResult: [],
  searchEpisodesRequestState: RequestState.NOT_REQUESTED,
  episodeUrl: undefined,
  inferredEpisodeInfo: undefined,
  episodeRequestState: RequestState.NOT_REQUESTED,

  editTimestampMode: undefined,
  activeTimestamp: undefined,
  timestamps: [],
  draftTimestamps: [],
  selectedTimestamp: undefined,
};
