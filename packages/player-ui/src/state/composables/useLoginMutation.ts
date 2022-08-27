import { useMutation } from 'vue-query';
import md5 from 'md5';
import { useApiClient } from '../../composables/useApiClient';
import { gql } from '../../utils/gql';
import * as Api from '@anime-skip/api-client';

// Preferences

export const AuthAccountPreferencesFragment = gql`
  fragment AuthAccountPreferencesFragment on Preferences {
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
  }
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

export const AuthAccountFragment = gql`
  fragment AuthAccountFragment on Account {
    id
  }
`;

export interface AuthAccount extends Pick<Api.GqlAccount, 'id'> {
  preferences: AuthAccountPreferences;
}

// Auth

const AuthFragment = gql`
  fragment AuthFragment on Auth {
    authToken
    refreshToken
  }
`;

interface Auth extends Pick<Api.GqlLoginData, 'authToken' | 'refreshToken'> {
  account: AuthAccount;
}

// Query

const query = gql`
  {
    ...AuthFragment
    account {
      ...AuthAccountFragment
      preferences {
        ...AuthAccountPreferencesFragment
      }
    }
  }

  ${AuthFragment}
  ${AuthAccountFragment}
  ${AuthAccountPreferencesFragment}
`;

export function useLoginMutation() {
  const api = useApiClient();

  return useMutation(async (vars: { username: string; password: string }): Promise<Auth> => {
    const passwordHash = md5(vars.password);
    return api.login(query, { passwordHash, usernameEmail: vars.username });
  });
}
