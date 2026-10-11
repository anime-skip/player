import { AnyFn, CreateGlobalStateReturn } from '@vueuse/core';
import { EffectScope, ObjectPlugin, effectScope } from 'vue';

const INJECTION_KEY = Symbol(
  'app-state-effect-scope',
) as InjectionKey<EffectScope>;

interface AppState extends ObjectPlugin {
  destroy(): void;
}

/**
 * Provides an effect scope so that {@link createAppState} can be used to create
 * global, stoppable state.
 */
export function defineAppState(): AppState {
  const scope = effectScope();
  return {
    install(app) {
      app.provide(INJECTION_KEY, scope);
    },
    destroy() {
      scope.stop();
    },
  };
}

/**
 * A modified version of Vue-use's `createGlobalState`, but instead of creating
 * it's own effect scope, it uses a single one provided by the parent app that
 * can be stopped when the player is unmounted.
 *
 * @see https://github.com/vueuse/vueuse/blob/main/packages/shared/createGlobalState/index.ts
 */
export function createAppState<Fn extends AnyFn>(
  stateFactory: Fn,
): CreateGlobalStateReturn<Fn> {
  let initialized = false;
  let state: any;

  return ((...args: any[]) => {
    const scope = inject(INJECTION_KEY);
    const err = Error('test');
    if (!scope)
      throw Error(
        'App state plugin not installed: ' + (err.stack ?? '<no stack>'),
      );

    if (!initialized) {
      state = scope.run(() => stateFactory(...args))!;
      initialized = true;
    }
    return state;
  }) as Fn;
}
