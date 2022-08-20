import md5 from 'md5';
import { useUpdateAuth } from '../stores/useAuth';
import { useUpdateGeneralPreferences } from '../stores/useGeneralPreferences';
import * as Api from 'common/src/api';
import { useApiClient } from './useApiClient';
import { usePlayerConfig } from './usePlayerConfig';

export function useLogin(api = useApiClient()) {
  const updatePreferences = useUpdateGeneralPreferences();
  const updateAuth = useUpdateAuth();
  const { usageClient } = usePlayerConfig();

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
    void usageClient.saveEvent('login');

    return res;
  };
}
