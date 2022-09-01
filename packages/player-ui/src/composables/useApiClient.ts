import { InternalPlayerConfig } from 'common/src/types';
import {
  createCustomAnimeSkipClient,
  CustomAnimeSkipClient,
} from 'common/src/utils/CustomApiClient';
import { LogoutError } from 'common/src/utils/LogoutError';
import { useAuthStore } from '../stores/useAuthStore';
import { usePreferencesStore } from '../stores/usePreferencesStore';
import { log, warn } from '../utils/log';
import { usePlayerConfig } from './usePlayerConfig';
import useTokenRefresher from './useTokenRefresher';

const INJECTION_KEY = Symbol();

const BASE_URLS: Record<InternalPlayerConfig['apiEnv'], string> = {
  prod: 'https://api.anime-skip.com/',
  test: 'http://test.api.anime-skip.com/',
  local: 'http://localhost:8081/',
};

export function provideApiClient(config: InternalPlayerConfig) {
  const client = createCustomAnimeSkipClient(BASE_URLS[config.apiEnv], config.apiClientId, log);

  const auth = useAuthStore();
  const prefs = usePreferencesStore();

  useTokenRefresher(client);

  // createAuthRefreshInterceptor(
  //   // @ts-expect-error: Odd axios type/version mismatch?
  //   client.axios,
  //   async failedRequest => {
  //     if (!auth.refreshToken) return;
  //     const newAuth = await client.loginRefresh(Api.LOGIN_QUERY, {
  //       refreshToken: auth.refreshToken,
  //     });
  //     failedRequest.response.config.headers['Authorization'] = 'Bearer ' + newAuth.authToken;
  //     updateAuth({ refreshToken: newAuth.refreshToken, token: newAuth.authToken });
  //   },
  //   { pauseInstanceWhileRefreshing: true,  }
  // // );
  // client.axios.interceptors.request.use(config => {
  //   if (auth.token) {
  //     config.headers['Authorization'] = `Bearer ${auth.token}`;
  //   }
  //   return config;
  // });

  const apiProxy = new Proxy(client, {
    get(target, field, _receiver) {
      return async function (...args: any[]) {
        if (field === 'axios') return (target as any)[field];
        try {
          return await (target as any)[field](...args);
        } catch (err) {
          if (err instanceof LogoutError) {
            warn('Logging out...');
            auth.clearTokens();
            prefs.resetToDefault();
            void config.usageClient.saveEvent('forced_logout', {
              tokenExpiredAt: err.tokenExpiresAt(),
              refreshTokenExpiredAt: err.refreshTokenExpiresAt(),
              apiError: err.apiError,
            });
          }
          throw err;
        }
      };
    },
  });

  provide(INJECTION_KEY, apiProxy);
}

export function useApiClient(): CustomAnimeSkipClient {
  return inject<CustomAnimeSkipClient>(
    INJECTION_KEY,
    () => {
      throw Error(
        'Could not inject API client. Did you forget to call `provideApiClient` higher up the component tree?'
      );
    },
    true
  );
}
