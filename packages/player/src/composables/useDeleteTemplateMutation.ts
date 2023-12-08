import { QueryKey } from '../utils/QueryKey';
import useFindTemplateVariables from './useFindTemplateVariables';

export default function () {
  const api = useApiClient();
  const queries = useQueryClient();
  const variables = useFindTemplateVariables();

  return useMutation(api.deleteTemplate, {
    async onSuccess() {
      await queries.invalidateQueries([
        QueryKey.FindCurrentTemplate,
        variables.value,
      ]);
    },
  });
}
