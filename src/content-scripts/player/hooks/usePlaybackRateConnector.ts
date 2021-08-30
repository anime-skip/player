import { useGeneralPreferences } from '~/common/state/useGeneralPreferences';
import { useVideoController, useVideoState } from '../state/useVideoState';

/**
 * Connect the playback rate in the video state and the general preferences so they stay in sync.
 */
export function usePlaybackRateConnector() {
  const videoController = useVideoController();
  const videoState = useVideoState();
  const generalPrefs = useGeneralPreferences();
  const playbackRate = computed(() => generalPrefs.value.playbackRate);
  watch(playbackRate, newPlaybackRate => {
    if (newPlaybackRate !== videoState.playbackRate) {
      videoController.setPlaybackRate(newPlaybackRate);
    }
  });
}
