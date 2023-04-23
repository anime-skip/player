import { PreferencesFragment } from '../api';

/**
 * A combination of local and remote preferences.
 */
export interface AllPreferences extends LocalPreferences, RemotePreferences {}

/**
 * Preferences from the API associated with the user's current account.
 */
type RemotePreferences = PreferencesFragment;

export interface LocalPreferences {
  createTimestampSnapBack: boolean;
  playbackRate: number;
}
