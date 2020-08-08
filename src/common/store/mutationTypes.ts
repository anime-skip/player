export default {
  activeDialog: '@@general/activeDialog' as const,
  changePlaybackRate: '@@general/changePlaybackRate' as const,
  toggleEditMode: '@@general/toggleEditMode' as const,
  setTabUrl: '@@general/setTabUrl' as const,
  setHasSkippedFromZero: '@@general/setHasSkippedFromZero' as const,

  restoreState: '@@storage/restoreState' as const,
  persistPreferences: '@@storage/persistPreferences' as const,

  login: '@@auth/login' as const,
  logOut: '@@auth/logOut' as const,
  loginRequestState: '@@auth/loginRequestState' as const,

  togglePref: '@@preferences/togglePref' as const,
  preferencesRequestState: '@@preferences/preferencesRequestState' as const,

  searchShowsRequestState: '@@shows/searchShowsRequestState' as const,
  searchShowsResult: '@@shows/searchShowsResult' as const,

  searchEpisodesRequestState: '@@episodes/searchEpisodesRequestState' as const,
  searchEpisodesResult: '@@episodes/searchEpisodesResult' as const,
  setEpisodeInfo: '@@episodes/setEpisodeInfo' as const,
  episodeRequestState: '@@episodes/episodeRequestState' as const,

  setActiveTimestamp: '@@timestamps/setActiveTimestamp' as const,
  clearActiveTimestamp: '@@timestamps/clearActiveTimestamp' as const,
  setDraftTimestamps: '@@timestamps/setDraftTimestamps' as const,
  updateDraftTimestamp: '@@timestamps/updateDraftTimestamp' as const,
  deleteDraftTimestamp: '@@timestamps/deleteDraftTimestamp' as const,
  clearEditTimestampMode: '@@timestamps/clearEditTimestampMode' as const,
  setEditTimestampMode: '@@timestamps/setEditTimestampMode' as const,
};
