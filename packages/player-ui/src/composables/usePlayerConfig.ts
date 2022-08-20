import { InternalPlayerConfig, PlayerConfig, PlayerStorage } from 'common/src/types';

const CONFIG_INJECTION_KEY = Symbol('player-config');
const STORAGE_INJECTION_KEY = Symbol('player-storage');

export function providePlayerConfig(config: InternalPlayerConfig) {
  // Validate everything was set that was needed
  const { error } = PlayerConfig.validate(config);
  if (error) throw error;

  provide<InternalPlayerConfig>(CONFIG_INJECTION_KEY, config);
  providePlayerStorage(config.storage);
}

export function providePlayerStorage(storage: PlayerStorage) {
  provide<PlayerStorage>(STORAGE_INJECTION_KEY, storage);
}

export function usePlayerConfig(): InternalPlayerConfig {
  return inject<InternalPlayerConfig>(
    CONFIG_INJECTION_KEY,
    () => {
      throw Error(
        'player-config has not been provided. Call `providePlayerConfig` higher up the component tree'
      );
    },
    true
  );
}

export function injectPlayerStorage(): PlayerStorage {
  return inject<PlayerStorage>(
    STORAGE_INJECTION_KEY,
    () => {
      throw Error(
        'player-storage has not been provided. Call `providePlayerStorage` higher up the component tree'
      );
    },
    true
  );
}
