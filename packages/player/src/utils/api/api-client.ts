import { GraphQLClient } from 'graphql-request';
import { getSdk } from './graphql.generated';
import { fetchRefresh } from './fetch-refresh';

export function useBaseGraphqlClient(): GraphQLClient {
  const options = usePlayerOptions();
  return new GraphQLClient(options.apiUrl, {
    headers: { 'X-Client-ID': options.apiClientId },
  });
}

export function useAuthorizedGraphqlClient(): GraphQLClient {
  const { apiUrl, apiClientId } = usePlayerOptions();
  const baseClient = getSdk(useBaseGraphqlClient());
  const { state: auth } = useAuth();

  return new GraphQLClient(apiUrl, {
    fetch: fetchRefresh({
      fetch,
      async refresh() {
        if (auth.value == null)
          throw Error('Not logged in, cannot refresh token.');
        const data = await baseClient.loginRefresh({
          refreshToken: auth.value.refreshToken,
        });
        auth.value = {
          refreshToken: data.loginRefresh.refreshToken,
          token: data.loginRefresh.authToken,
          account: data.loginRefresh.account,
        };
      },
      shouldRefresh(response) {
        return response.errors?.[0]?.message === 'Invalid Token';
      },
      headers: () => ({
        Authorization: `Bearer ${auth.value?.token}`,
        'X-Client-ID': apiClientId,
      }),
    }),
  });
}
