import { useApiClient } from '~/common/hooks/useApiClient';
import Utils from '~/common/utils/Utils';
import * as Api from '~api';

export function useSaveTemplateTimestamps() {
  const api = useApiClient();

  return async (
    template: Api.Template,
    oldTimestampsIds: string[],
    newTimestampIds: string[]
  ): Promise<string[]> => {
    const { toCreate, toDelete, toLeave } = Utils.computeListDiffs(
      newTimestampIds,
      oldTimestampsIds,
      item => item,
      (l, r) => l != r
    );

    await Promise.all([
      ...toCreate.map(id =>
        api.addTimestampToTemplate(Api.TEMPLATE_TIMESTAMPS_DATA, {
          templateTimestamp: {
            templateId: template.id,
            timestampId: id,
          },
        })
      ),
      ...toDelete.map(id =>
        api.removeTimestampFromTemplate(Api.TEMPLATE_TIMESTAMPS_DATA, {
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
