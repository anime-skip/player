import { LoginQueryVariables } from '../utils/api';

export default function () {
  const api = useApiClient(false);
  return useMutation({
    mutation: (vars: LoginQueryVariables) => api.login(vars),
  });
}
