import { InputTemplate, Scalars, TimestampFragment } from '../../utils/api';
import { getUniqueExistenceMap } from '../../utils/array-utils';
import { QueryKey } from '../../utils/QueryKey';

interface SaveTemplateVariables {
  id: Scalars['ID']['input'] | undefined;
  newTemplate: InputTemplate;
  oldTimestamps: TimestampFragment[];
  newTimestamps: TimestampFragment[];
}

// TODO: Create a single mutation to create or update a template and it's timestamps
export default function () {
  const api = useApiClient();
  const queryCache = useQueryCache();
  const variables = useFindTemplateVariables();

  return useMutation({
    async mutation({
      newTemplate,
      id,
      oldTimestamps,
      newTimestamps,
    }: SaveTemplateVariables) {
      if (id == null) {
        const { createTemplate: created } = await api.createTemplate({
          newTemplate,
        });
        id = created.id;
      } else {
        await api.updateTemplate({ newTemplate, id });
      }

      const oldTimestampMap = getUniqueExistenceMap(oldTimestamps, 'id');
      const newTimestampMap = getUniqueExistenceMap(newTimestamps, 'id');

      const toAdd = newTimestamps.filter(
        (timestamp) => !oldTimestampMap[timestamp.id],
      );
      const toRemove = oldTimestamps.filter(
        (timestamp) => !newTimestampMap[timestamp.id],
      );
      await Promise.all([
        ...toAdd.map((timestamp) =>
          api.addTimestampToTemplate({
            timestamp: {
              templateId: id!,
              timestampId: timestamp.id,
            },
          }),
        ),
        ...toRemove.map((timestamp) =>
          api.removeTimestampFromTemplate({
            timestamp: {
              templateId: id!,
              timestampId: timestamp.id,
            },
          }),
        ),
      ]);
    },
    async onSuccess() {
      await queryCache.invalidateQueries({
        key: [QueryKey.FindCurrentTemplate, variables.value ?? null],
      });
    },
  });
}
