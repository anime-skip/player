export default {
  restoreState: '@@storage/restoreState' as const,
  persistPreferences: '@@storage/persistPreferences' as const,

  changeLoginState: '@@auth/changeLoginState' as const,
  login: '@@auth/login' as const,
  logOut: '@@auth/logOut' as const,
  loginError: '@@auth/loginError' as const,
  loginLoading: '@@auth/loginLoading' as const,

  togglePref: '@@preferences/togglePref' as const,
  setPreferenceError: '@@preferences/setPreferenceError' as const,

  setEpisodeInfo: '@@episodes/setEpisodeInfo' as const,
};
