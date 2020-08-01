export default {
  initialLoad: '@general/initialLoad' as const,
  showDialog: '@general/showDialog' as const,
  startEditing: '@general/startEditing' as const,
  stopEditing: '@general/stopEditing' as const,

  loginManual: '@auth/loginManual' as const,
  loginRefresh: '@auth/loginRefresh' as const,

  updatePreferences: '@preferences/updatePreferences' as const,

  searchShows: '@shows/searchShows' as const,

  createEpisodeData: '@episodes/createEpisodeData' as const,
  fetchEpisodeByUrl: '@episodes/fetchEpisodeByUrl' as const,
  searchEpisodes: '@episodes/searchEpisodes' as const,

  updateTimestamps: '@timestamps/updateTimestamps' as const,
};
