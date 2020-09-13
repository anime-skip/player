declare interface VuexState {
  activeDialog: string | undefined;
  /**
   * A number from 0 to 4. This is not a percentage, but a mulitpier
   */
  playbackRate: number;
  isEditing: boolean;
  selectedTimestamp: Api.AmbigousTimestamp | undefined;
  tabUrl: string;
  browserType: BrowserType;
  hasSkippedFromZero: boolean;

  token: string | undefined;
  tokenExpiresAt: number | undefined;
  refreshToken: string | undefined;
  refreshTokenExpiresAt: number | undefined;
  loginRequestState: RequestState;

  account: Api.Account | undefined;
  preferencesRequestState: RequestState | undefined;
  preferencesLastUpdatedAt: number;

  searchShowsResult: Api.ShowSearchResult[];
  searchShowsRequestState: RequestState;

  searchEpisodesResult: Api.EpisodeSearchResult[];
  searchEpisodesRequestState: RequestState;
  episodeUrl: Api.EpisodeUrl | undefined;
  inferredEpisodeInfo: InferredEpisodeInfo | undefined;
  episodeRequestState: RequestState;

  editTimestampMode: 'add' | 'edit' | undefined;
  activeTimestamp: Api.AmbigousTimestamp | undefined;
  timestamps: Api.AmbigousTimestamp[];
  draftTimestamps: Api.AmbigousTimestamp[];
}
