import { ColorTheme } from '../api';
import { AllPreferences } from './types';

export const defaultPreferences: AllPreferences = {
  colorTheme: ColorTheme.PerService,
  createTimestampSnapBack: true,
  enableAutoPlay: true, // TODO: Expose this pref
  enableAutoSkip: true,
  hideTimelineWhenMinimized: false,
  minimizeToolbarWhenEditing: false,
  playbackRate: 1,

  // Timestamp Types
  // TODO: replace with timestamp type ids
  skipBranding: true,
  skipRecaps: true,
  skipTitleCard: true,
  skipIntros: true,
  skipNewIntros: false,
  skipMixedIntros: false,
  skipCanon: false,
  skipFiller: true,
  skipTransitions: true,
  skipCredits: true,
  skipNewCredits: false,
  skipMixedCredits: false,
  skipPreview: true,
};
