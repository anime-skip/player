import { GqlLoginData, GqlPreferences } from '@anime-skip/axios-api';
import md5 from 'md5';
import { useApiClient } from '../hooks/useApiClient';
import { useAuth } from '../state/useAuth';
import { useUpdateGeneralPreferences } from '../state/useGeneralPreferences';

export type Preferences = Pick<
  GqlPreferences,
  | 'enableAutoSkip'
  | 'enableAutoPlay'
  | 'skipBranding'
  | 'skipIntros'
  | 'skipNewIntros'
  | 'skipMixedIntros'
  | 'skipRecaps'
  | 'skipFiller'
  | 'skipCanon'
  | 'skipTransitions'
  | 'skipTitleCard'
  | 'skipCredits'
  | 'skipMixedCredits'
  | 'skipNewCredits'
  | 'skipPreview'
>;
export interface Account {
  // extends Pick<GqlAccount, ...>
  preferences: Preferences;
}
export interface LoginResponse extends Pick<GqlLoginData, 'authToken' | 'refreshToken'> {
  account: Account;
}
export const PREFERENCES_QUERY = `{
  enableAutoSkip enableAutoPlay
  skipBranding skipIntros skipNewIntros skipMixedIntros skipRecaps skipFiller skipCanon skipTransitions skipTitleCard skipCredits skipMixedCredits skipNewCredits skipPreview
}`;

// TODO: Do we need account details?? (username, email verified)
export const LOGIN_QUERY = `{
  authToken refreshToken
  account {
    username emailVerified
    preferences ${PREFERENCES_QUERY}
  }
}`;

export function useLogin(api = useApiClient()) {
  const updatePreferences = useUpdateGeneralPreferences();
  const { updateAuth } = useAuth();

  return async (username: string, password: string): Promise<LoginResponse> => {
    const res = await api.login(LOGIN_QUERY, {
      usernameEmail: username,
      passwordHash: md5(password),
    });

    updateAuth({
      token: res.authToken,
      refreshToken: res.refreshToken,
    });
    updatePreferences({
      ...res.account.preferences,
    });

    return res;
  };
}
