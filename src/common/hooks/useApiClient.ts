/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createCustomAnimeSkipClient } from '~/common/utils/CustomApiClient';
import { useAuth } from '../state/useAuth';
import Utils from '../utils/Utils';

const baseUrls: Record<ExtensionMode, string> = {
  prod: 'https://api.anime-skip.com/',
  beta: 'https://api.anime-skip.com/',
  staged: 'https://staged.api.anime-skip.com/',
  dev: 'http://localhost:8081/',
};
const clientId = 'OB3AfF3fZg9XlZhxtLvhwLhDcevslhnr';
const mode = import.meta.env.VITE_EXT_MODE;
const modesToLog: ExtensionMode[] = ['dev', 'staged'];

const client = createCustomAnimeSkipClient(baseUrls[mode], clientId);
if (modesToLog.includes(mode)) {
  client.axios.interceptors.response.use(
    /* eslint-disable no-console */
    response => {
      const requestBody = JSON.parse(response.config.data);
      const formattedGraphql = Utils.formatGraphql(requestBody.query);
      const headers = {
        ...response.config.headers,
        ...response.config.headers.common,
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
      console.debug(`URL: %c${response.config.baseURL}${response.config.url}`, 'color: #137AF8');
      console.debug('Headers: ', headers);
      if (response.config.params) {
        console.debug('Parameters: ', response.config.params);
      }
      if (response.config.data) {
        console.debug(`GraphQL:\n%c${formattedGraphql}`, 'color: #137AF8');
        if (response.config.data.variables) {
          console.debug('Variables: ', response.config.data.variables);
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
  const { auth } = useAuth();
  client.axios.interceptors.request.use(config => {
    // TODO-REQ: fetch with refresh token (exclude login functions)
    if (auth.token) {
      config.headers['Authorization'] = `Bearer ${auth.token}`;
    }
    return config;
  });

  const apiProxy = new Proxy(client, {
    get(target, field, _receiver) {
      return async function (...args: any[]) {
        if (field === 'axios') return (target as any)[field];
        try {
          return await (target as any)[field](...args);
        } catch (err) {
          if (err.status === 401) {
            console.warn('Token expired, logging out');
            // TODO-REQ: Try refresh token
          } else {
            throw err;
          }
        }
      };
    },
  });

  return apiProxy;
}
