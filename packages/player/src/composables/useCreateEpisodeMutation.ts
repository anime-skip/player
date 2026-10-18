import { CreateEpisodeMutationVariables } from '../utils/api';

export default function () {
  const api = useApiClient(true);
  return useMutation({
    mutation: (vars: CreateEpisodeMutationVariables) => api.createEpisode(vars),
  });
}
