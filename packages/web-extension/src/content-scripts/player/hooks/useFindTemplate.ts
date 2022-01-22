import { useApiClient } from '~/common/hooks/useApiClient';
import GeneralUtils from '~/common/utils/GeneralUtils';
import { debug, log } from '~/common/utils/log';
import { sleep } from '~/common/utils/time';
import * as Api from '~api';
import { useEpisodeTemplate, useUpdateTemplateState } from '../state/useTemplateState';
import { useDuration } from '../state/useVideoState';

export function useFindTemplate() {
  const api = useApiClient();
  const durationRef = useDuration();
  const template = useEpisodeTemplate();
  const updateTemplateState = useUpdateTemplateState();

  async function waitForPlayerDuration(): Promise<number> {
    do {
      if (durationRef.value) {
        return durationRef.value;
      }
      await sleep(50);
      debug('Waiting for player duration...');
      // eslint-disable-next-line no-constant-condition
    } while (true);
  }

  function clearTemplateData() {
    updateTemplateState({ episodeTemplate: undefined, timestamps: undefined });
  }

  return async (showName?: string, season?: string, episodeId?: string): Promise<void> => {
    try {
      const inferredTemplate: Api.Template = await api.findTemplateByDetails(Api.TEMPLATE_DATA, {
        episodeId,
        showName,
        season,
      });

      if (inferredTemplate) {
        // Player has to be loaded before we can show the template timestamps
        const currentDuration = await waitForPlayerDuration();

        const templatesBaseDuration =
          template.value?.sourceEpisode?.baseDuration ?? currentDuration;
        const offset = GeneralUtils.computeTimestampsOffset(templatesBaseDuration, currentDuration);

        const timestamps = inferredTemplate.timestamps?.map(
          (timestamp): Api.Timestamp => ({
            id: timestamp.id,
            at: GeneralUtils.applyTimestampsOffset(offset, timestamp.at),
            source: Api.TimestampSource.ANIME_SKIP,
            typeId: timestamp.typeId,
          })
        );

        updateTemplateState({ episodeTemplate: inferredTemplate, timestamps });
      } else {
        clearTemplateData();
      }
    } catch (err) {
      log('Could not find episode template for', { episodeId, showName, season }, err);
      clearTemplateData();
    }
  };
}
