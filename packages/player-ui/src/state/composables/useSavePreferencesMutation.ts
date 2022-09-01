import { GqlInputPreferences } from '@anime-skip/api-client';
import { useMutation } from 'vue-query';
import { useApiClient } from '../../composables/useApiClient';
import {
  AllPreferences,
  DEFAULT_REMOTE_PREFERENCES,
  usePreferencesStore,
} from '../stores/usePreferencesStore';
import { AuthAccountPreferences, AuthAccountPreferencesFragment } from './useLoginMutation';

const query = `
  {
    ${AuthAccountPreferencesFragment}
  }
`;

export function useSavePreferencesMutation() {
  const prefs = usePreferencesStore();
  const api = useApiClient();

  return useMutation({
    async mutationFn(changes: Partial<AllPreferences>): Promise<AllPreferences> {
      const preferences = toRaw(prefs.preferences);
      const remoteChanges = Object.entries(changes).reduce<GqlInputPreferences>(
        (res, [key, change]) => {
          // @ts-expect-error: res[key] is bad?
          if (isRemotePref(key)) res[key] = change;
          return res;
        },
        {}
      );
      if (Object.keys(remoteChanges).length > 0)
        await api.savePreferences(query, { preferences: remoteChanges });
      return { ...preferences, ...changes };
    },
    async onMutate(changes) {
      // Define a value we can rollback to
      const rollbackTo = toRaw(prefs.preferences);

      // Perform optimistic update
      await prefs.setPartialPrefs(changes);

      return { rollbackTo };
    },
    async onError(_err, _vars, ctx) {
      // Rollback optimistic update on error
      if (ctx) {
        console.warn('Rolling back preferences mutation to', ctx.rollbackTo);
        await prefs.setAllPrefs(ctx.rollbackTo);
      }
    },
  });
}

function isRemotePref(pref: string): pref is keyof AuthAccountPreferences {
  return pref in DEFAULT_REMOTE_PREFERENCES;
}
