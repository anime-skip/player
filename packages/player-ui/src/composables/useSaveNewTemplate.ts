import { RequestState } from 'vue-use-request-state';
import { useApiClient } from '../composables/useApiClient';
import { warn } from '../utils/log';
import * as Api from 'common/src/api';
import { useSaveTemplateTimestamps } from './useSaveTemplateTimestamps';
import { useTemplateEditingStore } from '../stores/useTemplateEditingStore';
import { useQueryClient } from 'vue-query';
import { useEpisodeStore } from '../stores/useEpisodeStore';
import { storeToRefs } from 'pinia';
import { EPISODE_URL_QUERY_KEY } from '../composables/useFindEpisodeUrlQuery';

export function useSaveNewTemplate() {
  const api = useApiClient();
  const editing = useTemplateEditingStore();
  const { episode } = storeToRefs(useEpisodeStore());

  const queryClient = useQueryClient();

  const saveTemplateTimestamps = useSaveTemplateTimestamps();

  return async (
    type: Api.TemplateType,
    seasons: string[] | undefined,
    selectedTimestampIds: string[]
  ): Promise<void> => {
    editing.isSaving = true;
    try {
      if (!episode.value?.show)
        throw Error('Cannot create a template when there is no episode or show');

      // Publish and build local template
      const template = await api.createTemplate(Api.TEMPLATE_DATA, {
        newTemplate: {
          showId: episode.value.show.id,
          type,
          seasons,
          sourceEpisodeId: episode.value.id,
        },
      });
      await saveTemplateTimestamps(template, [], selectedTimestampIds);

      await queryClient.invalidateQueries(EPISODE_URL_QUERY_KEY);
    } catch (err) {
      warn('Failed to create template:', { type, seasons, selectedTimestampIds }, err);
    } finally {
      editing.isSaving = false;
    }
  };
}
