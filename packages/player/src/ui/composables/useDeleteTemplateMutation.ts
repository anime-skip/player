import { DeleteTemplateMutationVariables } from '../../utils/api';
import { QueryKey } from '../../utils/QueryKey';
import useFindTemplateVariables from './useFindTemplateVariables';

export default function () {
  const api = useApiClient();
  const queryCache = useQueryCache();
  const variables = useFindTemplateVariables();

  return useMutation({
    mutation: (vars: DeleteTemplateMutationVariables) =>
      api.deleteTemplate(vars),
    async onSuccess() {
      await queryCache.invalidateQueries({
        key: [QueryKey.FindCurrentTemplate, variables.value ?? null],
      });
    },
  });
}
