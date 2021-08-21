import { EffectScope, effectScope, onScopeDispose } from 'vue';

export function createSharedComposable<T extends (...args: unknown[]) => any>(composable: T) {
  let subscribers = 0;
  let state: ReturnType<T> | undefined | null;
  let scope: EffectScope | null;

  const dispose = () => {
    if (scope && --subscribers <= 0) {
      scope.stop();
      state = null;
      scope = null;
    }
  };

  return (...args: Parameters<T>) => {
    subscribers++;
    if (!state) {
      scope = effectScope(true);
      state = scope.run<ReturnType<T>>(() => composable(...args));
    }
    onScopeDispose(dispose);
    return state as ReturnType<T>;
  };
}
