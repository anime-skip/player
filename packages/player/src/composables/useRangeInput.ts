import { MaybeRefOrGetter } from '@vueuse/core';
import { Ref } from 'vue';

/**
 * Mimic the behavior of a range input where your mouse controls poition of a thumb on a regular
 * HTML element.
 */
export default function (
  element: Ref<HTMLElement | undefined | null>,
  min: Ref<number>,
  max: Ref<number>,
  onSeekCompleted?: (value: number) => void,
) {
  const isSeeking = ref(false);
  const seekingValue = ref<number>();

  const { left, right } = useElementBounding(element);

  function updateSeekingValue(event: MouseEvent) {
    seekingValue.value = 0;
    console.log({
      left: left.value,
      right: right.value,
      mouse: event.x,
    });
    const decimalPercent = (event.x - left.value) / (right.value - left.value);
    seekingValue.value = (max.value - min.value) * decimalPercent + min.value;
  }

  useEventListener(element, 'mousedown', (event: MouseEvent) => {
    isSeeking.value = true;
    updateSeekingValue(event);
  });
  // Listen for mouse up globally in case the mouse is not over the timeline when moving
  useEventListener('mousemove', (event: MouseEvent) => {
    if (isSeeking.value) updateSeekingValue(event);
  });
  // Listen for mouse up globally in case the mouse is not over the timeline when releasing
  useEventListener('mouseup', (event) => {
    if (isSeeking.value) {
      isSeeking.value = false;
      onSeekCompleted?.(seekingValue.value!);
      seekingValue.value = undefined;
    }
  });

  return {
    isSeeking,
    seekingValue,
  };
}
