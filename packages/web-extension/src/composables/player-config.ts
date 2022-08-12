import { InternalPlayerConfig, IPlayerConfig, PlayerConfig } from '~types';
import GeneralUtils from '~utils/GeneralUtils';

const INJECTION_KEY = Symbol('player-config');

export function providePlayerConfig(config: IPlayerConfig) {
  // Validate everything was set that was needed
  const { error } = PlayerConfig.validate(config);
  if (error) throw error;

  // Apply default config
  const internalConfig: InternalPlayerConfig = {
    ...config,
    onPlayDebounceMs: config.onPlayDebounceMs ?? 0,
    transformServiceUrl: config.transformServiceUrl ?? GeneralUtils.stripUrl,
  };

  provide<InternalPlayerConfig>(INJECTION_KEY, internalConfig);
}

export function usePlayerConfig(): InternalPlayerConfig {
  return inject<InternalPlayerConfig>(
    INJECTION_KEY,
    () => {
      throw Error(
        'player-config has not been provided. Call `providePlayerConfig` higher up the component tree'
      );
    },
    true
  );
}
