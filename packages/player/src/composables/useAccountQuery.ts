import { QueryKey } from '../utils/QueryKey';

/**
 * Queries the logged in user's latest account data, including preferences. When retrieved, it sets
 * the account and preferences in storage.
 *
 * If not logged in, it does nothing.
 */
export default function () {
  const { state: auth } = useAuth();
  const username = computed(() => auth.value?.account.username);
  const client = useApiClient(true);
  const { state: prefs } = usePreferences();

  return useQuery(
    [QueryKey.Account, username],
    async () => {
      if (!auth.value) return undefined;

      const { account } = await client.account();
      return account;
    },
    {
      onSuccess(data) {
        if (!data || !auth.value || !prefs.value) return;

        const { preferences, ...account } = data;
        auth.value.account = account;
        prefs.value = { ...prefs.value, ...preferences };
      },
    },
  );
}
