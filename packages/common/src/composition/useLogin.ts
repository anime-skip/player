import md5 from 'md5';
import * as Api from '../api';
import { useUpdateAuth } from '../state/useAuth';
import { useUpdateGeneralPreferences } from '../state/useGeneralPreferences';
import UsageStats from '../utils/UsageStats';
import { useApiClient } from './useApiClient';

export function useLogin(api = useApiClient()) {
  const updatePreferences = useUpdateGeneralPreferences();
  const updateAuth = useUpdateAuth();

  return async (username: string, password: string): Promise<Api.LoginResponse> => {
    const res = await api.login(Api.LOGIN_QUERY, {
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
    void UsageStats.saveEvent('login');

    return res;
  };
}
