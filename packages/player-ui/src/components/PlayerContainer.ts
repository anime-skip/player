import { Provider } from './Provider';
import { provideTimestampsPanelState } from './TimestampsPanel/useTimestampPanelState';
import Player from '../pages/Player.vue';

export const PlayerContainer = Provider([provideTimestampsPanelState], Player);
