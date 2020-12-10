export enum ActionTypes {
  INITIAL_LOAD = '@root/INITIAL_LOAD',
  SHOW_DIALOG = '@root/SHOW_DIALOG', // TODO: add HIDE_DIALOG
  START_EDITING = '@root/START_EDITING',
  STOP_EDITING = '@root/STOP_EDITING',
  CREATE_NEW_TIMESTAMP = '@root/CREATE_NEW_TIMESTAMP',
  API_CALL = '@root/API_CALL',

  LOGIN_MANUAL = '@root/LOGIN_MANUAL',

  UPDATE_PREFERENCES = '@root/UPDATE_PREFERENCES',

  SEARCH_SHOWS = '@root/SEARCH_SHOWS',

  LINK_EPISODE_URL = '@root/LINK_EPISODE_URL', // TODO: rename to CONNECT_EPISODE_URL
  CREATE_EPISODE_DATA = '@root/CREATE_EPISODE_DATA',
  CREATE_EPISODE_FROM_THIRD_PARTY = '@root/CREATE_EPISODE_FROM_THIRD_PARTY',
  FETCH_EPISODE_BY_URL = '@root/FETCH_EPISODE_BY_URL',
  LOAD_ALL_EPISODE_DATA = '@root/LOAD_ALL_EPISODE_DATA', // TODO: rename to LOAD_NEW_VIDEO_INFO
  SEARCH_EPISODES = '@root/SEARCH_EPISODES',
  INFER_EPISODE_INFO = '@root/INFER_EPISODE_INFO',
  FETCH_THIRD_PARTY_EPISODE = '@root/FETCH_THIRD_PARTY_EPISODE',
  ADD_MISSING_DURATIONS = '@root/ADD_MISSING_DURATIONS',

  UPDATE_TIMESTAMPS = '@root/UPDATE_TIMESTAMPS',
}

// export default {
//   initialLoad: '@general/initialLoad' as const,
//   showDialog: '@general/showDialog' as const,
//   startEditing: '@general/startEditing' as const,
//   stopEditing: '@general/stopEditing' as const,
//   createNewTimestamp: '@general/createNewTimestamp' as const,
//   apiCall: '@general/apiCall' as const,

//   loginManual: '@auth/loginManual' as const,

//   updatePreferences: '@preferences/updatePreferences' as const,

//   searchShows: '@shows/searchShows' as const,

//   linkEpisodeUrl: '@episodes/linkEpisodeUrl' as const,
//   createEpisodeData: '@episodes/createEpisodeData' as const,
//   createEpisodeFromThirdParty: '@episodes/createEpisodeFromThirdParty' as const,
//   fetchEpisodeByUrl: '@episodes/fetchEpisodeByUrl' as const,
//   loadAllEpisodeData: '@episodes/loadAllEpisodeData' as const,
//   searchEpisodes: '@episodes/searchEpisodes' as const,
//   inferEpisodeInfo: '@episodes/inferEpisodeInfo' as const,
//   fetchThirdPartyEpisode: '@episodes/getThirdPartyEpisode' as const,
//   addMissingDurations: '@episodes/addMissingDurations' as const,

//   updateTimestamps: '@timestamps/updateTimestamps' as const,
// };
