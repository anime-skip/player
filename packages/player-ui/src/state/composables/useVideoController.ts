import { clamp } from '@vueuse/core';
import { useVideoStateStore } from '../stores/useVideoStateStore';

/**
 * Returns a convenience wrapper around `useVideoStateStore`, providing methods to help manipulate
 * the video state.
 */
export function useVideoController() {
  const videoState = useVideoStateStore();

  return {
    /**
     * Play the video, or do nothing if it's already playing
     */
    play() {
      videoState.isPaused = false;
    },
    /**
     * Pause the video, or do nothing if it's already paused
     */
    pause() {
      videoState.isPaused = true;
    },
    /**
     * Play the video if it's paused, pause the video if it's playing
     */
    togglePlayPause() {
      videoState.isPaused = !videoState.isPaused;
    },
    /**
     * Change the speed at which the browser plays back the video.
     * - 0.5 for half speed
     * - 1 for regular speed
     * - 2 for double
     * - etc
     */
    setPlaybackRate(newRate: number) {
      videoState.playbackRate = clamp(newRate, 0.25, 4);
    },
    /**
     * Change the video's volume.
     * - 100 for full volume
     * - 50 for half volume
     * - 0 for no volume
     */
    setVolume(intPercent: number) {
      videoState.volumeIntPercent = clamp(intPercent, 0, 100);
    },
    /**
     * TODO: Document and implement correctly
     */
    clearVolumeChange() {
      videoState.allowVolumeChangeTo = undefined;
    },
    /**
     * Mute the audio. This is different than setting the volume to 0, because when you unmute, the
     * volume is restored.
     */
    mute() {
      videoState.isMuted = true;
    },
    /**
     * Unmute and restore the previous volume.
     */
    unmute() {
      videoState.isMuted = false;
    },
    /**
     * Mute the video when unmuted, and unmute when the video is muted.
     */
    toggleMute() {
      videoState.isMuted = !videoState.isMuted;
    },
    /**
     * Change the video's current playing time in seconds, NOT milliseconds.
     */
    seekTo(newTimeInS: number) {
      videoState.currentTime = clamp(newTimeInS, 0, videoState.duration);
    },
    /**
     * Rewinds the time to the nearest interval in seconds.
     */
    rewindToNearest(intervalInS: number) {
      const currentTime = videoState.currentTime;
      this.seekTo(currentTime - (currentTime % intervalInS));
    },
    /**
     * Move the video player's current time forward by an increment in seconds.
     */
    fastForward(incrementInS: number) {
      this.seekTo(videoState.currentTime + incrementInS);
    },
    /**
     * Move the video player's current time back by an increment in seconds.
     */
    rewind(incrementInS: number) {
      this.seekTo(videoState.currentTime - incrementInS);
    },
  };
}
