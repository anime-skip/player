import { Provider } from '~/components/Provider';
import { provideTimestampsPanelState } from '~/components/TimestampsPanel/useTimestampPanelState';
import { provideAuth } from '~/stores/useAuth';
import { provideDialogState } from '~/stores/useDialogState';
import { provideEditingState } from '~/stores/useEditingState';
import { provideEpisodeState } from '~/stores/useEpisodeState';
import { provideGeneralPreferences } from '~/stores/useGeneralPreferences';
import { provideHoveredTimestamp } from '~/stores/useHoveredTimestamp';
import { provideInferEpisodeState } from '~/stores/useInferredEpisodeState';
import { providePlayerVisibility } from '~/stores/usePlayerVisibility';
import { providePlayHistory } from '~/stores/usePlayHistory';
import { provideTemplateState } from '~/stores/useTemplateState';
import { provideVideoState } from '~/stores/useVideoState';
import Player from './Player.vue';

export const PlayerContainer = Provider(
  [
    provideAuth,
    provideGeneralPreferences,
    provideTimestampsPanelState,
    provideDialogState,
    provideEditingState,
    provideEpisodeState,
    provideHoveredTimestamp,
    provideInferEpisodeState,
    providePlayHistory,
    providePlayerVisibility,
    provideTemplateState,
    provideVideoState,
  ],
  Player
);
