import { useGeneralPreferences } from '../stores/useGeneralPreferences';
import { useVideoController, useVideoState } from '../stores/useVideoState';

/**
 * Connect the playback rate in the video state and the general preferences so they stay in sync.
 */
export function usePlaybackRateConnector() {
  const videoController = useVideoController();
  const videoState = useVideoState();
  const generalPrefs = useGeneralPreferences();
  // onMounted(() => {
  //   videoController.setPlaybackRate(videoState.playbackRate);
  // });
  watch(
    () => generalPrefs.value.playbackRate,
    newPlaybackRate => {
      // if (newPlaybackRate !== videoState.playbackRate) {
      if (newPlaybackRate !== videoState.playbackRate) {
        videoController.setPlaybackRate(newPlaybackRate);
      }
      // }
    }
  );
}
