import { FunctionArgs, useThrottle, useThrottleFn } from '@vueuse/core';
import { useUserActivityStore } from '../stores/useUserActivityStore';

export function useMouseActivity() {
  const activity = useUserActivityStore();

  const mouseOver = ref(false);
  function onMouseEnter() {
    mouseOver.value = true;
    activity.triggerActive();
  }
  function onMouseLeave() {
    mouseOver.value = false;
    activity.clearActive();
  }
  function onMouseMove() {
    activity.triggerActive();
  }

  function throttleLeading<T extends FunctionArgs>(fn: T): T {
    return useThrottleFn(fn, 250, false, true);
  }

  return {
    // We use leading to preserve the order of operations. If using trailing, a mouse move can be called after mouse leave is called.
    onMouseEnter: throttleLeading(onMouseEnter),
    onMouseLeave: throttleLeading(onMouseLeave),
    onMouseMove: throttleLeading(onMouseMove),
  };
}
