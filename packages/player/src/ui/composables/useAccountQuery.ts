import { QueryKey } from '../../utils/QueryKey';

/**
 * Queries the logged in user's latest account data, including preferences. When
 * retrieved, it sets the account and preferences in storage.
 *
 * If not logged in, it does nothing.
 */
export default function () {
  const { state: auth } = useAuth();
  const username = computed(() => auth.value?.account.username);
  const client = useApiClient(true);
  const { state: prefs } = usePreferences();

  const query = useQuery({
    key: () => [QueryKey.Account, username.value ?? null],
    async query() {
      if (!auth.value) return undefined;

      const { account } = await client.account();
      return account;
    },
    refetchOnWindowFocus: false,
  });

  watch(query.data, (data) => {
    if (!data || !auth.value || !prefs.value) return;

    const { preferences, ...account } = data;
    auth.value.account = account;
    prefs.value = { ...prefs.value, ...preferences };
  });

  return query;
}
