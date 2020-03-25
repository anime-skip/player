export default {
  initialLoad: '@general/initialLoad' as const,
  showDialog: '@general/showDialog' as const,

  loginManual: '@auth/loginManual' as const,
  loginRefresh: '@auth/loginRefresh' as const,

  updatePreferences: '@preferences/updatePreferences' as const,

  searchShows: '@shows/searchShows' as const,

  fetchEpisodeByUrl: '@episodes/fetchEpisodeByUrl' as const,
  searchEpisodes: '@episodes/searchEpisodes' as const,
};
