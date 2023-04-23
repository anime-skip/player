import { GraphQLClient } from 'graphql-request';
import { getSdk } from './graphql.generated';
import { configureRefreshFetch } from 'refresh-fetch';

export function useBaseGraphqlClient(): GraphQLClient {
  const options = usePlayerOptions();
  return new GraphQLClient(options.apiUrl, {
    headers: { 'X-Client-ID': options.apiClientId },
  });
}

export function useAuthorizedGraphqlClient(): GraphQLClient {
  const { apiUrl, apiClientId } = usePlayerOptions();
  const baseClient = getSdk(useBaseGraphqlClient());
  const { value: auth } = useAuth();

  return new GraphQLClient(apiUrl, {
    fetch: configureRefreshFetch({
      fetch,
      async refreshToken() {
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
      shouldRefreshToken(error) {
        // TODO: implement
        // res.status === 200 && !!error.find(e => e.message === 'Access token is expired');
        console.log(error);
        return false;
      },
    }),
    headers: () => ({
      Authorization: `Bearer ${auth.value?.token}`,
      'X-Client-ID': apiClientId,
    }),
  });
}
