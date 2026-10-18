import { TemplateFragment } from '../utils/api';
import { QueryKey } from '../utils/QueryKey';
import useFindTemplateVariables from './useFindTemplateVariables';

export default function () {
  const api = useApiClient();

  const variables = useFindTemplateVariables();

  return useQuery({
    key: () => [QueryKey.FindCurrentTemplate, variables.value ?? null],
    async query(): Promise<TemplateFragment | undefined> {
      const res = await api
        .findTemplateByDetails(variables.value!)
        .catch(() => {});
      return res?.findTemplateByDetails;
    },
    enabled: () => !!variables.value,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
