import { GqlLoginData, GqlPreferences } from '@anime-skip/axios-api';

export type Preferences = Pick<
  GqlPreferences,
  | 'enableAutoSkip'
  | 'enableAutoPlay'
  | 'skipBranding'
  | 'skipIntros'
  | 'skipNewIntros'
  | 'skipMixedIntros'
  | 'skipRecaps'
  | 'skipFiller'
  | 'skipCanon'
  | 'skipTransitions'
  | 'skipTitleCard'
  | 'skipCredits'
  | 'skipMixedCredits'
  | 'skipNewCredits'
  | 'skipPreview'
>;
export interface Account {
  // extends Pick<GqlAccount, ...>
  preferences: Preferences;
}
export interface LoginResponse extends Pick<GqlLoginData, 'authToken' | 'refreshToken'> {
  account: Account;
}
export const PREFERENCES_QUERY = `{
  enableAutoSkip enableAutoPlay
  skipBranding skipIntros skipNewIntros skipMixedIntros skipRecaps skipFiller skipCanon skipTransitions skipTitleCard skipCredits skipMixedCredits skipNewCredits skipPreview
}`;

export const LOGIN_QUERY = `{
  authToken refreshToken
  account {
    preferences ${PREFERENCES_QUERY}
  }
}`;
