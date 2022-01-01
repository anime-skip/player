import { GqlAccount, GqlColorTheme, GqlLoginData, GqlPreferences } from '@anime-skip/api-client';

export { GqlColorTheme as ColorTheme };

export type Preferences = Pick<
  GqlPreferences,
  | 'enableAutoSkip'
  | 'enableAutoPlay'
  | 'colorTheme'
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
export interface Account extends Pick<GqlAccount, 'id'> {
  preferences: Preferences;
}
export interface LoginResponse extends Pick<GqlLoginData, 'authToken' | 'refreshToken'> {
  account: Account;
}
export const PREFERENCES_QUERY = `{
  enableAutoSkip enableAutoPlay colorTheme
  skipBranding skipIntros skipNewIntros skipMixedIntros skipRecaps skipFiller skipCanon skipTransitions skipTitleCard skipCredits skipMixedCredits skipNewCredits skipPreview
}`;

export const LOGIN_QUERY = `{
  authToken refreshToken
  account {
    id
    preferences ${PREFERENCES_QUERY}
  }
}`;
