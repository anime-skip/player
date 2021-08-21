import { GqlAccount, GqlLoginData, GqlPreferences } from '@anime-skip/axios-api';
import md5 from 'md5';
import { useApiClient } from '../../hooks/useApiClient';
import { useAuth } from '../../state/useAuth';
import { useGeneralPreferences } from '../../state/useGeneralPreferences';

export type Preferences = Omit<
  GqlPreferences,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'userId' | 'user'
>;
export const PREFERENCES_QUERY = `{
  enableAutoSkip enableAutoPlay
  skipBranding skipIntros skipNewIntros skipMixedIntros skipRecaps skipFiller skipCanon skipTransitions skipTitleCard skipCredits skipMixedCredits skipNewCredits skipPreview
}`;

export type LoginResponse = Pick<GqlLoginData, 'authToken' | 'refreshToken'> & {
  account: Pick<GqlAccount, 'username' | 'emailVerified'> & {
    preferences: Preferences;
  };
};
// TODO: Do we need account details?? (username, email verified)
const loginQuery = `{
  authToken refreshToken
  account {
    username emailVerified
    preferences ${PREFERENCES_QUERY}
  }
}`;

export function useLogin(api = useApiClient()) {
  const { updatePreferences } = useGeneralPreferences();
  const { updateAuth } = useAuth();

  return async (username: string, password: string): Promise<LoginResponse> => {
    const res = await api.login(loginQuery, {
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
    // TODO: update account details

    return res;
  };
}
