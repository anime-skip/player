import { MaybeComputedElementRef, MaybeElement } from '@vueuse/core';
import gsap from 'gsap';

/**
 * Return an animated width that can be used in the `style` attribute.
 *
 * Here's the minimum setup required to make everything animate:
 *
 * ```vue
 * <script lang="ts" setup>
 * const content = ref<HtmlElement>();
 * cosnt width = useWidthAnimation(element);
 * </script>
 *
 * <template>
 *   <div class="overflow-x-hidden" :style="{ width }">
 *     <div ref="content" class="w-fit">
 *       <!-- dynamic width content -->
 *     </div>
 *   </div>
 * <template>
 * ```
 */
export default function (element: MaybeComputedElementRef<MaybeElement>) {
  const { width } = useElementSize(element);

  const animated = reactive({
    width: width.value,
  });

  watch(width, (width) => {
    gsap.to(animated, {
      duration: 0.2,
      width,
    });
  });

  return computed(() => `${animated.width}px`);
}
