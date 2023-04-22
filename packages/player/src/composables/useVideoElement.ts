import { Ref } from 'vue';
import { SECOND } from '../utils/time';

const POLL_RATE = SECOND;

/**
 * Poll for the current video element, updating the returned ref if it's different.
 */
export default createSharedComposable((): Readonly<Ref<HTMLVideoElement>> => {
  const options = usePlayerOptions();
  const currentVideo = ref(options.video());

  // Set some default values on any new video elements the player interacts with.
  watch(
    currentVideo,
    (newVideo) => {
      newVideo.controls = false;
      newVideo.loop = false;
      // TODO: check if these were being done before?
      // newVideo.autoplay = true;
      // newVideo.muted = false;
    },
    { immediate: true },
  );

  // Poll to make sure the video element hasn't changed (like from HTML5 navigation)
  useIntervalFn(() => {
    const newVideo = options.video();
    if (currentVideo.value !== newVideo) currentVideo.value = newVideo;
  }, POLL_RATE);

  return currentVideo;
});
