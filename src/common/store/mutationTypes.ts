export default {
  restoreState: '@@storage/restoreState' as const,
  persistPreferences: '@@storage/persistPreferences' as const,

  login: '@@auth/login' as const,
  logOut: '@@auth/logOut' as const,
  loginRequestState: '@@auth/loginRequestState' as const,

  togglePref: '@@preferences/togglePref' as const,
  preferencesRequestState: '@@preferences/preferencesRequestState' as const,

  setEpisodeInfo: '@@episodes/setEpisodeInfo' as const,
};
