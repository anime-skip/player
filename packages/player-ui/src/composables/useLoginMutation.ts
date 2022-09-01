import { useMutation } from 'vue-query';
import md5 from 'md5';
import { useApiClient } from '../composables/useApiClient';
import * as Api from '@anime-skip/api-client';

// Preferences

export const AuthAccountPreferencesFragment = `
  enableAutoSkip
  enableAutoPlay
  hideTimelineWhenMinimized
  minimizeToolbarWhenEditing
  colorTheme
  skipBranding
  skipIntros
  skipNewIntros
  skipMixedIntros
  skipRecaps
  skipFiller
  skipCanon
  skipTransitions
  skipTitleCard
  skipCredits
  skipMixedCredits
  skipNewCredits
  skipPreview
`;

export interface AuthAccountPreferences
  extends Pick<
    Api.GqlPreferences,
    | 'enableAutoSkip'
    | 'enableAutoPlay'
    | 'hideTimelineWhenMinimized'
    | 'minimizeToolbarWhenEditing'
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
  > {}

// Account

export const AuthAccountFragment = `
  id
`;

export interface AuthAccount extends Pick<Api.GqlAccount, 'id'> {
  preferences: AuthAccountPreferences;
}

// Auth

const AuthFragment = `
  authToken
  refreshToken
`;

interface Auth extends Pick<Api.GqlLoginData, 'authToken' | 'refreshToken'> {
  account: AuthAccount;
}

// Query

const query = `
  {
    ${AuthFragment}
    account {
      ${AuthAccountFragment}
      preferences {
        ${AuthAccountPreferencesFragment}
      }
    }
  }
`;

export function useLoginMutation() {
  const api = useApiClient();

  return useMutation({
    async mutationFn(vars: { username: string; password: string }): Promise<Auth> {
      const passwordHash = md5(vars.password);
      return api.login(query, { passwordHash, usernameEmail: vars.username });
    },
  });
}
