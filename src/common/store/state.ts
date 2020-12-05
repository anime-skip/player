import RequestState from '../utils/RequestState';
import Browser from '../utils/Browser';

export const initialState: VuexState = {
  activeDialog: undefined,
  playbackRate: 1,
  isEditing: false,
  isInitialBuffer: true,
  tabUrl: Browser.transformServiceUrl(Browser.getIframeReferrer()),
  browserType: Browser.detect(),
  hasSkippedFromZero: false,
  duration: undefined,

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
  episode: undefined,
  inferredEpisodeInfo: undefined,
  episodeRequestState: RequestState.NOT_REQUESTED,
  initialVideoDataRequestState: RequestState.NOT_REQUESTED,

  editTimestampMode: undefined,
  activeTimestamp: undefined,
  hoveredTimestamp: undefined,
  timestamps: [],
  draftTimestamps: [],
  selectedTimestamp: undefined,
  saveTimestampsRequestState: RequestState.NOT_REQUESTED,
};
