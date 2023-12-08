import { ShowFragment, TemplateFragment, TemplateType } from '../utils/api';
import { QueryKey } from '../utils/QueryKey';
import { useQuery } from 'vue-query';
import useFindTemplateVariables from './useFindTemplateVariables';

export default function () {
  const api = useApiClient();

  const variables = useFindTemplateVariables();

  return useQuery(
    [QueryKey.FindCurrentTemplate, variables],
    async (): Promise<TemplateFragment | undefined> => {
      const res = await api
        .findTemplateByDetails(variables.value!)
        .catch(() => {});
      return res?.findTemplateByDetails;
    },
    {
      enabled: computed(() => !!variables.value),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );
}
