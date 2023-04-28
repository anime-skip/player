import { IPlayerStorage } from '../options';
import { MyAccountFragment } from './api';
import { defaultPreferences } from './preferences/defaultPreferences';
import { AllPreferences } from './preferences';
import {
  DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS,
  DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS,
  KeyboardShortcutMap,
} from './keyboard-shortcut-utils';

export function createTypedStorage(storage: IPlayerStorage): TypedStorage {
  const createProperty = <T>(key: string): TypedStorageProperty<T | null> => ({
    get: async () => await storage.getItem(key),
    set: async (newValue) => await storage.setItem(key, newValue),
    key,
  });
  /**
   * Init the value in storage if it is `null`.
   */
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
  /**
   * Merge an object of defaults into the returned object if `null`.
   */
  const createPropertyWithMergedDefaults = <T>(
    key: string,
    defaultObject: T,
  ) => {
    const prop = createProperty<T>(key);
    return {
      ...prop,
      async get() {
        const value = await prop.get();
        return { ...defaultObject, ...value };
      },
    };
  };

  return {
    auth: createProperty('@anime-skip/player/auth'),
    dontShowStoreReviewPromptAgain: createProperty(
      'dontShowStoreReviewPromptAgain',
    ),
    preferences: createPropertyWithMergedDefaults(
      'general-preferences',
      defaultPreferences,
    ),
    primaryKeyboardShortcuts: createPropertyWithMergedDefaults(
      'keyboard-shortcut-primary-action-mapping',
      DEFAULT_PRIMARY_KEYBOARD_SHORTCUTS,
    ),
    secondaryKeyboardShortcuts: createPropertyWithMergedDefaults(
      'keyboard-shortcut-secondary-action-mapping',
      DEFAULT_SECONDARY_KEYBOARD_SHORTCUTS,
    ),
    storeReviewPromptAt: createProperty('storeReviewPromptAt'),
    telemetryInstallId: createPropertyWithInit('telemetry-install-id', () =>
      Math.random().toString(32).substring(2),
    ),
  };
}

export interface TypedStorage {
  auth: TypedStorageProperty<{
    refreshToken: string;
    token: string;
    account: MyAccountFragment;
  } | null>;
  dontShowStoreReviewPromptAgain: TypedStorageProperty<boolean | null>;
  preferences: TypedStorageProperty<AllPreferences>;
  primaryKeyboardShortcuts: TypedStorageProperty<KeyboardShortcutMap>;
  secondaryKeyboardShortcuts: TypedStorageProperty<KeyboardShortcutMap>;
  storeReviewPromptAt: TypedStorageProperty<number | null>;
  telemetryInstallId: TypedStorageProperty<string>;
}

export interface TypedStorageProperty<T> {
  get(): Promise<T>;
  set(newValue: T): Promise<void>;
  key: string;
}
