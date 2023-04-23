import { inject } from 'vue';
import { InternalPlayerOptions } from '../options';
import { InjectionKey } from '../utils/InjectionKey';

/**
 * Returns the options provided to the player when calling `createPlayer`.
 */
export default function (): InternalPlayerOptions {
  const options = inject<InternalPlayerOptions>(InjectionKey.PlayerOptions);
  if (options == null)
    throw Error(
      'Player options not provided to vue app. Did you forget to call `app.provide(...)`',
    );

  return options;
}
