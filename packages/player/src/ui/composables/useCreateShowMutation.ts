import { CreateShowMutationVariables } from '../../utils/api';

export default function () {
  const api = useApiClient(true);
  return useMutation({
    mutation: (vars: CreateShowMutationVariables) => api.createShow(vars),
  });
}
