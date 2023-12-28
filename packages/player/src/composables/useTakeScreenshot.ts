import { PlayerVisibility } from '../utils/PlayerVisibility';
import { sleep } from '../utils/time-utils';
import useScreenshotPreview from './useScreenshotPreview';

/**
 * Returns function that takes a screenshot of the player.
 */
export default function (onStart?: () => void) {
  const visibility = usePlayerVisibility();
  const { takeScreenshot } = usePlayerOptions();
  const { playing } = useVideoControls();
  const preview = useScreenshotPreview();

  return {
    isScreenshotEnabled: computed(() => !!takeScreenshot),
    takeScreenshot: async () => {
      if (!takeScreenshot) return;

      onStart?.();
      playing.value = false;

      const target = document.querySelector<HTMLElement>('anime-skip-player');
      if (target == null) {
        console.warn('Player not found in DOM, aborting screenshot');
        return;
      }

      // TODO: Shrink bounds to match video's aspect ratio
      const bounds = {
        x: target.clientLeft,
        y: target.clientTop,
        width: target.clientWidth,
        height: target.clientHeight,
      };

      try {
        visibility.value = PlayerVisibility.Hidden;
        await nextTick();
        const result = await takeScreenshot(bounds);
        preview.value = result;
      } finally {
        visibility.value = PlayerVisibility.Visible;
      }
    },
  };
}
