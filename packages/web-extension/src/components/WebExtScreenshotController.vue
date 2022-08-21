<script lang="ts" setup>
import { onMessage, sendMessage } from '~/utils/web-ext-bridge';
import { usePlayerConfig } from '@anime-skip/player-ui/src/composables/usePlayerConfig';
import { centerFitVideoBounds, fallbackBound } from '~utils/drawing';
import { nextFrame } from '~utils/event-loop';

const props = defineProps<{
  mouseOver: boolean;
  showPlayer: () => void;
  hidePlayer: () => void;
}>();

const config = usePlayerConfig();

onMessage('@anime-skip/start-screenshot', () => {
  props.hidePlayer();
  // Wait for player to re-render as hidden before continuing the screenshot process
  return nextFrame();
});
onMessage('@anime-skip/stop-screenshot', props.showPlayer);
onMessage('@anime-skip/player-screenshot-details', () => {
  const video = config.getVideo();

  const boundingRect = video.getBoundingClientRect();
  const elementBounds = {
    height: fallbackBound(boundingRect?.height),
    left: fallbackBound(boundingRect?.left),
    top: fallbackBound(boundingRect?.top),
    width: fallbackBound(boundingRect?.width),
  };
  const videoWidth = fallbackBound(video.videoWidth, 1);
  const videoHeight = fallbackBound(video.videoHeight, 1);
  return centerFitVideoBounds(elementBounds, videoWidth, videoHeight);
});

function setupContextMenu() {
  sendMessage('@anime-skip/setup-context-menu', undefined);
}
function removeContextMenu() {
  sendMessage('@anime-skip/remove-context-menu', undefined);
}
watch(
  () => props.mouseOver,
  newMouseOver => {
    if (newMouseOver) setupContextMenu();
    else removeContextMenu();
  }
);
</script>
