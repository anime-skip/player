import { AllPreferences } from './types';

export type PreferencesView =
  | PreferencesHeaderView
  | PreferencesCheckboxView
  | PreferencesPlaybackRateView
  | PreferencesGridView
  | PreferencesSelectView
  | PreferencesAlertView
  | PreferencesKeyboardShortcutsView
  | PreferencesAllSettingsLink;

export interface PreferencesHeaderView {
  type: 'header';
  text: string;
}

export interface PreferencesCheckboxView {
  type: 'checkbox';
  preferenceKey: keyof AllPreferences;
  /**
   * When true, if the checkbox is checked, the value is false and if unchecked, the value is true.
   */
  invert?: boolean;
  text: string;
  description?: string;
  isLocal?: boolean;
}

export interface PreferencesPlaybackRateView {
  type: 'playback-rate';
  preferenceKey: keyof AllPreferences;
  isLocal?: boolean;
}

export interface PreferencesGridView {
  type: 'grid';
  columns: 1 | 2 | 3;
  children: PreferencesView[];
}

export interface PreferencesFlexView {
  type: 'flex';
  direction: 'column';
  children: PreferencesView[];
}

export interface PreferencesSelectView {
  type: 'select';
  preferenceKey: keyof AllPreferences;
  label: string;
  options: Array<{ display: string; value: any }>;
  selectLabel?: string;
  isLocal?: boolean;
}

export interface PreferencesAlertView {
  type: 'alert';
  title?: string;
  message?: string;
}

export interface PreferencesKeyboardShortcutsView {
  type: 'keyboard-shortcuts';
}

export interface PreferencesAllSettingsLink {
  type: 'all-settings-link';
}
