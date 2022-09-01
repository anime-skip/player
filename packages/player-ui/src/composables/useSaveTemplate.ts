import { RequestState } from 'vue-use-request-state';
import { useApiClient } from '../composables/useApiClient';
import { log } from '../utils/log';
import * as Api from 'common/src/api';
import { useSaveTemplateTimestamps } from './useSaveTemplateTimestamps';
import { useTemplateEditingStore } from '../stores/useTemplateEditingStore';
import { useQueryClient } from 'vue-query';
import { useEpisodeStore } from '../stores/useEpisodeStore';
import { storeToRefs } from 'pinia';
import { EPISODE_URL_QUERY_KEY } from '../composables/useFindEpisodeUrlQuery';

export function useSaveTemplate() {
  const api = useApiClient();
  const editing = useTemplateEditingStore();
  const { episode, template } = storeToRefs(useEpisodeStore());

  const queryClient = useQueryClient();

  const saveTemplateTimestamps = useSaveTemplateTimestamps();

  return async (
    templateId: string,
    type: Api.TemplateType,
    seasons: string[] | undefined,
    selectedTimestampIds: string[]
  ): Promise<void> => {
    editing.isSaving = true;
    try {
      if (!episode.value?.show)
        throw Error('Cannot save a template when there is no episode or show');

      const updatedTemplate: Api.Template = await api.updateTemplate(Api.TEMPLATE_DATA, {
        templateId,
        newTemplate: {
          showId: episode.value?.show.id,
          sourceEpisodeId: episode.value?.id,
          type,
          seasons,
        },
      });
      await saveTemplateTimestamps(
        updatedTemplate,
        (template.value?.timestamps.map(ts => ts.id) as string[]) ?? [],
        selectedTimestampIds
      );

      queryClient.invalidateQueries(EPISODE_URL_QUERY_KEY);
    } catch (err) {
      log('Failed to save template:', err);
    } finally {
      editing.isSaving = false;
    }
  };
}
