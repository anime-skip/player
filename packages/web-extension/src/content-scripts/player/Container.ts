import { Provider } from '~/common/components/Provider';
import { provideAuth } from '~/common/state/useAuth';
import { provideGeneralPreferences } from '~/common/state/useGeneralPreferences';
import { provideTimestampsPanelState } from './dialogs/TimestampsPanel/useTimestampPanelState';
import { provideDialogState } from './state/useDialogState';
import { provideEditingState } from './state/useEditingState';
import { provideEpisodeState } from './state/useEpisodeState';
import { provideHoveredTimestamp } from './state/useHoveredTimestamp';
import { provideInferEpisodeState } from './state/useInferredEpisodeState';
import { providePlayerVisibility } from './state/usePlayerVisibility';
import { providePlayHistory } from './state/usePlayHistory';
import { provideTemplateState } from './state/useTemplateState';
import { provideVideoState } from './state/useVideoState';
import WebExtListeners from './WebExtListeners.vue';

export const Container = Provider(
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
  WebExtListeners
);
