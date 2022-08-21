import { InternalPlayerConfig, PlayerConfig } from 'common/src/types';

const CONFIG_INJECTION_KEY = Symbol('player-config');

export function providePlayerConfig(config: InternalPlayerConfig) {
  // Validate everything was set that was needed
  const { error } = PlayerConfig.validate(config);
  if (error) throw error;

  provide<InternalPlayerConfig>(CONFIG_INJECTION_KEY, config);
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
