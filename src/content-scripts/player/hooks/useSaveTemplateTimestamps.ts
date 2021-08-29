import * as Api from '~/common/api';
import { useApiClient } from '~/common/hooks/useApiClient';
import Utils from '~/common/utils/Utils';

export function useSaveTemplateTimestamps() {
  const api = useApiClient();

  return async (template: Api.Template, newTimestampIds: string[]): Promise<string[]> => {
    const oldTimestamps = template.timestampIds;
    const newTimestamps = newTimestampIds;
    const { toCreate, toDelete, toLeave } = Utils.computeListDiffs(
      newTimestamps,
      oldTimestamps,
      item => item,
      (l, r) => l != r
    );

    await Promise.all([
      ...toCreate.map(id =>
        api.addTimestampToTemplate(Api.ADD_TIMESTAMP_TO_TEMPLATE_MUTATION, {
          templateTimestamp: {
            templateId: template.id,
            timestampId: id,
          },
        })
      ),
      ...toDelete.map(id =>
        api.removeTimestampFromTemplate(Api.REMOVE_TIMESTAMP_TO_TEMPLATE_MUTATION, {
          templateTimestamp: {
            templateId: template.id,
            timestampId: id,
          },
        })
      ),
    ]);
    return [...toCreate, ...toLeave];
  };
}
