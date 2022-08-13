<script lang="ts" setup>
import { usePlayerConfig } from '~/composables/usePlayerConfig';
import Messenger from '~/utils/Messenger';
import { centerFitVideoBounds, fallbackBound } from '~utils/drawing';
import { nextFrame } from '~utils/event-loop';

const props = defineProps<{
  mouseOver: boolean;
  showPlayer: () => void;
  hidePlayer: () => void;
}>();

const config = usePlayerConfig();

const messenger = new Messenger('web-ext-screenshot-controller', {
  '@anime-skip/start-screenshot': async () => {
    props.hidePlayer();
    // Wait for player to re-render as hidden before continuing the screenshot process
    await nextFrame();
  },
  '@anime-skip/stop-screenshot': async () => props.showPlayer(),
  '@anime-skip/player-screenshot-details': async () => {
    const video = config.getVideo?.();

    const boundingRect = video?.getBoundingClientRect();
    const elementBounds = {
      height: fallbackBound(boundingRect?.height),
      left: fallbackBound(boundingRect?.left),
      top: fallbackBound(boundingRect?.top),
      width: fallbackBound(boundingRect?.width),
    };
    const videoWidth = fallbackBound(video?.videoWidth, 1);
    const videoHeight = fallbackBound(video?.videoHeight, 1);
    return centerFitVideoBounds(elementBounds, videoWidth, videoHeight);
  },
});

watch(
  () => props.mouseOver,
  newMouseOver => {
    if (newMouseOver) setupContextMenu();
    else removeContextMenu();
  }
);
function setupContextMenu() {
  messenger.send('@anime-skip/setup-context-menu', undefined);
}
function removeContextMenu() {
  messenger.send('@anime-skip/remove-context-menu', undefined);
}
</script>
