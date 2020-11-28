export default {
  initialLoad: '@general/initialLoad' as const,
  showDialog: '@general/showDialog' as const,
  startEditing: '@general/startEditing' as const,
  stopEditing: '@general/stopEditing' as const,
  createNewTimestamp: '@general/createNewTimestamp' as const,

  loginManual: '@auth/loginManual' as const,

  updatePreferences: '@preferences/updatePreferences' as const,

  searchShows: '@shows/searchShows' as const,

  createEpisodeData: '@episodes/createEpisodeData' as const,
  fetchEpisodeByUrl: '@episodes/fetchEpisodeByUrl' as const,
  loadAllEpisodeData: '@episodes/loadAllEpisodeData' as const,
  searchEpisodes: '@episodes/searchEpisodes' as const,
  inferEpisodeInfo: '@episodes/inferEpisodeInfo' as const,
  fetchThirdPartyEpisode: '@episodes/getThirdPartyEpisode' as const,
  addMissingDurations: '@episodes/addMissingDurations' as const,

  updateTimestamps: '@timestamps/updateTimestamps' as const,
};
