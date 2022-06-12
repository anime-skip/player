/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createCustomAnimeSkipClient } from '~utils/CustomApiClient';
import GeneralUtils from '~utils/GeneralUtils';
import { LogoutError } from '~utils/LogoutError';
import { useClearTokens } from '../state/useAuth';
import { useResetPreferences } from '../state/useGeneralPreferences';
import { groupCollapsed, log, warn } from '../utils/log';
import UsageStats from '../utils/UsageStats';
import useTokenRefresher from './useTokenRefresher';

const baseUrls: Record<ExtensionMode, string> = {
  prod: 'https://api.anime-skip.com/',
  beta: 'https://api-v2.anime-skip.com/',
  test: 'http://test.api.anime-skip.com/',
  staged: 'https://staged.api.anime-skip.com/',
  dev: 'http://localhost:8081/',
};
const clientId = 'OB3AfF3fZg9XlZhxtLvhwLhDcevslhnr';
const modesToLog: ExtensionMode[] = ['dev', 'staged'];

const client = createCustomAnimeSkipClient(baseUrls[EXTENSION_MODE], clientId, log);
if (modesToLog.includes(EXTENSION_MODE)) {
  client.axios.interceptors.response.use(response => {
    // disabled since axios@0.24
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const requestBody = JSON.parse(response.config.data!);
    const formattedGraphql = GeneralUtils.formatGraphql(requestBody.query);
    const headers = {
      ...response.config.headers,
      // @ts-expect-error: Common headers should still exist... Failed when upgrading to axios@0.24
      ...response.config.headers.common,
      // @ts-expect-error: method specific headers should still exist... Failed when upgrading to axios@0.24
      ...response.config.headers[response.config.method || 'get'],
    };
    delete headers.get;
    delete headers.post;
    delete headers.put;
    delete headers.delete;
    delete headers.patch;
    delete headers.head;

    groupCollapsed(
      `API ${response.config.method} ${response.config.url} (${requestBody.operationName})`,
      ({ debug }) => {
        debug(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          `URL: %c${response.config.baseURL! + response.config.url?.replace('/', '')}`,
          'color: #137AF8'
        );
        debug('Headers:', headers);
        if (response.config.params) {
          debug('Parameters:', response.config.params);
        }
        if (response.config.data) {
          debug(`GraphQL:\n%c${formattedGraphql}`, 'color: #137AF8');
          if (requestBody.variables) {
            debug('Variables:', requestBody.variables);
          }
        }
        debug('Response:', response.data);
      }
    );

    return response;
  });
}

export function useApiClient() {
  const clearTokens = useClearTokens();
  const resetPreferences = useResetPreferences();

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
            clearTokens();
            resetPreferences();
            void UsageStats.saveEvent('forced_logout', {
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

  return apiProxy;
}
