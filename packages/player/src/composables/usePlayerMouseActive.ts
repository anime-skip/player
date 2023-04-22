import type { MaybeRefOrGetter } from '@vueuse/core';
import type { Ref } from 'vue';
import { MS, SECOND } from '../utils/time';

const RESET_AFTER_DURATION = 3 * SECOND;
const EVENT_THROTTLE_DURATION = 100 * MS;

/**
 * When moving the mouse over the player, the foreground (title, toolbar, etc) will go away after a
 * certain amount of time.
 */
export default function (
  element: MaybeRefOrGetter<EventTarget | null | undefined>,
): Readonly<Ref<boolean>> {
  const isActive = ref(false);
  const resetActivity = useTimeoutFn(
    () => {
      isActive.value = false;
    },
    RESET_AFTER_DURATION - EVENT_THROTTLE_DURATION,
    { immediate: false },
  );

  const setAsActive = useThrottleFn(() => {
    isActive.value = true;
    resetActivity.stop();
    resetActivity.start();
  }, EVENT_THROTTLE_DURATION);

  useEventListener(element, 'mouseenter', setAsActive);
  useEventListener(element, 'mousemove', setAsActive);
  useEventListener(element, 'mouseleave', () => {
    resetActivity.stop();
    isActive.value = false;
  });

  return readonly(isActive);
}
