declare interface VuexState {
  activeDialog: string | undefined;
  /**
   * A number from 0 to 4. This is not a percentage, but a mulitpier
   */
  playbackRate: number;
  isEditing: boolean;
  isInitialBuffer: boolean;
  selectedTimestamp: Api.AmbigousTimestamp | undefined;
  tabUrl: string;
  browserType: BrowserType;
  hasSkippedFromZero: boolean;
  duration?: number;

  token: string | undefined;
  tokenExpiresAt: number | undefined;
  refreshToken: string | undefined;
  refreshTokenExpiresAt: number | undefined;
  loginRequestState: RequestState;

  account: Api.Account | undefined;
  preferencesRequestState: RequestState | undefined;
  preferencesLastUpdatedAt: number;

  primaryKeyboardShortcuts: KeyboardShortcutsMap | undefined;
  secondaryKeyboardShortcuts: KeyboardShortcutsMap | undefined;

  searchShowsResult: Api.ShowSearchResult[];
  searchShowsRequestState: RequestState;

  searchEpisodesResult: Api.EpisodeSearchResult[];
  searchEpisodesRequestState: RequestState;
  episodeUrl: Api.EpisodeUrlNoEpisode | undefined;
  episode: Api.Episode | undefined;
  inferredEpisodeInfo: InferredEpisodeInfo | undefined;
  episodeRequestState: RequestState;
  initialVideoDataRequestState: RequestState;

  editTimestampMode: 'add' | 'edit' | undefined;
  activeTimestamp: Api.AmbigousTimestamp | undefined;
  hoveredTimestamp: Api.AmbigousTimestamp | undefined;
  timestamps: Api.AmbigousTimestamp[];
  draftTimestamps: Api.AmbigousTimestamp[];
  saveTimestampsRequestState: RequestState;
}
