import { SavePreferencesMutationVariables } from '../utils/api';

export default function () {
  const api = useApiClient(true);
  return useMutation({
    mutation: (vars: SavePreferencesMutationVariables) =>
      api.savePreferences(vars),
  });
}
