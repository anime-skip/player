import md5 from 'md5';
import { useUpdateAuth } from '~/stores/useAuth';
import { useUpdateGeneralPreferences } from '~/stores/useGeneralPreferences';
import * as Api from '~api';
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

    await updateAuth({
      token: res.authToken,
      refreshToken: res.refreshToken,
    });
    await updatePreferences({
      ...res.account.preferences,
    });
    void UsageStats.saveEvent('login');

    return res;
  };
}
