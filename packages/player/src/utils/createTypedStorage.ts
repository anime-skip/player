import { IPlayerStorage } from '../options';
import * as uuid from 'uuid';
import { MyAccountFragment } from './api/graphql.generated';

export function createTypedStorage(storage: IPlayerStorage): TypedStorage {
  const createProperty = <T>(key: string): TypedStorageProperty<T | null> => ({
    get: async () => await storage.getItem(key),
    set: async (newValue) => await storage.setItem(key, newValue),
    key,
  });
  const createPropertyWithInit = <T>(
    key: string,
    init: () => T,
  ): TypedStorageProperty<T> => {
    const prop = createProperty<T>(key);
    return {
      ...prop,
      async get() {
        const value = await prop.get();
        if (value != null) return value;

        const initValue = init();
        await prop.set(initValue);
        return initValue;
      },
    };
  };

  // prettier-ignore
  return {
    auth: createProperty('@anime-skip/player/auth'),
    dontShowStoreReviewPromptAgain: createProperty('dontShowStoreReviewPromptAgain'),
    preferences: createProperty('general-preferences'),
    keyboardShortcutsPrimary: createProperty('keyboard-shortcut-primary-action-mapping'),
    keyboardShortcutsSecondary: createProperty('keyboard-shortcut-secondary-action-mapping'),
    storeReviewPromptAt: createProperty("storeReviewPromptAt"),
    telemetryInstallId: createPropertyWithInit("telemetry-install-id", uuid.v4)
  };
}

export interface TypedStorage {
  auth: TypedStorageProperty<{
    refreshToken: string;
    token: string;
    account: MyAccountFragment;
  } | null>;
  dontShowStoreReviewPromptAgain: TypedStorageProperty<boolean | null>;
  preferences: TypedStorageProperty<GeneralPreferences>;
  keyboardShortcutsPrimary: TypedStorageProperty<KeyboardShortcutActionMapping>;
  keyboardShortcutsSecondary: TypedStorageProperty<KeyboardShortcutActionMapping>;
  storeReviewPromptAt: TypedStorageProperty<number | null>;
  telemetryInstallId: TypedStorageProperty<string>;
}

// TODO: replace with API types
type GeneralPreferences = unknown;
type KeyboardShortcutActionMapping = unknown;

export interface TypedStorageProperty<T> {
  get(): Promise<T>;
  set(newValue: T): Promise<void>;
  key: string;
}
