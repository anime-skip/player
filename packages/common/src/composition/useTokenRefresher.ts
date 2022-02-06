/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type createAnimeSkipClient from '@anime-skip/api-client';
import { Mutex } from 'async-mutex';
import { AxiosResponse } from 'axios';
import * as Api from '../api';
import { getAuthAsync, updateAuthAsync } from '../state/useAuth';
import { log, warn } from '../utils/log';
import { LogoutError } from '../utils/LogoutError';
import UsageStats from '../utils/UsageStats';

const lock = new Mutex();

function isResponseExpiredToken(res: AxiosResponse<any>): boolean {
  const { data } = res;
  return data?.errors?.find(({ message }: any) => message === 'Invalid Token');
}

export function useTokenRefresher(client: ReturnType<typeof createAnimeSkipClient>): void {
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
    // @ts-ignore: Different versions of axios installed
    if (!isResponseExpiredToken(res)) return res;

    log('Found invalid token, refreshing...');
    delete res.config.headers!['Authorization'];
    if (lock.isLocked()) {
      await lock.waitForUnlock();
      return client.axios.request(res.config);
    }

    const release = await lock.acquire();
    const auth = await getAuthAsync();
    if (!auth.refreshToken) throw new LogoutError(auth.token, auth.refreshToken, undefined);

    try {
      const newTokens = await client.loginRefresh(Api.LOGIN_QUERY, {
        refreshToken: auth.refreshToken,
      });
      await updateAuthAsync({ refreshToken: newTokens.refreshToken, token: newTokens.authToken });
      void UsageStats.saveEvent('login_refresh');
      log('Refreshed token!');
    } catch (err) {
      warn('Could not refresh token:', err);
      throw new LogoutError(
        auth.token,
        auth.refreshToken,
        (err as any).message ?? JSON.stringify(err)
      );
    } finally {
      release();
    }
    return client.axios.request(res.config);
  });
}
