/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type createAnimeSkipClient from '@anime-skip/api-client';
import { Mutex } from 'async-mutex';
import { AxiosResponse } from 'axios';
import * as Api from '~api';
import { getAuthAsync, updateAuthAsync } from '../state/useAuth';
import { LogoutError } from '../utils/LogoutError';
import UsageStats from '../utils/UsageStats';

const lock = new Mutex();

function isResponseExpiredToken(res: AxiosResponse<any>): boolean {
  const { data } = res;
  return data?.errors?.find(({ message }: any) => message === 'Invalid Token');
}

export default function useTokenRefresher(client: ReturnType<typeof createAnimeSkipClient>): void {
  client.axios.interceptors.request.use(async config => {
    if (!config.headers) config.headers = {};
    if (config.headers['Authorization'] == null) {
      if (lock.isLocked() && config.data?.operationName !== 'LoginRefresh')
        await lock.waitForUnlock();
      const auth = await getAuthAsync();
      if (auth.token) config.headers['Authorization'] = `Bearer ${auth.token}`;
    }
    return config;
  });

  client.axios.interceptors.response.use(async res => {
    // @ts-expect-error: Different versions of axios installed
    if (!isResponseExpiredToken(res)) return res;

    console.log('Found invalid token, refreshing...');
    delete res.config.headers!['Authorization'];
    if (lock.isLocked()) {
      await lock.waitForUnlock();
      return client.axios.request(res.config);
    }

    const release = await lock.acquire();
    const auth = await getAuthAsync();
    if (!auth.refreshToken) throw new LogoutError();

    try {
      const newTokens = await client.loginRefresh(Api.LOGIN_QUERY, {
        refreshToken: auth.refreshToken,
      });
      await updateAuthAsync({ refreshToken: newTokens.refreshToken, token: newTokens.authToken });
      void UsageStats.saveEvent('login_refresh');
      console.log('Refreshed token!');
      release();
    } catch (err) {
      release();
      console.warn('Could not refresh token:', err);
      throw new LogoutError();
    }
    return client.axios.request(res.config);
  });
}
