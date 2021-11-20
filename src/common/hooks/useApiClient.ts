/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createCustomAnimeSkipClient } from '~/common/utils/CustomApiClient';
import { useClearTokens } from '../state/useAuth';
import { useResetPreferences } from '../state/useGeneralPreferences';
import { LogoutError } from '../utils/LogoutError';
import UsageStats from '../utils/UsageStats';
import Utils from '../utils/Utils';
import useTokenRefresher from './useTokenRefresher';

const baseUrls: Record<ExtensionMode, string> = {
  prod: 'https://api.anime-skip.com/',
  beta: 'https://api.anime-skip.com/',
  test: 'http://test.api.anime-skip.com/',
  staged: 'https://staged.api.anime-skip.com/',
  dev: 'http://localhost:8081/',
};
const clientId = 'OB3AfF3fZg9XlZhxtLvhwLhDcevslhnr';
const modesToLog: ExtensionMode[] = ['dev', 'staged'];

const client = createCustomAnimeSkipClient(baseUrls[EXTENSION_MODE], clientId);
if (modesToLog.includes(EXTENSION_MODE)) {
  // Uncomment if status code 422 is coming back
  // client.axios.interceptors.request.use(config => {
  //   console.log(JSON.stringify(config, null, 2));
  //   return config;
  // });
  client.axios.interceptors.response.use(
    /* eslint-disable no-console */
    response => {
      // disabled since axios@0.24
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const requestBody = JSON.parse(response.config.data!);
      const formattedGraphql = Utils.formatGraphql(requestBody.query);
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
      console.groupCollapsed(
        `%cAPI  %c${response.config.method} ${response.config.url} (${requestBody.operationName})`,
        'font-weight: 600; color: default;',
        'font-weight: 400; color: default;'
      );
      console.debug(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        `URL: %c${response.config.baseURL! + response.config.url?.replace('/', '')}`,
        'color: #137AF8'
      );
      console.debug('Headers: ', headers);
      if (response.config.params) {
        console.debug('Parameters: ', response.config.params);
      }
      if (response.config.data) {
        console.debug(`GraphQL:\n%c${formattedGraphql}`, 'color: #137AF8');
        if (requestBody.variables) {
          console.debug('Variables: ', requestBody.variables);
        }
      }
      console.debug('Response: ', response.data);
      console.groupEnd();

      return response;
    }
    /* eslint-enable no-console */
  );
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
            console.warn('Logging out...');
            clearTokens();
            resetPreferences();
            void UsageStats.saveEvent('forced_logout');
          }
          throw err;
        }
      };
    },
  });

  return apiProxy;
}
