import { MaybeComputedElementRef, MaybeElement } from '@vueuse/core';
import { ComputedRef, StyleValue } from 'vue';

export default function (
  element: MaybeComputedElementRef<MaybeElement>,
): ComputedRef<StyleValue> {
  const { left, right, top, bottom } = useElementBounding(element);

  return computed(() => {
    const offsetLeft = -Math.min(left.value, 0);
    const offsetRight = -Math.min(right.value, 0);
    const offsetTop = -Math.min(top.value, 0);
    const offsetBottom = -Math.min(bottom.value, 0);

    const x = offsetLeft - offsetRight;
    const y = offsetTop - offsetBottom;

    return { transform: `translate(${x}px, ${y}px)` };
  });
}
